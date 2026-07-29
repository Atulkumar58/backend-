import dns from "node:dns";
dns.setServers(["8.8.8.8"], ["1.1.1.1"])
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

console.log("DB_NAME", DB_NAME);
console.log("MONGO_URI", process.env.MONGO_URI);
const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        const connectionIns = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB connected: ${connectionIns.connection.host}`);
        console.log("connected to MongoDB successfully");
    }
    catch (error) {
        console.log(`mongodb error: ${error}`);
        process.exit(1); // from node 
    }
}

export default connectDB;