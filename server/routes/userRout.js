import express from "express";
import { signup, signin, getUserById } from "../controllers/authController.js";

const router = express.Router();
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/getuser/:userId").get(getUserById);

export default router;
