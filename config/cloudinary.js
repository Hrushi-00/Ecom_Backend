// middleware/uploadMiddleware.js
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config(); 

//  Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//  Log if something is missing
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
  console.error(" Cloudinary ENV variables missing! Check your .env file.");
}

//  Create a Cloudinary storage instance
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => ({
    folder: "ecommerce_products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    public_id: file.originalname.split(".")[0],
  }),
});

//  Multer setup
const upload = multer({ storage });

export default upload;


