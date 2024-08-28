import { Router } from "express";
import { addProduct, getAllProducts } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const productRouter=Router();

productRouter.route("/").get(getAllProducts)
productRouter.route("/addProduct").post(upload.fields([{
    name:"images",
    maxCount:1
}]),verifyJWT,addProduct)

export default productRouter