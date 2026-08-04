import asyncHandler from '../utils/asynchandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/Apiresponse.js';


const registerUser = asyncHandler(async (req, res) => {
    //get user data from frontend
    //validation of user data
    // check if user already exists
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token from response
    //check for user creation 
    //return response 

    const  {fullName, email, password, username}=req.body;
    console.log(fullName, email, password, username);

    if(
        [fullName, email, password, username].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    User.findOne({
        email: email
    }).then((user) =>{
        throw new ApiError(409, "User already exists");
    })

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar =await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res.status(201).json(
        new ApiResponse (201, createdUser, "User created successfully")
    )

});

export {registerUser};