// src/routes/summarize.route.ts
import { Router } from "express";
import { getSurveySummary } from "../controllers/summary.js";

const router = Router();

router.get("/summarize", getSurveySummary);

export default router;
