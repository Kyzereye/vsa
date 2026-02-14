import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getGallery, uploadImage, deleteImage } from "../controllers/galleryController.js";
import { authenticateToken } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_GALLERY = path.join(path.dirname(__dirname), "..", "uploads", "gallery");

// Image upload limits:
// - fileSize: 10MB (memory/disk)
// - MIME: JPEG, PNG, GIF, WebP only
// - dimensions: max 8000×8000 px (see galleryController.js)

// Ensure uploads/gallery exists
if (!fs.existsSync(UPLOADS_GALLERY)) {
  fs.mkdirSync(UPLOADS_GALLERY, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_GALLERY),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    const safe = (file.originalname || "image").replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 50);
    const base = path.basename(safe, path.extname(safe)) || "image";
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpe?g|png|gif|webp)$/i;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed"));
    }
  },
});

const router = express.Router();

const uploadErrorHandler = (err, req, res, next) => {
  if (!err) return next();
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image is too large (max 10MB)" });
    }
    return res.status(400).json({ message: err.message });
  }
  return res.status(400).json({ message: err.message || "Upload failed" });
};

router.get("/", getGallery);
router.post("/", authenticateToken, upload.single("image"), uploadErrorHandler, uploadImage);
router.delete("/:id", authenticateToken, deleteImage);

export default router;
