import express from "express";
import { getInstructors } from "../controllers/teamProfileController.js";

const router = express.Router();

router.get("/instructors", getInstructors);

export default router;
