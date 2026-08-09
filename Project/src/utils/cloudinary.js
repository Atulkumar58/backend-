import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localfilepath) =>{
    try{
        if(!localfilepath){
            throw new Error("Local file path is required for uploading to Cloudinary.");
        }
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto", // Automatically detect the file type (image, video, etc.)
        });

        //file  uploaded successfully

        // console.log("file uploaded successfully to Cloudinary:", result.url);
        fs.unlinkSync(localfilepath); // Delete the local file after successful upload
        return result;
    }
    catch(error){
        fs.unlinkSync(localfilepath); // Delete the local file if upload fails
    }
}

export {uploadOnCloudinary};