import mongoose from "mongoose";

export function connectDB(){
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://saraha-app:qusay2000@saraha-app.i04zmwh.mongodb.net/?appName=saraha-app";
    
    if (!mongoUri) {
        console.log("⚠️ WARNING: MONGO_URI is not defined in environment variables. Falling back to localhost.");
    } else {
        console.log("📡 Attempting to connect to MongoDB Atlas...");
    }

    const uriToConnect = mongoUri || "mongodb+srv://saraha-app:qusay2000@saraha-app.i04zmwh.mongodb.net/?appName=saraha-app";
    
    mongoose.connect(uriToConnect).then(()=>{
        console.log("✅ DB connected 100%");
    }).catch((err)=>{
        console.log("❌ fail to connect to DB:", err.message);
    })
}