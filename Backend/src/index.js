import 'dotenv/config';
import cors from "cors";
import express from "express"
import helmet from "helmet";
import os from "node:os";
import path from "node:path";
import { connectDB } from "./DB/connection.js";
import {authRouter, messageRouter, userRouter} from "./modules/index.js";

import { connectRedis } from "./DB/models/redis.connection.js";
import rateLimit from "express-rate-limit";
const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();
// Connect to Redis
connectRedis();

// 1. Core Middlewares (Must be at the TOP for Vercel)
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Security Middlewares
app.use(helmet({
    crossOriginResourcePolicy: false, // Allow loading images from other origins
}))

// 3. Static Files
app.use("/uploads", express.static(path.join(os.tmpdir(), "uploads")));

// 4. Rate Limiting (Disabled or relaxed for Serverless Vercel)
// const limiter = rateLimit({ ... })
// app.use(limiter)

// routing
const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/message", messageRouter);

app.use("/api", apiRouter); // For Vercel production
app.use("/", apiRouter);    // For local development and fallback

// global error handler
app.use((err , req , res , next)=>{
    if(err.message === "jwt expired"){
err.message = "Token expired, please login again";
return res.status(err.cause||500).json({ success: false, error: err.message });
    }
    return res.status(err.cause||500).json({ success: false, error: err.message});
});
app.listen(port , ()=> {
    console.log("App is runing on port ", port);
})

export default app;