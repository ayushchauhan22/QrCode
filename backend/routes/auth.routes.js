import express from "express";
import {
  register,
  login,
  verifiedToken,
  getMe,
  logout,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", verifyToken, verifiedToken);
router.get("/me", verifyToken, getMe);

export default router;
