import express from "express";
import { signup, signin, getUserById } from "../controllers/authController.js";
import { addCompanyInfo } from "../controllers/companyController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/getuser/:userId").get(getUserById);
router.route("/addCompany").post(upload.single("logo"), addCompanyInfo);

export default router;
