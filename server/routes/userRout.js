import express from "express";
import {
  signup,
  signin,
  getUserById,
  edditProfile,
  changePassword,
} from "../controllers/authController.js";
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
  deleteServey,
  addQuestion,
  getPreviewParams,
  getPreviewData,
  getQuestionBySurveyId,
  deleteQuestionById,
  updateQuestion,
  getFullSurvey,
  updateCompany,
  submitAnswer,
  getFeedback,
  getStatData,
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
router.route("/deleteServey").delete(deleteServey);
router.route("/addQuestion").post(addQuestion);
router.route("/getPreviewParams/:serveyId").get(getPreviewParams);
router.route("/getPreviewData/:companyName/:surveyId").get(getPreviewData);
router.route("/getQuestionBySurveyId/:surveyId").get(getQuestionBySurveyId);
router.route("/deleteQuestionById").delete(deleteQuestionById);
router.route("/updateQuestion/:id").put(updateQuestion);
router.route("/getFullSurvey/:secretePhrase").get(getFullSurvey);
router.route("/updateProfile/:id").put(upload.single("image"), edditProfile);
router.route("/updateCompany/:id").put(upload.single("logo"), updateCompany);
router.route("/submitAnswer").post(submitAnswer);
router.route("/changepassword").put(changePassword);
router.route("/getFeedback/:id").get(getFeedback);
router.route("/getStatData/:id").get(getStatData);

export default router;
