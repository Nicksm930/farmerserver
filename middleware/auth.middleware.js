//verify whther user is present or not

import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../model/user.model.js";
import { ACCESS_TOKEN_SECRET } from "../src/constant.js";
export const verifyJWT=asyncHandler(async(req,_,next)=>{
  try {
    console.log(req.cookies,"cookies")
     const token= req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
        console.log("token",token)
     if (!token) {
          throw new ApiError(401,"Unauthorized request")
     }
  
     const decodedToken=jwt.verify(token,ACCESS_TOKEN_SECRET)
     console.log("Decoded token")
     const user=await User.findById(decodedToken?._id).select("-password -refereshToken")
  
     if (!user) {
      //TODO
          throw new ApiError(401,"Invalid access token")
     }
  
     req.user=user;
     next()
  } catch (error) {
        throw new ApiError(401,"Invalid Access Token")
  }
})