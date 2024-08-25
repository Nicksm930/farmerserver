import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/apiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudnary.js'
import {ApiResponse} from '../utils/apiResponse.js'

const generateAccessAndRefereshToken=async(userId)=>{

    try {
        const user=await User.findById(userId);

        const accessToken=user.generateAccessToekn()
        const refereshToken=user.generateRefreshToekn()

        user.refereshToken=refereshToken
        await user.save({validateBeforeSave:false})//imp: when we save the doc ..mongoose trigger for password check..hemce we disable the validation 

        return {accessToken,refereshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access & referesh token")
    }
}

// console.log("in async handler")
const registerUser=asyncHandler(async(req,res)=>{
    
    const{username,email,fullName,password}=req.body;
    console.log(username,email,fullName,password);
    const a=[username,email,fullName,password].map((feild)=>{
      return feild?.trim()===""})
        console.log(a);
    if(
        a.includes(true)
    ){
        throw new ApiError(400,"All Feilds are Mandatory")
        // throw new ApiError(400)
    }

    //Check if user exisited
       const exsistedUser= await User.findOne(
            {
                $or:[{username},{email}]
            }
        )
        console.log("user:",exsistedUser)
        if (exsistedUser != null) {
            throw new ApiError(409,"User Already Exists")
        }
        const avatarLocalPath=req.files?.avatar[0]?.path;
        const coverImageLocalPath=req.files?.coverImage[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400,"Avatar is Mandatory")
        }

        const avatar=await uploadOnCloudinary(avatarLocalPath)
        const coverImage=await uploadOnCloudinary(coverImageLocalPath)

        if (!avatar) {
            throw new ApiError(400,"Avatar is Mandatory")
        }

        //Create User Object

        const user=await User.create({
            username,
            email,
            password,
            avatar:avatar.url,
            coverImage:coverImage.url || "",
            fullName
        })

        const createdUser=await User.findById(user._id).select(" -password -refreshToken");
        if(!createdUser){
            throw new ApiError(500,"Something went wrong will user registartion")
        }

        return res.status(201).json(
            new ApiResponse(201,createdUser,"User Created Successfully")
        )
    
  
})

const loginUser=asyncHandler(async(req,res)=>{
    //Get Data from Post request from req.body

    const {username,email,password}=req.body;

    // Find User based on username or email or both
    if(!username || !email){
        throw new ApiError(400,"username or email is required")
    }
    const user=await User.findOne({
        $or:[{username},{email}] //and 
    })

    if(!user){
        throw new ApiError(404,"User does not Exist!")
    }

    const isPasswordValid=await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken, refereshToken}=await generateAccessAndRefereshToken(user._id);

   
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly:true,
        secure:true
    }

    //While send cookie we need to set option as to make sure that the token or cookie is changed by server

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refereshToken,options)
    .json(new ApiResponse(
        200,
        {
            user:loggedInUser,accessToken,refereshToken
        },
        "User Logged In Succesfully"
    ))

})

const logoutUser=asyncHandler(async(req,res)=>{

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    refereshToken:undefined
                }
            },
            {
                new:true
            }
        )

        const options={
            httpOnly:true,
            secure:true
        }

        return res.status(200)
        .clearCookie("accessToken",options)
        .clearCookie("refereshToken",options)
        .json(
            new ApiResponse(200,{},"User Logged Out")
        )

})

const changeUserPassword=asyncHandler(async(req,res)=>{

    const {oldPassword,newPassword,ConfirmPassword}=req.body;

    

    const user=await User.findById(req.user?._id);

    if(!(await user.isPasswordCorrect(oldPassword))){
        throw new ApiError(401,"Invalid Password")
    }
    user.password=newPassword;

    await user.save({
        validateBeforeSave:false
    })

    return res.status(200).json(
        new ApiResponse(200,{},"passwword changed successfully")
    )

    

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(200,req.user,"User Fetched Succesfully")
    )
})

const updateUserDetails=asyncHandler(async(req,res)=>{

    const {fullName,email}=req.body;

        if (!(fullName || email)) {
            throw new ApiError(401,"All feilds are required!")
        }

    //    const user= await User.findById(req.user?.id)

    const updateUser= await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            fullName,
            email
        }
    },
        {new:true}
    ).select("-password")

    if(!updateUser){
        throw new ApiError(401,"Update Failed")
    }

    return res.status(200).json(
        new ApiError(200,user,"Updated User")
    )


})
const updateUserAvatar=asyncHandler(async(req,res)=>{

    const avatarLocalPath=req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(401,"Avatar file is missing")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(401,"Error while uploading avatar")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            avatar:avatar.url
        }
    },{
        new:true
    }).select("-password")

    return res.status(200).json(
        new ApiResponse(200,user,"Avatar Updated Successfully")
    )

})

const updateUsercoverImage=asyncHandler(async(req,res)=>{

    const coverImageLocalPath=req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(401,"coverImage file is missing")
    }

    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(401,"Error while uploading coverImage")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            coverImage:coverImage.url
        }
    },{
        new:true
    }).select("-password")

    return res.status(200).json(
        new ApiResponse(200,user,"coverImage Updated Successfully")
    )

})
// const registerUser=(req,res)=>{
//     res.status(200).json({
//         message:"ok"
//     })
// }
export {registerUser,loginUser,logoutUser,changeUserPassword,getCurrentUser,updateUserDetails,
    updateUserAvatar,updateUsercoverImage
}
