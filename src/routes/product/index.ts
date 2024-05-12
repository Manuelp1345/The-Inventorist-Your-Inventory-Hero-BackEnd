//router main
import { Router } from "express";
import { login, register } from "../../modules/auth";
import {
  createProduct,
  createProducts,
  deleteProduct,
  getProductsBySearch,
  updateProduct,
} from "../../modules/product";
const authProduct = Router();

authProduct.get("/", getProductsBySearch);
authProduct.get("/:state/:search", getProductsBySearch);
authProduct.post("/", createProduct);
authProduct.patch("/:id", updateProduct);
authProduct.delete("/:id", deleteProduct);
authProduct.post("/bulk", createProducts);

export default authProduct;
