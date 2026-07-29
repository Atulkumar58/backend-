import connectDB from "./db/index.js";
// import {DB_NAME} from "./constants.js"
import dotenv from "dotenv/config";
// dotenv.config(path : "./env");

// import mongoose from "mongoose";

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
    console.log("Database connected successfully");
})
.catch((err) => {
    console.error("Error connecting to database:", err);
});

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