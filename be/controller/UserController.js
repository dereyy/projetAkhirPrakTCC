import bcrypt from "bcrypt";
import { User } from "../model/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middleware/Auth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UserController = {
  register: async (req, res) => {
    try {
      const { name, email, gender, password } = req.body;
      console.log("Register attempt for:", { name, email, gender });

      // Cek email sudah terdaftar
      const [existingUser] = await User.findByEmail(email);
      if (existingUser) {
        console.log("Email already registered");
        return res.status(400).json({ msg: "Email sudah terdaftar" });
      }

      // Hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log("Password hashed successfully");

      // Simpan user baru
      const result = await User.create({
        name,
        email,
        gender,
        password: hashedPassword,
      });
      console.log("User created successfully:", result);

      res.status(201).json({ msg: "Registrasi berhasil" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt for email:", email);

      if (!email || !password) {
        console.log("Missing email or password");
        return res.status(400).json({ msg: "Email dan password harus diisi" });
      }

      // Cek user
      const users = await User.findByEmail(email);
      const user = users[0]; // Ambil user pertama dari array

      if (!user) {
        console.log("User not found");
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }

      console.log("User found:", { id: user.id, email: user.email });

      if (!user.password) {
        console.log("User has no password set");
        return res.status(500).json({ msg: "Data user tidak valid" });
      }

      // Cek password
      const match = await bcrypt.compare(password, user.password);
      console.log("Password comparison result:", match);

      if (!match) {
        console.log("Password mismatch");
        return res.status(400).json({ msg: "Password salah" });
      }

      console.log("Password match, generating tokens");
      const userId = user.id;
      const name = user.name;
      const userEmail = user.email;

      const accessToken = generateAccessToken({ userId, name, userEmail });
      const refreshToken = generateRefreshToken({ userId, name, userEmail });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 hari
      });

      console.log("Login successful");
      res.json({ accessToken });
    } catch (error) {
      console.error("Login error:", error);
      // Log stack trace untuk debugging
      console.error("Stack trace:", error.stack);
      res.status(500).json({
        msg: "Terjadi kesalahan saat login",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },

  getMe: async (req, res) => {
    try {
      const [user] = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      res.json({ msg: "Logout berhasil" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },

  getProfilePhoto: async (req, res) => {
    try {
      const [user] = await User.findById(req.user.userId);
      if (!user || !user.foto_profil) {
        // Jika user tidak memiliki foto profil, kirim default profile
        return res.status(404).json({
          msg: "Foto profil tidak ditemukan",
          useDefault: true,
        });
      }

      // Send the photo buffer
      res.writeHead(200, {
        "Content-Type": "image/jpeg",
        "Content-Length": user.foto_profil.length,
      });
      res.end(user.foto_profil);
    } catch (error) {
      console.error("Error getting profile photo:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const updateData = {};

      // Update basic info if provided
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.gender) updateData.gender = req.body.gender;
      if (req.body.password) {
        const salt = await bcrypt.genSalt();
        updateData.password = await bcrypt.hash(req.body.password, salt);
      }

      // Update photo if provided
      if (req.file) {
        try {
          // File is already in memory as buffer
          updateData.foto_profil = req.file.buffer;
        } catch (error) {
          console.error("Error processing photo:", error);
          return res.status(500).json({ msg: "Gagal memproses foto profil" });
        }
      }

      // If no data to update
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ msg: "Tidak ada data yang diupdate" });
      }

      // Check if email is already used by another user
      if (updateData.email) {
        const [existingUser] = await User.findByEmail(updateData.email);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ msg: "Email sudah digunakan" });
        }
      }

      // Update user data
      const result = await User.update(userId, updateData);
      if (!result) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }

      // Get updated user data
      const [updatedUser] = await User.findById(userId);
      res.json({
        msg: "Profile berhasil diupdate",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ msg: error.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const [user] = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error getting profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
};
