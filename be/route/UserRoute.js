import express from "express";
import { UserController } from "../controller/UserController.js";
import { verifyToken } from "../middleware/Auth.js";
import { body } from "express-validator";
import { upload } from "../middleware/Upload.js";
import { auth } from "../middleware/Auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { validationResult } from "express-validator";
import db from "../config/database.js";

const router = express.Router();

// Konfigurasi multer untuk upload gambar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/profile";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadMulter = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."));
    }
  },
});

// Auth routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/me", verifyToken, UserController.getMe);
router.delete("/logout", UserController.logout);

// Get profile photo
router.get("/profile/photo", verifyToken, UserController.getProfilePhoto);

// Update user profile
router.put(
  "/profile",
  auth,
  uploadMulter.single("foto_profil"),
  async (req, res) => {
    try {
      const userId = req.user.userId;
      console.log("Update profile request body:", req.body);
      console.log("Update profile request file:", req.file);

      // Validasi input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      // Cek apakah email sudah digunakan (jika email diubah)
      if (req.body.email) {
        const [existingUser] = await db.query(
          "SELECT * FROM users WHERE email = ? AND id != ?",
          [req.body.email, userId]
        );
        if (existingUser.length > 0) {
          return res.status(400).json({ msg: "Email sudah digunakan" });
        }
      }

      // Siapkan data update
      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.gender) updateData.gender = req.body.gender;
      if (req.file) {
        // Baca file sebagai buffer
        const fileBuffer = fs.readFileSync(req.file.path);
        updateData.foto_profil = fileBuffer;
        // Hapus file setelah dibaca
        fs.unlinkSync(req.file.path);
      }

      // Jika tidak ada data yang diupdate
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ msg: "Tidak ada data yang diupdate" });
      }

      // Update data user
      const [result] = await db.query(
        "UPDATE users SET ? WHERE id = ?",
        [updateData, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }

      // Ambil data user yang sudah diupdate
      const [updatedUser] = await db.query(
        "SELECT id, name, email, gender FROM users WHERE id = ?",
        [userId]
      );

      res.json({
        msg: "Profile berhasil diupdate",
        user: updatedUser[0],
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

export default router; 