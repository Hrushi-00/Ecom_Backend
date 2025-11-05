import express from "express";
const router = express.Router();

import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  editProfile,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

// 🔹 Public Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword/:token", resetPassword);

// 🔹 Protected Routes (require JWT)
router.put("/changePassword", protect, changePassword);
router.get("/profile", protect, getProfile);
router.put("/editProfile", protect, editProfile);

export default router;
