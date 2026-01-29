import express from "express";
import {
  getPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
} from "../controllers/programController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPrograms);
router.get("/:id", getProgramById);

// Protected routes - require authentication
router.use(authenticateToken);
router.post("/", createProgram);
router.put("/:id", updateProgram);
router.delete("/:id", deleteProgram);

export default router;
