import { SYS_MESSAGE } from "../../common/constant/message.constant.js";
import { NotFoundException } from "../../common/utils/error.utils.js";
import { userRepository } from "../../DB/models/user/user.repository.js"
import fs from "node:fs";

export const checkUserExist = async(filter)=>{
    return await userRepository.getOne(filter);
}

export const createUser = async(userData)=>{
    return await userRepository.create(userData);
}

export const getProfile = async(filter)=>{
    return await userRepository.getOne(filter);
}

export const updateProfile = async(userId, updateData)=>{
    const updatedUser = await userRepository.update({_id: userId}, updateData, { new: true });
    if (!updatedUser) throw new NotFoundException(SYS_MESSAGE.user.notFound);
    return updatedUser;
}

export const uploadProfilePicture = async(user, file)=>{
    if (!file) return user;

    // Convert to Base64 for Vercel persistence
    const fileData = fs.readFileSync(file.path);
    const base64 = `data:${file.mimetype};base64,${fileData.toString('base64')}`;
    
    // Update user in DB
    const updatedUser = await userRepository.update({_id: user._id}, {profilePic: base64}, { new: true });
    
    // Delete temp file
    try { fs.unlinkSync(file.path); } catch (e) {}

    if (!updatedUser) {
        throw new NotFoundException(SYS_MESSAGE.user.notFound);
    }
    return updatedUser;
}