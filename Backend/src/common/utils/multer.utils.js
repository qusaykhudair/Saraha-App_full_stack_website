import multer, { diskStorage } from "multer";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { BadRequestException } from "./error.utils.js";
export const fileUpload = () => {
  return multer({
    fileFilter: (req, file, cb) => {
        // allow only jpeg and png images
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png"
      ) {
        cb(null, true);
      } else {
        cb(new BadRequestException("Invalid file type"), false);
      }
    },
limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
      },
    storage: diskStorage({
      destination: (req, file, cb) => {
        const tmpDir = os.tmpdir();
        const baseFolder = path.join(tmpDir, 'uploads');
        const folder = req.user 
          ? path.join(baseFolder, req.user._id.toString()) 
          : path.join(baseFolder, (req.params.receiverId || 'guest').toString(), 'messages');
          
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, folder);
      }, // string or function >> "uploads" >> 
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${Math.random()}-${file.originalname}`)
      }, // function
    }), // result from execution of [diskStorage , memoryStorage],
  });
};