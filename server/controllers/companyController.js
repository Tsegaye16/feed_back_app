import Company from "../models/companyModel.js";
import cloudinary from "../config/cloudinaryConfig.js";

export const addCompanyInfo = async (req, res) => {
  try {
    const { name, backGroundColor, textColor } = req.body;

    // The logo will be in req.file due to Multer

    const logo = req.file?.path; // Cloudinary returns the image path in the file object

    const result = await Company.create({
      name,
      logo, // Save the Cloudinary URL
      backGroundColor,
      textColor,
    });

    res
      .status(201)
      .json({ message: "Company info added successfully", result });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", Error: error });
  }
};
