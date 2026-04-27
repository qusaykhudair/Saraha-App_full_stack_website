import jwt from "jsonwebtoken";
export function generateTokens(payload){
const accessToken = jwt.sign(payload, "djdjjdsjajajajajajquiuwququququ", {
  expiresIn: 60*60*24*7, // 1 week
});
const refreshToken = jwt.sign(payload, "djdjjdsjajajajajajquiuwququququ", {
  expiresIn: 60*60*24*7, // 1 week
});

return { accessToken, refreshToken };
}