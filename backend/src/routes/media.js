import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getMedia, uploadMedia, deleteMedia } from "../controllers/mediaController.js";
import { authenticateToken } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = path.join(path.dirname(__dirname), "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = (req.query.type || "gallery").toLowerCase();
    const allowed = ["gallery", "event", "page", "team", "document"];
    if (!allowed.includes(type)) {
      return cb(new Error("Invalid type"));
    }
    const dir = path.join(UPLOADS_ROOT, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const base = (file.originalname || "file").replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 80);
    const name = path.basename(base, path.extname(base)) || "file";
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const type = (req.query.type || "gallery").toLowerCase();
    const isImage = /^image\/(jpe?g|png|gif|webp)$/i.test(file.mimetype);
    const isPdf = file.mimetype === "application/pdf";
    if (type === "document") {
      if (isPdf) return cb(null, true);
      return cb(new Error("Documents must be PDF"));
    }
    if (isImage) return cb(null, true);
    cb(new Error("Only images (JPEG, PNG, GIF, WebP) allowed for this type"));
  },
});

const uploadErrorHandler = (err, req, res, next) => {
  if (!err) return next();
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large (max 15MB)" });
    }
    return res.status(400).json({ message: err.message });
  }
  return res.status(400).json({ message: err.message || "Upload failed" });
};

const router = express.Router();

router.get("/", getMedia);
router.post("/", authenticateToken, upload.single("file"), uploadErrorHandler, uploadMedia);
router.delete("/:id", authenticateToken, deleteMedia);

export default router;
