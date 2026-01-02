import e from "express";
import Product from "../models/Product.js";
import User from "../models/userModel.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { title, price, rating, description, category } = req.body;
    const image = req.file?.path;   

    const newProduct = new Product({
      title,
      price,
      rating,
      image,
      description,
      category,
      
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { title, price, rating } = req.body;
    const image = req.file?.path; // new image URL if uploaded

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { title, price, rating, ...(image && { image }) },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get Products
// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
let cache = null;
let lastFetch = 0;
export const getProducts = async (req, res) => {
  const now = Date.now();

  if (cache && now - lastFetch < 60000) {
    return res.json(cache);
  }

  const products = await Product.find()
    .select("title price rating image category")
    .lean();

  cache = products;
  lastFetch = now;

  res.json(products);
};
// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if already in favorites
    if (user.favorites.includes(productId)) {
      return res.status(400).json({ success: false, message: "Product already in favorites" });
    }

    user.favorites.push(productId);
    await user.save();

    return res.status(200).json({ success: true, message: "Product added to favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const index = user.favorites.indexOf(productId);
    if (index === -1) {
      return res.status(400).json({ success: false, message: "Product not found in favorites" });
    }

    user.favorites.splice(index, 1);
    await user.save();

    return res.status(200).json({ success: true, message: "Product removed from favorites" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getFavoriteItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      count: user.favorites.length,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addTocart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.cart) user.cart = [];

    if (user.cart.includes(productId)) {
      return res.status(400).json({ success: false, message: "Already in cart" });
    }

    user.cart.push(productId);
    await user.save();

    res.status(200).json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCartItems = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      count: user.cart.length,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id; // from protect middleware
    const productId = req.params.id;

    // Ensure product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove product from user's cart
    user.cart = user.cart.filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.cart = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Search Products

export const searchProducts = async (req, res) => {
  try {
    const query = req.query.q ? req.query.q.trim() : "";

    // If query is empty, return all products (optional)
    if (!query) {
      const allProducts = await Product.find();
      return res.status(200).json({ success: true, products: allProducts });
    }

    // Case-insensitive regex match across multiple fields
    const regex = new RegExp(query, "i");

    const products = await Product.find({
      $or: [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

