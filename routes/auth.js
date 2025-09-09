import express from "express";
import auth from "../middleware/auth.js";
import {
  register,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getMe);
router.put("/update-profile", auth, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
