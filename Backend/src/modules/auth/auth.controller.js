import { Router } from "express";
import { SYS_MESSAGE } from "../../common/constant/message.constant.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { isValid } from "../../../middlewares/validation.middleware.js";
import { fileUpload } from "../../common/utils/multer.utils.js";
import { asyncHandler, BadRequestException } from "../../common/utils/error.utils.js";
import { login, loginWithGoogle, logout, logoutFromAllDevices, refreshTokenService, sendOtp, singup, verifyAccount } from "./auth.service.js";
import { isAuthenticated } from "../../../middlewares/auth.middleware.js";
import { redisClient } from "../../DB/models/redis.connection.js";
import fs from "node:fs";

const router = Router();

router.post("/signup", fileUpload().single("image"), isValid(signupSchema), asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileData = fs.readFileSync(req.file.path);
        const base64 = fileData.toString('base64');
        req.body.profilePic = `data:${req.file.mimetype};base64,${base64}`;
        // Delete temp file
        try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    const result = await singup(req.body);
    return res.status(201).json({ success: true, message: "OTP sent successfully. Please verify your email.", data: result });
}));

router.post("/login", isValid(loginSchema), asyncHandler(async (req, res, next) => {
    const { accessToken, refreshToken } = await login(req.body);
    return res.status(200).json({ success: true, message: "Login successful", data: { accessToken, refreshToken } });
}));

router.get("/refresh-token", asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    const { accessToken, refreshToken } = await refreshTokenService(authorization);
    return res.status(200).json({ success: true, message: "Token refreshed successfully", data: { accessToken, refreshToken } });
}));

router.patch("/verify-account", asyncHandler(async (req, res, next) => {
    await verifyAccount(req.body);
    return res.status(200).json({ success: true, message: "Account verified successfully. You can now login." });
}));

// Dedicated Resend OTP Route
router.post("/resend-otp", asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) throw new BadRequestException("Email is required");

    // Fetch temp user data to ensure session is still active
    const data = await redisClient.get(`tempUser:${email}`);
    if (!data) throw new BadRequestException("Session expired! Please sign up again.");
    
    const userData = JSON.parse(data);
    
    // Clear old OTP from Redis to allow immediate resend
    await redisClient.del(`${email}:otp_value`);
    
    await sendOtp(userData);
    return res.status(200).json({ success: true, message: "A new OTP has been sent to your email." });
}));

router.post("/send-otp", asyncHandler(async (req, res, next) => {
    await sendOtp(req.body);
    return res.status(200).json({ success: true, message: "OTP sent successfully" });
}));

router.patch("/logout-all-devices", isAuthenticated, asyncHandler(async (req, res, next) => {
    await logoutFromAllDevices(req.user);
    return res.status(200).json({ success: true, message: "Logged out from all devices successfully" }); 
}));

router.post("/logout", isAuthenticated, asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization?.startsWith("Bearer ") ? authorization.split(" ")[1] : authorization;
    await logout(req.payload, req.user, token);
    return res.status(200).json({ success: true, message: "Logged out successfully" }); 
}));

router.post("/login-with-google", asyncHandler(async (req, res, next) => {
    const { googleToken } = req.body;
    const { accessToken, refreshToken } = await loginWithGoogle(googleToken);
    return res.status(200).json({ success: true, message: "Google login successful", data: { accessToken, refreshToken } });
}));

export default router;
