import express from "express";
import {
  getEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/by-slug/:slug", getEventBySlug);
router.get("/:id", getEventById);

// Protected routes - require authentication
router.use(authenticateToken);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
