import express from "express";
import { TransactionController } from "../controller/TransactionController.js";
import { verifyToken } from "../middleware/Auth.js";

const router = express.Router();

// Create transaction
router.post("/", verifyToken, TransactionController.create);

// Get transaction by ID
router.get("/:id", verifyToken, TransactionController.getById);

// Get all transactions for user
router.get("/", verifyToken, TransactionController.getByUserId);

// Get transactions by date range
router.get("/date-range", verifyToken, TransactionController.getByDateRange);

// Update transaction
router.put("/:id", verifyToken, TransactionController.update);

// Delete transaction
router.delete("/:id", verifyToken, TransactionController.delete);

export default router;
