import Order from "../models/Order.js";
import User from "../models/userModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderItems, shippingInfo, totalAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "No order items" });
    }

    const order = new Order({
      user: userId,
      orderItems,
      shippingInfo,
      totalAmount,
    });

    await order.save();

    return res.status(201).json({ success: true, message: "Order placed", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};