import express from "express";
import {
  createRegistration,
  getRegistrations,
  getMyRegistrations,
  deleteRegistration,
} from "../controllers/registrationController.js";
import { authenticateToken, requireAdmin, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", optionalAuth, createRegistration);
router.get("/mine", authenticateToken, getMyRegistrations);
router.delete("/:id", authenticateToken, deleteRegistration);
router.get("/", authenticateToken, requireAdmin, getRegistrations);

export default router;
