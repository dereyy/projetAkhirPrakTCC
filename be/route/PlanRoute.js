import express from "express";
import {
  createPlanController,
  getPlansController,
  getPlanByIdController,
  updatePlanController,
  deletePlanController,
  updateRemainingAmountController,
} from "../controller/PlanController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Semua route memerlukan autentikasi
router.use(verifyToken);

// Route untuk plans
router.post("/", createPlanController);
router.get("/", getPlansController);
router.get("/:id", getPlanByIdController);
router.put("/:id", updatePlanController);
router.delete("/:id", deletePlanController);
router.patch("/:id/remaining", updateRemainingAmountController);

export default router;
