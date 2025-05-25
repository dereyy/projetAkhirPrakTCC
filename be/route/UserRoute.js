import express from "express";
import { User } from "../model/User.js";
import { Transaction } from "../model/Transaction.js";
import { Category } from "../model/Category.js";
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

// Delete user account
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Menggunakan userId dari token
    console.log("Attempting to delete user with ID:", userId);

    // Hapus semua transaksi user
    console.log("Deleting transactions for user:", userId);
    const [transactionResult] = await Transaction.deleteByUserId(userId);
    console.log("Transaction deletion result:", transactionResult);

    // Hapus semua kategori user
    console.log("Deleting categories for user:", userId);
    const [categoryResult] = await Category.deleteByUserId(userId);
    console.log("Category deletion result:", categoryResult);

    // Hapus foto profil jika ada
    console.log("Checking user profile photo");
    const [user] = await User.findById(userId);
    if (user && user.foto_profil) {
      console.log("User has profile photo, will be deleted");
    }

    // Hapus user
    console.log("Deleting user:", userId);
    const deleteResult = await User.delete(userId);
    console.log("User deletion result:", deleteResult);

    if (!deleteResult) {
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
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
    });
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus akun: " + error.message,
    });
  }
});

export default router;
