import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a product title"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide a product price"],
    min: [0, "Price must be greater than or equal to 0"],
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating"],
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be more than 5"],
  },
  image: {
    type: String,
    required: [true, "Please upload a product image"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Please provide a product description"],
  },
  category: {
    type: String,
    trim: true,
    required: [true, "Please provide a product category"],
  },
}, { timestamps: true }); 

const Product = mongoose.model("Product", productSchema);
export default Product;
