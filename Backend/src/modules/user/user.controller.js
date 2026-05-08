import { Router } from "express";
import { decryption } from "../../common/utils/encryption.utils.js";
import { isAuthenticated } from "../../../middlewares/auth.middleware.js";
import { fileUpload } from "../../common/utils/multer.utils.js";
import { fileValidation } from "../../../middlewares/file-validation.middleware.js";
import { uploadProfilePicture, updateProfile } from "./user.service.js";
import { asyncHandler } from "../../common/utils/error.utils.js";

const router = Router();

// get profile
router.get("/", isAuthenticated, asyncHandler(async (req, res, next) => {
  const {user} = req;
  if (user.phoneNumber){
    user.phoneNumber = decryption(user.phoneNumber);
  }
  return res.status(200).json({ message: "done", success: true, data: { user } });
}));

// update profile info (userName, gender, etc)
router.patch("/update-info", isAuthenticated, asyncHandler(async (req, res, next) => {
    const { userName, gender, phoneNumber } = req.body;
    const updatedUser = await updateProfile(req.user._id, { userName, gender, phoneNumber });
    return res.status(200).json({ message: "Profile updated successfully", success: true, data: { user: updatedUser } });
}));

// upload profile picture 
router.patch("/upload-profile-picture", isAuthenticated, fileUpload().single("image"), asyncHandler(async (req, res, next) => {
    const updatedUser = await uploadProfilePicture(req.user, req.file);
    return res.status(200).json({ message: "Profile picture updated successfully", success: true, data: { user: updatedUser } });
}));

export default router;