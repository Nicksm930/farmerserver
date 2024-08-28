import { Product } from "../model/product.model.js"
import { User } from "../model/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const addProduct=asyncHandler(
    async(req,res)=>{

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
              throw new ApiError(400,"Product picture are mandatory")
          }
            const product=await Product.findOne({product_name});
            if (product) {
                throw new ApiError(200,"Product Already Exists")
            }
            const productOwner=req.user._id;
    
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
          availability,
          productOwner,
    
            })
    
            if (!newProduct) {
                // throw new Error("Product Not Added")//
                throw new ApiError(201,"Product not added")
        
            }
            const updateUser=await User.findByIdAndUpdate(req.user._id,{
                $push:{
                    recentProduct:newProduct._id
                }
            },{
                new:true
            })
            // req.product=newProduct;
            // updateUserProduct();
            
            return res.status(200).json(
                new ApiResponse(
                    200,
                    newProduct,
                    "Product Added Successfully"
    
                )
            )
    
    }
)

const getAllProducts=asyncHandler(
    async(req,res)=>{

        
    
          
            const products=await Product.find()
            console.log("product length",products.length)
            if(products.length <= 0){
                
                throw new ApiError(201,"No Product To View")
    
            }
    
            return res.status(200).json(
                new ApiResponse(
                    200,
                    products,
                    "Products Fetched Succesfully"
                )
    
            )
        
            
        }
    
)



export {getAllProducts,addProduct}