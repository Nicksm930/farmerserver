import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config({
    path:"./.env.dev"
})

const dbConnection=async()=>{

    try {
        const connect=await mongoose.connect("mongodb+srv://nikhil:nikhil@foodspark.orwgx.mongodb.net/foodspark?retryWrites=true&w=majority&appName=FoodSpark")

        if (!connect) {
            throw new Error("Connect Failed",connect)
        }

        console.log("FoodSpark DB Connection Successfull at Host:",connect.connection.host)
        return true;
    } catch (error) {
        console.log("Error",error)
    }

}

export default dbConnection;

