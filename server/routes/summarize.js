// src/routes/summarize.route.ts
import { Router } from "express";
import { getSurveySummary } from "../controllers/summary";

const router = Router();

router.get("/summarize", getSurveySummary);

export default router;
