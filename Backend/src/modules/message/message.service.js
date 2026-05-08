import { messageRepository } from "../../DB/models/message/message.repository.js";
import { NotFoundException, BadRequestException } from "../../common/utils/error.utils.js";
import os from "node:os";
import path from "node:path";
// send message anymouns
export const sendMessage = async (content, receiverId, attachments, senderId = undefined) => {
    // Extract relative paths for database storage to ensure they work in production
    const paths = attachments.map((file) => {
        const tmpDir = os.tmpdir();
        const baseUploadsFolder = path.join(tmpDir, 'uploads');
        // Get relative path from base uploads folder
        let relativePath = path.relative(baseUploadsFolder, file.path);
        // Ensure forward slashes for web URLs
        return '/' + relativePath.replace(/\\/g, '/'); 
    });

    const createdMessage = await messageRepository.create({
        content,
        receiver: receiverId,
        attachments: paths,
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