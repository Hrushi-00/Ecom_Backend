import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addFavorite,
  addTocart,
  getFavoriteItems,
  getCartItems,
  removeFavorite,
  removeFromCart,
} from "../controllers/productController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/products", getProducts);

router.post("/addproduct", protect, adminProtect, upload.single("image"), addProduct);
router.put("/updateproduct/:id", protect, adminProtect, upload.single("image"), updateProduct);
router.delete("/deleteproduct/:id", protect, adminProtect, deleteProduct);
router.post("/addfavorite/:id", protect, addFavorite);
router.post("/addtocart/:id", protect, addTocart);
router.delete("/favorites/:id", protect, removeFavorite);
router.get("/favorites", protect, getFavoriteItems);
router.get("/cart", protect, getCartItems);
router.delete("/removefromcart/:id", protect, removeFromCart);
export default router;
