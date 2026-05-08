import { SYS_ROLE } from "../../common/constant/role.constant.js";
import { SYS_MESSAGE } from "../../common/constant/message.constant.js";
import { comparePassword, hash } from "../../common/utils/bycrypt.utils.js";
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "../../common/utils/error.utils.js";
import { checkUserExist, createUser } from "../user/user.service.js";
import { generateTokens } from "../../common/utils/jwt.utils.js";
import { otpRepository } from "../../DB/models/otp/otp.repsitory.js";
import { userRepository } from "../../DB/models/user/user.repository.js";
import { tokenRepository } from "../../DB/models/token/token.repository.js";
import { OAuth2Client } from "google-auth-library";
import { redisClient } from "../../DB/models/redis.connection.js";
import jwt from "jsonwebtoken";
import { encryption } from "../../common/utils/encryption.utils.js";
import { sendEmail } from "../../common/utils/email.utils.js";

export const singup = async (body) => {
  const { email, phoneNumber } = body;
  
  const existingUser = await checkUserExist({
    $or: [
      { email: { $eq: email, $exists: true, $ne: null } },
      { phoneNumber: { $eq: phoneNumber, $exists: true, $ne: null } },
    ],
  });

  if (existingUser) {
    if (existingUser.isEmailVarified) {
      const field = existingUser.email === email ? "Email" : "Phone number";
      throw new ConflictException(`${field} is already registered. Please login.`);
    } else {
      await userRepository.deleteOne({ _id: existingUser._id });
    }
  }

  body.role = SYS_ROLE.user;
  body.password = await hash(body.password);
  body.provider = "system";

  if (body.phoneNumber) {
    body.phoneNumber = encryption(body.phoneNumber);
  }

  // Clear ANY existing session/OTP for this email before starting fresh
  await redisClient.del(`active_otp:${email}`);
  await redisClient.del(`tempUser:${email}`);

  await sendOtp(body);
  await redisClient.set(`tempUser:${email}`, JSON.stringify(body), { EX: 15 * 60 }); 
  
  return { message: "OTP sent to your email." };
};

export const verifyAccount = async (body) => {
  const { email, otp } = body;
  
  // 1. Get the ONLY active OTP from Redis
  const activeOtp = await redisClient.get(`active_otp:${email}`);
  
  if (!activeOtp) throw new BadRequestException("OTP expired or not sent");
  if (activeOtp !== String(otp)) throw new BadRequestException("Invalid OTP! Please use the LATEST code sent to your email.");

  // 2. Fetch temp user
  let data = await redisClient.get(`tempUser:${email}`);
  if (!data) throw new BadRequestException("Session expired! Please sign up again.");

  const userData = JSON.parse(data);
  userData.isEmailVarified = true; 
  await userRepository.create(userData);
  
  // 3. Cleanup everything
  await redisClient.del(`tempUser:${email}`);
  await redisClient.del(`active_otp:${email}`);
  
  return true;
}

export async function sendOtp(body){
  const { email } = body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  
  // Set a single key for the active OTP. Overwrites any previous one.
  await redisClient.set(`active_otp:${email}`, String(otp), { EX: 5 * 60 }); 
  
  await sendEmail({
    to: email,
    subject: "Your OTP for Saraha App",
    html: `<p>Your LATEST OTP is <strong>${otp}</strong>. All previous codes are now invalid.</p>`,
  });
}

// ... rest of service stays same ...
export const login = async (body) => {
      const { email } = body;
      const userExist = await checkUserExist({ email: { $eq: email, $exists: true, $ne: null } });
      if (!userExist) throw new NotFoundException(SYS_MESSAGE.user.notFound);
      if (!userExist.isEmailVarified) throw new BadRequestException("Please verify your email first.");
      const match = await comparePassword(body.password, userExist?.password||"DefaultPassword");
      if (!match) throw new NotFoundException(SYS_MESSAGE.user.invalidPassword);
      userExist.password = undefined;
      const { accessToken, refreshToken } = generateTokens({ sub: userExist._id , role: userExist.role , provider: userExist.provider });
      await redisClient.set(`refreshToken:${userExist._id}`, refreshToken);
      return { accessToken, refreshToken };
}   

export const logoutFromAllDevices = async (userId) => {
  await userRepository.update({ _id: userId }, { crdentialUpdateAt: Date.now() });
  return true;
}

export const logout = async (tokenPayload, user, tokenString) => {
  await redisClient.set(`token:${tokenString}`, "true", { EX: tokenPayload.exp - Math.floor(Date.now() / 1000) }); 
};

async function verifyGoogleToken(googleToken) {
  const CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || "830397725637-jjhrace9eo0qpg1l6nhr1vebppf3e79b.apps.googleusercontent.com").trim();
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({ idToken: googleToken, audience: CLIENT_ID });
  return ticket.getPayload();
}

export const loginWithGoogle = async (googleToken) => {
  try {
    const googleUser = await verifyGoogleToken(googleToken);
    if (googleUser.email_verified == false) throw new BadRequestException("Invalid Google Account");
    const user = await userRepository.getOne({ email: googleUser.email });  
    if (!user) {
        const newUser = await userRepository.create({
            email: googleUser.email,
            userName: googleUser.name,
            role: SYS_ROLE.user,
            isEmailVarified: true,
            provider: "google",
        }); 
        return generateTokens({ sub: newUser._id, role: newUser.role , provider: newUser.provider });
    }
    return generateTokens({ sub: user._id, role: user.role , provider: user.provider });
  } catch (error) {
    throw new BadRequestException(error.message || "Google login failed");
  }
}

export const refreshTokenService= async(authorization)=>{
  const secret = process.env.JWT_SECRET || "default_jwt_secret_key";
  const payload = jwt.verify(authorization, secret);
  const cashedRefreshToken = await redisClient.get(`refreshToken : ${payload.sub}`);
  if (cashedRefreshToken != authorization){
      await logoutFromAllDevices({_id:payload.sub});
      throw new UnauthorizedException("you are not authorized");
  }
  delete payload.iat; delete payload.exp;
  const {accessToken , refreshToken}= generateTokens(payload);
  await redisClient.set(`refreshToken : ${payload.sub}` , refreshToken);
  return {refreshToken , accessToken};
}
