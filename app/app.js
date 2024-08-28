import express from 'express';
import cors from 'cors';
import productRouter from '../router/product.router.js';
import userRouter from '../router/user.route.js';
import cookieParser from 'cookie-parser';
// import { getAllProduct } from '../controller/product.controller';

const app=express()


app.use(cors(
    
));
app.use(cookieParser());
app.use(express.json());
//User Endpoints
app.use("/api/v1/users",userRouter)
//Product Endpoint
app.use("/api/v1/products",productRouter)


export default app

// app.listen(port,()=>{
//     console.log(`Server Running On Port:${port}`)
// })


