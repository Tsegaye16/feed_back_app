import express from "express";
import { signup, signin, getUserById } from "../controllers/authController.js";
import upload from "../config/multerConfig.js";
import {
  addOrUpdateCompanyInfo,
  getCompanyById,
  addTrueFalseQuestion,
  getAllquestion,
  updateTrueFalse,
  deleteTrueFalse,
  addChoiceQuestion,
  addServey,
  getAllServey,
} from "../controllers/companyController.js";

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
router.route("/addChoiceQuestion").post(addChoiceQuestion);
router.route("/addServey").post(addServey);
router.route("/getAllServey/:companyId").get(getAllServey);

export default router;
