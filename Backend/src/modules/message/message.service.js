import { messageRepository } from "../../DB/models/message/message.repository.js";
import { NotFoundException, BadRequestException } from "../../common/utils/error.utils.js";
// send message anymouns
export const sendMessage = async (content, receiverId, attachments , senderId = undefined) => {
let path = attachments.map((file) => file.path);
  const createdMessage = await messageRepository.create({
    content,
    receiver: receiverId,
    attachments: path,
    senderId : senderId ,
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