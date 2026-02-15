import express from "express";
import { getMembershipPdf, submitMembership } from "../controllers/membershipController.js";

const router = express.Router();

router.post("/pdf", getMembershipPdf);
router.post("/submit", submitMembership);

export default router;
