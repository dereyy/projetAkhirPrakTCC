import express from "express";
import { UserController } from "../controller/UserController.js";
import { verifyToken } from "../middleware/Auth.js";
import multer from "multer";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Auth routes
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/me", verifyToken, UserController.getMe);
router.delete("/logout", UserController.logout);
router.delete("/user", UserController.logout);

// Profile routes
router.get("/profile/photo", verifyToken, UserController.getProfilePhoto);
router.put("/profile", verifyToken, upload.single('foto_profil'), UserController.updateProfile);

export default router; 