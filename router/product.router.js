import { Router } from "express";
import { addProduct, getAllProducts } from "../controller/product.controller.js";

const productRouter=Router();

productRouter.route("/").get(getAllProducts)
productRouter.route("/addProduct").post(addProduct)

export default productRouter