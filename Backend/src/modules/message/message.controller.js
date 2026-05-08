import { Router } from "express";
import { getAllMessage, getSpecificMessage, sendMessage, deleteMessage } from "./message.service.js";
import { fileUpload } from "../../common/utils/multer.utils.js";
import { isAuthenticated } from "../../../middlewares/auth.middleware.js";
import { asyncHandler } from "../../common/utils/error.utils.js";

const router = Router();

// send message anonymously
router.post("/:receiverId/anoymouns", fileUpload().array("attachments", 2), asyncHandler(async (req, res, next) => {
    const { content } = req.body;
    const { receiverId } = req.params;
    const attachments = req.files || [];
    await sendMessage(content, receiverId, attachments);
    return res.status(201).json({ success: true, message: "Message sent successfully" });
}));

// send message public
router.post("/:receiverId/public", isAuthenticated, fileUpload().array("attachments", 2), asyncHandler(async (req, res, next) => {
    const { content } = req.body;
    const { receiverId } = req.params;
    const attachments = req.files || [];
    const senderId = req.user._id;
    await sendMessage(content, receiverId, attachments, senderId);
    return res.status(201).json({ success: true, message: "Message sent successfully" });
}));

// get specific message 
router.get("/:id", isAuthenticated, asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const message = await getSpecificMessage(id, req.user._id);
    return res.status(200).json({ success: true, data: { message } });
}));

// get all messages
router.get("/", isAuthenticated, asyncHandler(async (req, res, next) => {
    const messages = await getAllMessage(req.user._id);
    return res.status(200).json({ success: true, data: { messages } });
}));

// delete message
router.delete("/:id", isAuthenticated, asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await deleteMessage(id, req.user._id);
    return res.status(200).json({ success: true, message: "Message deleted successfully" });
}));

export default router;