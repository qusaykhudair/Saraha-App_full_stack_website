import { messageRepository } from "../../DB/models/message/message.repository.js";
import { NotFoundException, BadRequestException } from "../../common/utils/error.utils.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
// send message anymouns
export const sendMessage = async (content, receiverId, attachments, senderId = undefined) => {
    // Convert attachments to Base64 strings for Vercel persistence
    const base64Attachments = attachments.map((file) => {
        const fileData = fs.readFileSync(file.path);
        const base64 = fileData.toString('base64');
        const mimeType = file.mimetype;
        
        // Delete the temporary file to save space on Vercel /tmp
        try { fs.unlinkSync(file.path); } catch (e) {}
        
        return `data:${mimeType};base64,${base64}`;
    });

    const createdMessage = await messageRepository.create({
        content,
        receiver: receiverId,
        attachments: base64Attachments,
        senderId: senderId,
    });
    return createdMessage;
};

// get specific message 
export const getSpecificMessage = async (id , userId) => {
  const message = await messageRepository.getOne({ _id: id , $or : [{receiver : userId }, {sender:userId }]}, {} ,{populate:[{path:"receiver" , select:"-password -credentialsUpdateAt"}]}); // {} | null
  if (!message) throw new NotFoundException("Massage not Found");
  return message;
};

// get All message 
export const getAllMessage = async (userId) => {
  const messages = await messageRepository.getAll({ $or : [{receiver : userId }, {sender:userId }]}, {} ,{ populate:[{path:"receiver" , select:"-password -credentialsUpdateAt"}]}); // array []
  return messages;
};

// delete message
export const deleteMessage = async (id, userId) => {
  const deletedMessage = await messageRepository.deleteOne({ _id: id, receiver: userId });
  if (!deletedMessage) throw new NotFoundException("Message not found or unauthorized");
  return deletedMessage;
};