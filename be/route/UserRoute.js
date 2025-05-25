import express from "express";
import User from "../model/User.js";
import Transaction from "../model/Transaction.js";
import Category from "../model/Category.js";
import { verifyToken } from "../middleware/Auth.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { UserController } from "../controller/UserController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Auth routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);

// Profile routes
router.get("/me", verifyToken, UserController.getProfile);
router.get("/profile/photo", verifyToken, UserController.getProfilePhoto);
router.put(
  "/profile",
  verifyToken,
  upload.single("foto_profil"),
  UserController.updateProfile
);
router.post("/logout", verifyToken, UserController.logout);

// Delete user account
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("Attempting to delete user with ID:", userId);

    // Delete all transactions
    console.log("Deleting transactions for user:", userId);
    await Transaction.destroy({ where: { userId } });

    // Delete user
    console.log("Deleting user:", userId);
    const result = await User.destroy({ where: { id: userId } });

    if (!result) {
      console.error("Failed to delete user");
      return res.status(500).json({
        status: "error",
        message: "Gagal menghapus user",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Akun berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus akun: " + error.message,
    });
  }
});

export default router;
