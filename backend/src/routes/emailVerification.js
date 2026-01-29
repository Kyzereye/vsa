import express from "express";
import { verifyEmail, resendVerificationEmail } from "../controllers/emailVerificationController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/verify", verifyEmail);
router.post("/resend", authenticateToken, resendVerificationEmail);

export default router;
