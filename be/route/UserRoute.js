import express from "express";
import { UserController } from "../controller/UserController.js";
import { verifyToken } from "../middleware/Auth.js";

const router = express.Router();

// Auth routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/me", verifyToken, UserController.getMe);
router.delete("/logout", UserController.logout);

export default router;
