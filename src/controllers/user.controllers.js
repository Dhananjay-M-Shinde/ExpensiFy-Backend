import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken

        // we are using validateBeforeSave so other field should not kicked in
        user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new apiError(500, "something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler( async (req, res) =>{
    // console.log("into controller");
    // get user detail from frontend
    // validation - non empty fields
    // check if user already exists : by userName or email
    // check for images, check for avatar
    // if available, upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // chceck for userCreation
    // return response

    try {
        const {fullName, userName, email, password} = req.body;
        // console.log("its", avatar['name']);
        // const {name} = avatar;
        // console.log("this is avatar", typeof avatar, name);
        
        // console.log(req.file.path);
    
        // if(fullName === ""){
        //     throw new ApiError(400, "fullName is required")
        // }
    
        // instead of applying if condition to every field we can do it by below way using some method
        if([fullName, email, userName, password].some((field) =>{field?.trim() === ""})){
            throw new apiError(400, "all fields are required")
        }
        console.log("userexist");
    
        // it will check if user exist or not
        const existedUser = await User.findOne({
            $or: [{email}, {userName}]
        })
    
    
        if(existedUser){
            throw new apiError(409, "User already exist with given email or userName")
        }    console.log("localpath");
        // console.log("this is req.file", req.file);
        const avatarLocalPath = req.file?.path;
        console.log("avatar path:", avatarLocalPath);
    
        //checking whether avatar file is available or not
        if(!avatarLocalPath){
            throw new apiError(400, "Avatar file is required")
        }
    
        const avatar = await uploadOnCloudinary(avatarLocalPath)
    
        // now checking whether it is uploaded to cloudinary or not
        console.log("avatar");
        if(!avatar){
            throw new apiError(400, "Avatar file is required")
        }
    
        const user = await User.create({
            fullName,
            avatar: avatar,
            email, 
            password,
            userName: userName.toLowerCase()
        })
    
        // we are checking if user is created or not and if created then we are deselecting password and refreshToken while fetching data from db
        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        )
    
        // checking for user creation
        if(!createdUser){
            throw new apiError(500, "something went wrong while registering the user")
        }
    
        // returning response
        return res.status(201).json(
            new apiResponse(200, createdUser, "user created successfully")
        )
    
    } catch (error) {
        // console.log("captured through catch", error);
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }

})

const loginUser = asyncHandler(async (req, res) =>{
    // req.body --> data
    // username or email
    // find the user
    // password check
    // generate access and refresh token
    // send cookie
    // send response

    try {
        const {email, userName, password} = req.body
    
        if(!userName && !email){
            throw new apiError(400, "username or email is required")
        }
    
        const user = await User.findOne({
            $or: [{userName}, {email}]
        })
    
        if(!user){
            throw new apiError(404, "user not found")
        }
    
        const isPasswordCorrect = await user.isPasswordCorrect(password)
    
        if(!isPasswordCorrect){
            throw new apiError(401, "password is incorrect")
        }
    
        // generating access and refresh token
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
        // we use option as below so our cookies can only modified in server and not through frontend
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )
    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }
})

const logoutUser = asyncHandler(async (req, res) =>{
    try {
        const result = await User.findByIdAndUpdate(
            req.user._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true
            }
        )
    
        result.refreshToken = undefined;
        result.save({validateBeforeSave: false})
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out"))
    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }
})

const refreshAccessToken = asyncHandler(async (req, res) =>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new apiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new apiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new apiError(401, "refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {accessToken, refreshToken},
                "token refreshed successfully"
            )
        )
    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }
})

const changeCurrentPassword = asyncHandler(async(req, res) =>{
    try {
        const {oldPassword, newPassword} = req.body
        console.log(req.body);
    
        const user = await User.findById(req.user?._id)
        console.log(user);
        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
        if(!isPasswordCorrect){
            throw new apiError(400, "password is incorrect")
        }
    
        user.password = newPassword
        await user.save({validateBeforeSave: false})
    
        return res
        .status(200)
        .json(new apiResponse(200, {}, "Password changed successfully"))
    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }
})

const getCurrentUser = asyncHandler(async(req, res) =>{
    return res
    .status(200)
    .json(new apiResponse(200, req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res) =>{
    try {
        console.log(req.body);
        const {newFullName:fullName, newEmail:email} = req.body
        // console.log(email, fullName);
        if(!fullName || !email){
            throw new apiError(400, "All fields are required")
        }
    
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {$set: {
                fullName: fullName,
                email: email
            }
        },
            {new: true}
        ).select("-password ")
    
        return res
        .status(200)
        .json(new apiResponse(200, user, "Account details updated successfully"))
    } catch (error) {
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }
})

const updateUserAvatar = asyncHandler(async (req, res) =>{
    try {
        const avatarLoaclPath = req.file?.path;
    
        if(!avatarLoaclPath){
            throw new apiError(400, "avatar file is missing")
        }
    
        const avatar = await uploadOnCloudinary(avatarLoaclPath)
    
        if(!avatar){
            throw new apiError(400, "Error while uploading avatar file to cloudinary")
        }
        
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: avatar
                } 
            },
            {new:true}        ).select("-password")
    
        return res
        .status(200)
        .json(new apiResponse(200, user, "avatar updated successfully"))} catch (error) {
        res
        .status(error.statusCode || 500)
        .json({statusCode: error.statusCode, error:{message: error.message || "something went wrong"}})
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
}