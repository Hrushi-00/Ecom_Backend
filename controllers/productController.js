import Product from "../models/Product.js";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { title, price, rating } = req.body;
    const image = req.file?.path; // Cloudinary URL from multer-storage-cloudinary

    const newProduct = new Product({
      title,
      price,
      rating,
      image,
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
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

export const addFevorite = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isFavorite = !product.isFavorite;
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};