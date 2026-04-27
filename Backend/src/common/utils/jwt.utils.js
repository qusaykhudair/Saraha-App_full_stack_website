import jwt from "jsonwebtoken";
export function generateTokens(payload){
  const secret = process.env.JWT_SECRET || "default_jwt_secret_key";
  const accessToken = jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
  const refreshToken = jwt.sign(payload, secret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}