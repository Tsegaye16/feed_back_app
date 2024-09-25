import express from "express";
import { signup, signin, getUserById } from "../controllers/authController.js";
import { addOrUpdateCompanyInfo } from "../controllers/companyController.js";
import upload from "../config/multerConfig.js";
import { getCompanyById } from "../controllers/companyController.js";
import { addTrueFalseQuestion } from "../controllers/companyController.js";
import { getAllquestion } from "../controllers/companyController.js";
import { updateTrueFalse } from "../controllers/companyController.js";
import { deleteTrueFalse } from "../controllers/companyController.js";

const router = express.Router();
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/getuser/:userId").get(getUserById);
router.route("/addCompany").post(upload.single("logo"), addOrUpdateCompanyInfo);
router.route("/company/:id").get(getCompanyById);
router.route("/addTrueFalse").post(addTrueFalseQuestion);
router.route("/getAllQuestions/:companyId").get(getAllquestion);
router.route("/updateTrueFalse/:id").put(updateTrueFalse);
router.route("/deleteTrueFalse/:id").delete(deleteTrueFalse);

export default router;
