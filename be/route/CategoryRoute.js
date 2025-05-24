import express from "express";
import { CategoryController } from "../controller/CategoryController.js";
import { verifyToken } from "../middleware/Auth.js";

const router = express.Router();

// Semua route kategori memerlukan autentikasi
router.use(verifyToken);

// CRUD routes untuk kategori
router.post("/", CategoryController.create);
router.get("/", CategoryController.getAll);
router.get("/:jenis", CategoryController.getByJenis);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.delete);

export default router; 