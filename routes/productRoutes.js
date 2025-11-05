import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { addFevorite } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addproduct", upload.single("image"), addProduct);
router.get("/products", getProducts);
router.put("/updateproduct/:id", upload.single("image"), updateProduct);
router.delete("/deleteproduct/:id", deleteProduct);
router.post("/addfavorite/:id", protect,addFevorite);

export default router;
