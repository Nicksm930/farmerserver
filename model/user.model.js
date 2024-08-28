import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ACCESS_TOKEN_EXPIRY,ACCESS_TOKEN_SECRET,REFRESH_TOKEN_SECRET,REFRESH_TOKEN_EXPIRY } from "../src/constant.js";
const userSchema=new mongoose.Schema({

    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true ///if you want to search user we can add index on seraching field..it optimizes
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        // lowercase:true,
        // unique:true,
        trim:true,
        index:true //we can search based on full name
    },
    avatar:{
        type:String,// Cloudnary url/service like aws where we can upload imgs and use it
        required:true,
        // lowercase:true,
        // unique:true,
        // trim:true,
        // index:true
    },
    coverImage:{
        type:String,
        // required:true,
        // lowercase:true,
        // unique:true,
        // trim:true,
        // index:true
    },
    recentProduct:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"

        }
    ],
    password:{
        type:String,
        required:[true,"Password is Required"]
    },
    refereshToken:{
        type:String
    }


},{timestamps:true}); 

//hooks:Pre and Post
//Used when user is saved

userSchema.pre("save",async function(next){
    //But not always password has to hashed fo eg if user tries to change avatar there is no need to hash the passwor
    //for this we have a function to test if a particular feild is modifies:isModified
    if(!this.isModified("password")) return next()

    this.password=await bcrypt.hash(this.password,10)//10 means rounds
    next()
})
userSchema.methods.isPasswordCorrect=async function(password){
   return await bcrypt.compare(password,this.password) //return true or false
}
userSchema.methods.generateAccessToekn=function(){
   return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullName
    },
    ACCESS_TOKEN_SECRET,{
        expiresIn:ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToekn=function(){
    return jwt.sign({
        _id:this._id,
        // email:this.email,
        // username:this.username,
        // fullname:this.fullName
    },
    REFRESH_TOKEN_SECRET,{
        expiresIn:REFRESH_TOKEN_EXPIRY
    })
}
export const User=mongoose.model("User",userSchema)