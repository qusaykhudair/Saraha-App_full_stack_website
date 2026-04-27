import mongoose from "mongoose";

export function connectDB(){
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/saraha-app";
    mongoose.connect(mongoUri).then(()=>{
        console.log("DB connected 100%");
    }).catch((err)=>{
        console.log("fail to connect to DB", err);
    })
}