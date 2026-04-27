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
  
  const user = await checkUserExist({
    $or: [
      { email: { $eq: email, $exists: true, $ne: null } },
      { phoneNumber: { $eq: phoneNumber, $exists: true, $ne: null } },
    ],
  });

  if (user) {
    throw new ConflictException(SYS_MESSAGE.user.alreadyExist);
  }

  // prepare data for creating user
  body.role = SYS_ROLE.user;
  body.password = await hash(body.password);
  body.provider = "system";

  // Encrypt phone number if it exists
  if (body.phoneNumber) {
    body.phoneNumber = encryption(body.phoneNumber);
  }

  // send otp to user email for verification
  await sendOtp(body);

  // create user
  const createdUser = await createUser(body);

  await redisClient.set(email, JSON.stringify(body), { EX: 5 * 60 }); // Store user data in Redis (Caching) with a 5-minute expiration
  
  return createdUser;
};

export const login = async (body) => {
     // get data from request body
      const { email } = body;
      
      // check user exist or not
      const userExist = await checkUserExist({
        email: { $eq: email, $exists: true, $ne: null },
      });
      if (!userExist) {
        throw new NotFoundException(SYS_MESSAGE.user.notFound);
      }
    
      // compare password
      const match = await comparePassword(body.password, userExist?.password||"DefaultPassword");
      if (!match) {
        throw new NotFoundException(SYS_MESSAGE.user.invalidPassword);
      }
      // remove password from response *** we cant use delete because its a bason file and delete will not work on it
    userExist.password = undefined;
    // generate token
    const { accessToken, refreshToken } = generateTokens({ sub: userExist._id , role: userExist.role , provider: userExist.provider });

await redisClient.set(`refreshToken:${userExist._id}`, refreshToken)
    return { accessToken, refreshToken };
}   

export const verifyAccount = async (body) => {
  const { email, otp } = body;
  
  // Verify OTP exists
  const otpDoc = await redisClient.get(`${email}:${otp}`);
  if (!otpDoc) {
    throw new BadRequestException("Invalid or expired OTP");
  }

  // Fetch temporarily cached user data
  let data = await redisClient.get(email);
  if (!data) {
    throw new BadRequestException("Session expired! Please sign up again.");
  }

  // Create user into database
  await userRepository.create(JSON.parse(data));
  
  // Cleanup Redis
  await redisClient.del(email);
  await redisClient.del(`${email}:${otp}`);
  
  return true;
}

export async function sendOtp(body){
  const { email } = body;
  // check OTP valid on database
  const otpDoc = await otpRepository.getOne({ email });
  // Fixed key to match send logic
  const otpInRedis = await redisClient.get(`${email}:otp_value`);
  if(otpDoc || otpInRedis){
    throw new BadRequestException("otp already sent and still valid");
  }
  // create otp for user verification
  const otp = Math.floor(100000 + Math.random() * 900000);
  // save otp in database
  // Store both the specific OTP key and a general 'sent' flag
  await redisClient.set(`${email}:${otp}`, otp, { EX: 5 * 60 }); 
  await redisClient.set(`${email}:otp_value`, otp, { EX: 5 * 60 }); 
  // send otp to user by email
  await sendEmail({
    to: email,
    subject: "Your OTP for Saraha App",
    html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
  });
}

export const logoutFromAllDevices = async (userId) => {
  // Invalidate all tokens for the user by changing a field in the database
  await userRepository.update({ _id: userId }, { crdentialUpdateAt: Date.now() });
  return true;
}

// Logout from current device by blacklisting the token
export const logout = async (tokenPayload, user, tokenString) => {
  // Use the actual token string instead of JTI since JTI is undefined
  await redisClient.set(`token:${tokenString}`, "true", { EX: tokenPayload.exp - Math.floor(Date.now() / 1000) }); 
};
 // This function should verify the Google token and return the user information
 async function verifyGoogleToken(googleToken) {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID|| "830397725637-jjhrace9eo0qpg1l6nhr1vebppf3e79b.apps.googleusercontent.com";
  if (!CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID environment variable is missing");
  }
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}
// Google login  
export const loginWithGoogle = async (googleToken) => {
  // Verify the Google token and get user info
  const googleUser = await verifyGoogleToken(googleToken);
  if (googleUser.email_verified == false) {
    throw new BadRequestException("Invalid Google Account");
  }
  // Check if the user already exists in the database
  const user = await userRepository.getOne({ email: googleUser.email });  
  // If the user does not exist, create a new user account
  if (!user) {
    const newUser = await userRepository.create({
      email: googleUser.email,
      userName: googleUser.name,
      role: SYS_ROLE.user,
      isEmailVarified: true,
      provider: "google",
    }); 
    // Generate tokens for the new user
return generateTokens({ sub: newUser._id, role: newUser.role , provider: newUser.provider });
  }
  // If the user exists, generate tokens for the existing user
  return generateTokens({ sub: user._id, role: user.role , provider: user.provider });


}

export const refreshTokenService= async(authorization)=>{
  // check token valid
  const secret = process.env.JWT_SECRET || "default_jwt_secret_key";
  const payload = jwt.verify(
    authorization,
    secret
  ); // valid - expire
const cashedRefreshToken = await redisClient.get(`refreshToken : ${payload.sub}`)
if (cashedRefreshToken != authorization){
  await logoutFromAllDevices({_id:payload.sub})
  await redisClient.del(`refreshToken : ${payload.sub}`)
  throw new UnauthorizedException("you are not authorized")
}

  delete payload.iat ;
  delete payload.exp;
  const {accessToken , refreshToken}= generateTokens(payload);
  await redisClient.set(`refreshToken : ${payload.sub}` , refreshToken)
  return {refreshToken , accessToken}

}
