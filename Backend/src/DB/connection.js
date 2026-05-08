import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
    if (isConnected) {
        return;
    }

    const mongoUri = process.env.MONGO_URI || "mongodb://saraha-app:qusay2000@ac-mbixizh-shard-00-00.i04zmwh.mongodb.net:27017,ac-mbixizh-shard-00-01.i04zmwh.mongodb.net:27017,ac-mbixizh-shard-00-02.i04zmwh.mongodb.net:27017/?ssl=true&replicaSet=atlas-290vw6-shard-0&authSource=admin&appName=saraha-app";
    
    try {
        const db = await mongoose.connect(mongoUri);
        isConnected = db.connections[0].readyState;
        console.log("✅ DB connected 100%");
    } catch (err) {
        console.log("❌ fail to connect to DB:", err.message);
    }
}