import mongoose from "mongoose";

export function connectDB(){
const mongoUri = "mongodb://saraha-app:qusay2000@ac-mbixizh-shard-00-00.i04zmwh.mongodb.net:27017,ac-mbixizh-shard-00-01.i04zmwh.mongodb.net:27017,ac-mbixizh-shard-00-02.i04zmwh.mongodb.net:27017/?ssl=true&replicaSet=atlas-290vw6-shard-0&authSource=admin&appName=saraha-app";
    
    if (!mongoUri) {
        console.log("⚠️ WARNING: MONGO_URI is not defined in environment variables. Falling back to localhost.");
    } else {
        console.log("📡 Attempting to connect to MongoDB Atlas...");
    }

    const uriToConnect = mongoUri;
    
    mongoose.connect(uriToConnect).then(()=>{
        console.log("✅ DB connected 100%");
    }).catch((err)=>{
        console.log("❌ fail to connect to DB:", err.message);
    })
}