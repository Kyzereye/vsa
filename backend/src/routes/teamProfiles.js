import express from "express";
import { getInstructors, getBoardMembers, createTeamProfile, updateTeamProfile } from "../controllers/teamProfileController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/instructors", getInstructors);
router.get("/board", getBoardMembers);
router.post("/", authenticateToken, requireAdmin, createTeamProfile);
router.put("/:id", authenticateToken, requireAdmin, updateTeamProfile);

export default router;
