import dns from "node:dns";
dns.setServers(["8.8.8.8"], ["1.1.1.1"])
import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        const connectionIns = await mongoose.connect(`mongodb+srv://atulchaudhary151_db_user:asdfghjk@cluster0.aqp1t04.mongodb.net/4`);
        console.log(`MongoDB connected: ${connectionIns.connection.host}`);
        console.log("connected to MongoDB successfully");
    }
    catch (error) {
        console.log(`mongodb error: ${error}`);
        process.exit(1); // from node 
    }
}

export default connectDB;