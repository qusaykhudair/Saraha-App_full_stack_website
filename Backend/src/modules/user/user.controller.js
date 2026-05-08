import { Router } from "express";
import { encryption, decryption } from "../../common/utils/encryption.utils.js";
import { getProfile, updateProfile, uploadProfilePicture } from "./user.service.js";
import { asyncHandler } from "../../common/utils/error.utils.js";
import { isAuthenticated } from "../../../middlewares/auth.middleware.js";
import { fileUpload } from "../../common/utils/multer.utils.js";

const router = Router();

// Helper to decrypt user phone before sending response
const prepareUserResponse = (user) => {
    const userObj = user.toObject ? user.toObject() : { ...user };
    if (userObj.phoneNumber) {
        try {
            userObj.phoneNumber = decryption(userObj.phoneNumber);
        } catch (e) {
            console.error("Decryption failed for phone number");
        }
    }
    if (userObj.password) delete userObj.password;
    return userObj;
};

// get user profile
router.get("/", isAuthenticated, asyncHandler(async (req, res, next) => {
    const user = await getProfile({ _id: req.user._id });
    return res.status(200).json({ success: true, data: { user: prepareUserResponse(user) } });
}));

// update profile info (userName, gender, etc)
router.patch("/update-info", isAuthenticated, asyncHandler(async (req, res, next) => {
    let { userName, gender, phoneNumber } = req.body;
    const updateData = { userName, gender };
    
    if (phoneNumber !== undefined && phoneNumber !== null && phoneNumber.trim() !== '') {
        updateData.phoneNumber = encryption(phoneNumber.trim());
    } else if (phoneNumber === '') {
        updateData.phoneNumber = null;
    }

    const updatedUser = await updateProfile(req.user._id, updateData);
    return res.status(200).json({ 
        message: "Profile updated successfully", 
        success: true, 
        data: { user: prepareUserResponse(updatedUser) } 
    });
}));

// upload profile picture
router.patch("/upload-profile-picture", isAuthenticated, fileUpload().single("image"), asyncHandler(async (req, res, next) => {
    const updatedUser = await uploadProfilePicture(req.user, req.file);
    return res.status(200).json({ 
        message: "Profile picture updated successfully", 
        success: true, 
        data: { user: prepareUserResponse(updatedUser) } 
    });
}));

export default router;