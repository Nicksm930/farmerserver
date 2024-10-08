import { Router } from "express";
import { getAllUserProducts, getAllUsers, loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import {upload} from '../middleware/multer.middleware.js'
import  {verifyJWT}  from "../middleware/auth.middleware.js";
//Imp:Uplaod .fields() has array of feilds
const userRouter=Router();

userRouter.route("/register").post(
    upload.fields([{
        name:"avatar",
        maxCount:1
    },{
        name:"coverImage",
        maxCount:1
    }]),
    registerUser)

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJWT,logoutUser);
userRouter.route("/getAllUserProducts").post(verifyJWT,getAllUserProducts)
userRouter.route("/").get(getAllUsers);




export default userRouter