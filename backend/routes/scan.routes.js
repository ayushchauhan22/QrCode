import express from "express";
import { recordScan } from "../controllers/scanController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

router.post("/:userId", verifyToken, requireAdmin, recordScan);

export default router;
