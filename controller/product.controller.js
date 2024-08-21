import { Product } from "../model/product.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const addProduct=async(req,res)=>{

    const {product_name,title, subTitle, quantity,
      pulseType,
      subType,
      minimum_buy_quantity,
      price,
      discount,
      package_date,
      expiry_date,
      
      description,
      return_policy,
      availability}=req.body;

    //   const avatar=await uploadOnCloudinary(avatarLocalPath)
    const imagesLocalPath=req.files?.images[0]?.path;
      const images=await uploadOnCloudinary(imagesLocalPath)

      if (!images) {
          throw new Error(400,"Avatar is Mandatory")
      }
        const product=await Product.findOne({product_name});
        if (product) {
            throw new Error("Product Already Exists")
        }

       const newProduct= await Product.create({
            product_name,title, subTitle, quantity,
      pulseType,
      subType,
      minimum_buy_quantity,
      price,
      discount,
      package_date,
      expiry_date,
      images:images.url || '',
      description,
      return_policy,
      availability

        })

        if (!newProduct) {
            // throw new Error("Product Not Added")//
            return res.status(401).json({
                statusCode:401,
                message:"Product Not Added Succesfully"
            })
    
        }

        return res.status(200).json({
            statusCode:200,
            message:"Product Added Succesfully"
        })

}

const getAllProducts=async(req,res)=>{

    try {
        const products=await Product.find()
        console.log("product length",products.length)
        if(products.length <= 0){
            
            throw new Error("No Product To View")

        }

        return res.status(200).json({
            statusCode:200,
            message:"Products Fetched Successfully",
            products:products

        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            statusCode:200,
            message:"No Products To View",
            products:[]
            

        })
        
    }
}



export {getAllProducts,addProduct}