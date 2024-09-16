import express from "express";
import { signup, getOneUser } from "../controllers/userController.js";

const router = express.Router();
router.route("/").post(signup);
router.route("/:id").get(getOneUser);
export default router;
