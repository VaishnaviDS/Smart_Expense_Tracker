import express from "express";
import {  getTransactionDashboard } from "../controllers/dashboard.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, getTransactionDashboard);
// router.get("/ai-insights", authenticate, getAISpendingInsights);

export default router;