import express from "express";
import { placeOrder, getUserOrders} from "../controllers/orderController.js";
import { protect, adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/placeorder", protect, placeOrder);
router.get("/myorders", protect, getUserOrders);
export default router;
