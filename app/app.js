import express from 'express';
import cors from 'cors';
import productRouter from '../router/product.router.js';
// import { getAllProduct } from '../controller/product.controller';

const app=express()


app.use(cors(
    
));
app.use(express.json());
//Product Endpoint
app.use("/api/v1/products",productRouter)


export default app

// app.listen(port,()=>{
//     console.log(`Server Running On Port:${port}`)
// })


