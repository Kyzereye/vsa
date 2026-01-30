import express from "express";
import { createRegistration, getRegistrations } from "../controllers/registrationController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createRegistration);
router.get("/", authenticateToken, requireAdmin, getRegistrations);

export default router;
