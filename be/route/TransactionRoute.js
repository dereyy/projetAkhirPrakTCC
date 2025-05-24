import express from "express";
import { TransactionController } from "../controller/TransactionController.js";
import { verifyToken } from "../middleware/Auth.js";

const router = express.Router();

// Semua route transaksi memerlukan autentikasi
router.use(verifyToken);

// CRUD routes untuk transaksi
router.post("/", TransactionController.create);
router.get("/", TransactionController.getAll);
router.get("/range", TransactionController.getByDateRange);
router.put("/:id", TransactionController.update);
router.delete("/:id", TransactionController.delete);

export default router; 