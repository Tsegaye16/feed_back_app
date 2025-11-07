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
import {authenticateToken} from "../midlwares/authMidleware.js"
const router = express.Router();
//authenticateToken
// 1. User routes
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/getuser/:userId", authenticateToken).get(getUserById);
router.route("/updateProfile/:id", authenticateToken).put(upload.single("image"), edditProfile);
router.route("/confirm-email/:token").get(confirmEmail);

// 2. Company routes
router.route("/addCompany",authenticateToken).post(upload.single("logo"), addOrUpdateCompanyInfo);
router.route("/company/:id",authenticateToken).get(getCompanyById);
router.route("/updateCompany/:id",authenticateToken).put(upload.single("logo"), updateCompany);

// 3. Survey routes
router.route("/addServey",authenticateToken).post(addServey);
router.route("/getFullSurvey/:secretePhrase",authenticateToken).get(getFullSurvey);
router.route("/deleteServey",authenticateToken).delete(deleteServey);
router.route("/publishSurvey/:surveyId",authenticateToken).put(publishSurvey);

router.route("/getAllServey/:companyId",authenticateToken).get(getAllServey);
router.route("/getQuestionBySurveyId/:surveyId",authenticateToken).get(getQuestionBySurveyId);
router.route("/addQuestion",authenticateToken).post(addQuestion);

router.route("/updateQuestion/:id",authenticateToken).put(updateQuestion);
router.route("/deleteQuestionById",authenticateToken).delete(deleteQuestionById);
router.route("/sortQuestion",authenticateToken).put(sortQuestion);

// 3. preview routes
router.route("/getPreviewParams/:serveyId",authenticateToken).get(getPreviewParams);
router.route("/getPreviewData/:companyName/:surveyId",authenticateToken).get(getPreviewData);
router.route("/getAllQuestions/:companyId",authenticateToken).get(getAllquestion);

router.route("/submitAnswer").post(submitAnswer);
router.route("/changepassword", authenticateToken).put(changePassword);
router.route("/getFeedback/:id", authenticateToken).get(getFeedback);
router.route("/getStatData/:id", authenticateToken).get(getStatData);
router.route("/getFeedbackDetail/:surveyId", authenticateToken).get(getFeedbackDetail);
router.route("/getRecentFeedback/:companyId", authenticateToken).get(getRecentFeedback);
router.route("/checkSecretePhrase", authenticateToken).post(checkSecretePhrase);

export default router;
