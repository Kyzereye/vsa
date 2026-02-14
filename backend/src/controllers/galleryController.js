import pool from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sizeOf from "image-size";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(path.dirname(__dirname), "..", "uploads", "gallery");

// Image limits (also see multer limits in routes/gallery.js)
const MAX_IMAGE_WIDTH = 8000;
const MAX_IMAGE_HEIGHT = 8000;

function formatGalleryRow(row) {
  return {
    id: row.id,
    url: row.url,
    altText: row.alt_text ?? null,
    caption: row.caption ?? null,
    displayOrder: row.display_order ?? 0,
    eventId: row.event_id ?? null,
    eventTitle: row.event_title ?? null,
    createdAt: row.created_at ? row.created_at.toISOString() : null,
  };
}

export const getGallery = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT g.id, g.url, g.alt_text, g.caption, g.display_order, g.event_id, g.created_at, e.title AS event_title
       FROM gallery_images g
       LEFT JOIN events e ON g.event_id = e.id
       ORDER BY g.display_order ASC, g.id DESC`
    );
    connection.release();
    res.json(rows.map(formatGalleryRow));
  } catch (error) {
    if (connection) connection.release();
    console.error("Get gallery error:", error);
    res.status(500).json({ message: "Error fetching gallery" });
  }
};

export const uploadImage = async (req, res) => {
  let connection;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const filePath = req.file.path ?? path.join(req.file.destination, req.file.filename);
    let dimensions;
    try {
      dimensions = sizeOf(filePath);
    } catch (e) {
      // image-size can throw on some valid JPEGs (e.g. certain EXIF/camera encodings); allow upload and skip dimension check
      console.warn("Could not read image dimensions (skipping size limit check):", e.message);
      dimensions = null;
    }
    if (dimensions?.width && dimensions?.height) {
      if (dimensions.width > MAX_IMAGE_WIDTH || dimensions.height > MAX_IMAGE_HEIGHT) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Cleanup after dimension reject:", e);
        }
        return res.status(400).json({
          message: `Image dimensions too large. Max ${MAX_IMAGE_WIDTH}×${MAX_IMAGE_HEIGHT}px (got ${dimensions.width}×${dimensions.height})`,
        });
      }
    }

    const eventId = req.body.eventId ? parseInt(req.body.eventId, 10) : null;
    const altText = (req.body.altText || req.body.alt_text || "").trim() || null;
    const caption = (req.body.caption || "").trim() || null;
    const displayOrder = req.body.displayOrder != null ? parseInt(req.body.displayOrder, 10) : 0;

    // Store path relative to uploads folder: gallery/filename
    const relativePath = `gallery/${req.file.filename}`;

    connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO gallery_images (url, alt_text, caption, display_order, event_id) VALUES (?, ?, ?, ?, ?)",
      [relativePath, altText, caption, displayOrder, eventId || null]
    );
    const [rows] = await connection.execute(
      `SELECT g.id, g.url, g.alt_text, g.caption, g.display_order, g.event_id, g.created_at, e.title AS event_title
       FROM gallery_images g
       LEFT JOIN events e ON g.event_id = e.id
       WHERE g.id = ?`,
      [result.insertId]
    );
    connection.release();

    res.status(201).json({
      message: "Image uploaded successfully",
      image: formatGalleryRow(rows[0]),
    });
  } catch (error) {
    if (connection) connection.release();
    const uploadPath = req.file?.path ?? (req.file?.destination && req.file?.filename ? path.join(req.file.destination, req.file.filename) : null);
    if (uploadPath && fs.existsSync(uploadPath)) {
      try {
        fs.unlinkSync(uploadPath);
      } catch (e) {
        console.error("Cleanup upload file error:", e);
      }
    }
    console.error("Upload gallery image error:", error);
    const payload = { message: "Error uploading image" };
    if (process.env.NODE_ENV !== "production") {
      payload.error = error.message;
    }
    res.status(500).json(payload);
  }
};

export const deleteImage = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT id, url FROM gallery_images WHERE id = ?", [id]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Image not found" });
    }

    const url = rows[0].url;
    await connection.execute("DELETE FROM gallery_images WHERE id = ?", [id]);
    connection.release();

    // Delete file if it's under our uploads folder (path like gallery/filename)
    if (url && url.startsWith("gallery/")) {
      const filePath = path.join(UPLOADS_DIR, path.basename(url));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Delete gallery file error:", e);
        }
      }
    }

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Delete gallery image error:", error);
    res.status(500).json({ message: "Error deleting image" });
  }
};
