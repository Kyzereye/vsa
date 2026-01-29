import express from "express";
import { getUsers, getUserById, updateUser, deleteUser, resetPassword } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All user routes require authentication
router.use(authenticateToken);

router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/reset-password", resetPassword);

export default router;
