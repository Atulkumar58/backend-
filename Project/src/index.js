import connectDB from "./db/index.js";
// import {DB_NAME} from "./constants.js"
import dotenv from "dotenv";
// dotenv.config(path : "../.env");

// import mongoose from "mongoose";

connectDB();

// import express from "express";
// const app = express()
// ;(async () => {
//     try {

//        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

//        app.on("error", (err) => {
//         console.log("Error in server setup");
//         console.log(err);
//         throw err;
//        })

//        app.listen(process.env.PORT, () => {
//         console.log(`Server is running on port ${process.env.PORT}`);
//        })
//     }
//     catch (error) {
//         console.log(error);
//         throw error;
//     }

// })()