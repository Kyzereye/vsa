import express from "express";
import {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../controllers/newsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getNews);
router.get("/:id", getNewsById);

// Protected routes - require authentication
router.use(authenticateToken);
router.post("/", createNews);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

export default router;
