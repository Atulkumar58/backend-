import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/ApiError.js';
import User from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import {ApiResponse} from '../utils/Apiresponse.js';
import jwt from 'jsonwebtoken';

const generateAccessandRefreshTokens = async(userId) => {
    try{
        const user= await User.findbyId(userId);
        const accessToken= user.generateAccessToken();
        const refreshToken= user.generateRefreshToken();

        user.refreshToken= refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken, refreshToken};
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
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

    if(
        [fullName, email, password, username].some((field) => field?.trim() == "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        email: email
    });
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Arrary.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar =await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(500, "Failed to upload avatar to Cloudinary");
    }
    try{ 
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    }
    catch(error){
        console.error("Error creating user:", error);
        throw new ApiError(500, "Something went wrong while creating user");
    }
    
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


const loginUser = asyncHandler(async (req, res, next) => {
    //req body->data
    //username or email 
    //find the user
    //password check
    // access tokena and refresh token
    // send cookies

    const {username, email, password} = req.body;

    if(!(username || email)){
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Wrong password");
    }

    const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        },
        "user logged in successfully"
        )
    )
});

const logoutUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true,
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearcookie("refreshToken", options)
    .json(
        new ApiResponse(200, null, "User logged out")
    )
    
})

const refreshAccessToken = asyncHandler(async(req, res, next) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh token is required");
    }
    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if(!user || user?.refreshToken !== incomingRefreshToken){
            throw new ApiError(401, "Invalid refresh token");
        }

        const options={
            httpOnly: true,
            secure: true
        }
        const {accessToken, refreshToken} = await generateAccessandRefreshTokens(user._id);

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                accessToken,
                refreshToken},
                "Access token refreshed successfully")
        )
    }catch(error){
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
    
})

const changeCurrentPassword = asyncHandler(async(req,  res) => {
    const {oldPassword, newPassword} = req.body;

    const user= await User.findById(req.user?._id)
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password");
    }

    user.password= newPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password changed successfully")
    )
})

const getcurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(
        200,
        req.user,
        "Current user fetched Successfully"
    )
})

const updateAccountDetails= asyncHandler(async(req, res) =>{
    const {fullName, email} = req.body

    if(!fullName || !email){
        throw new ApiError(400, "All fields are required");
    }

    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            } 
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Account Details updated successfully")
    )
})

const updateUserAvatar = asyncHandler( async(req, res) =>{
    const avatarLocalPath = req.file?.path
    
    if(condition){
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)


    if(!avatar.url){
        throw new ApiError(400, "Error while uploading on cloudinary")
    }

    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                avatar : avatar.url
            }
        },
        {new: true}
    ).select ("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar is uploaded successfully"))
})     

const updateUserCoverImage = asyncHandler( async(req, res) =>{
    const coverImageLocalPath = req.file?.path
    
    if(condition){
        throw new ApiError(400, "Cover Image is missing")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Error while uploading on cloudinary")
    }

    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set : {
                coverImage : coverImage.url
            }
        },
        {new: true}
    ).select ("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image Updated Successfully"))
})   
export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    getcurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
};