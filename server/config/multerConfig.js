import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js"; // Your cloudinary configuration

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "company_logos", // The folder in your Cloudinary account where images will be stored
    allowed_formats: ["jpg", "png"], // Allowed image formats
  },
});

const upload = multer({ storage: storage });
console.log("Upload:", upload);

export default upload;
