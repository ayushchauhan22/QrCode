import express from "express";
import { generateQR } from "../controllers/qrcodeController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/generate/:userId", verifyToken, generateQR);

export default router;
