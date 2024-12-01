import express from "express";
import {
  signup,
  signin,
  getUserById,
  edditProfile,
  changePassword,
  confirmEmail,
} from "../controllers/authController.js";
import upload from "../config/multerConfig.js";
import {
  addOrUpdateCompanyInfo,
  getCompanyById,
  getAllquestion,
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
  getFeedbackDetail,
  getRecentFeedback,
  publishSurvey,
  checkSecretePhrase,
  sortQuestion,
} from "../controllers/companyController.js";

const router = express.Router();
// 1. User routes
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/getuser/:userId").get(getUserById);
router.route("/updateProfile/:id").put(upload.single("image"), edditProfile);
router.route("/confirm-email/:token").get(confirmEmail);

// 2. Company routes
router.route("/addCompany").post(upload.single("logo"), addOrUpdateCompanyInfo);
router.route("/company/:id").get(getCompanyById);
router.route("/updateCompany/:id").put(upload.single("logo"), updateCompany);

// 3. Survey routes
router.route("/addServey").post(addServey);
router.route("/getFullSurvey/:secretePhrase").get(getFullSurvey);
router.route("/deleteServey").delete(deleteServey);
router.route("/publishSurvey/:surveyId").put(publishSurvey);

router.route("/getAllServey/:companyId").get(getAllServey);
router.route("/getQuestionBySurveyId/:surveyId").get(getQuestionBySurveyId);
router.route("/addQuestion").post(addQuestion);

router.route("/updateQuestion/:id").put(updateQuestion);
router.route("/deleteQuestionById").delete(deleteQuestionById);
router.route("/sortQuestion").put(sortQuestion);

// 3. preview routes
router.route("/getPreviewParams/:serveyId").get(getPreviewParams);
router.route("/getPreviewData/:companyName/:surveyId").get(getPreviewData);
router.route("/getAllQuestions/:companyId").get(getAllquestion);

router.route("/submitAnswer").post(submitAnswer);
router.route("/changepassword").put(changePassword);
router.route("/getFeedback/:id").get(getFeedback);
router.route("/getStatData/:id").get(getStatData);
router.route("/getFeedbackDetail/:surveyId").get(getFeedbackDetail);
router.route("/getRecentFeedback/:companyId").get(getRecentFeedback);
router.route("/checkSecretePhrase").post(checkSecretePhrase);

export default router;
