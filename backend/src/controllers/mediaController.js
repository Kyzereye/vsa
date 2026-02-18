import pool from "../config/database.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sizeOf from "image-size";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_ROOT = path.join(path.dirname(__dirname), "..", "uploads");

const MAX_IMAGE_WIDTH = 8000;
const MAX_IMAGE_HEIGHT = 8000;

const MEDIA_TYPES = ["gallery", "event", "page", "team", "document"];

function formatMediaRow(row) {
  return {
    id: row.id,
    type: row.type,
    path: row.path,
    altText: row.alt_text ?? null,
    caption: row.caption ?? null,
    displayOrder: row.display_order ?? 0,
    eventId: row.event_id ?? null,
    eventTitle: row.event_title ?? null,
    teamProfileId: row.team_profile_id ?? null,
    title: row.title ?? null,
    fileType: row.file_type ?? null,
    createdAt: row.created_at ? row.created_at.toISOString() : null,
  };
}

export const getMedia = async (req, res) => {
  let connection;
  try {
    const type = req.query.type;
    if (type && !MEDIA_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    connection = await pool.getConnection();
    let sql = `SELECT m.id, m.type, m.path, m.alt_text, m.caption, m.display_order, m.event_id, m.team_profile_id, m.title, m.file_type, m.created_at, e.title AS event_title
       FROM media m
       LEFT JOIN events e ON m.event_id = e.id
       WHERE 1=1`;
    const params = [];
    if (type) {
      sql += " AND m.type = ?";
      params.push(type);
    }
    sql += " ORDER BY m.type ASC, m.display_order ASC, m.id ASC";

    const [rows] = await connection.execute(sql, params);
    connection.release();
    res.json(rows.map(formatMediaRow));
  } catch (error) {
    if (connection) connection.release();
    console.error("Get media error:", error);
    res.status(500).json({ message: "Error fetching media" });
  }
};

export const uploadMedia = async (req, res) => {
  let connection;
  try {
    const type = (req.query.type || (req.body && req.body.type) || "gallery").toLowerCase();
    if (!MEDIA_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path ?? path.join(req.file.destination, req.file.filename);
    const isImage = (req.file.mimetype || "").startsWith("image/");

    if (isImage) {
      let dimensions;
      try {
        dimensions = sizeOf(filePath);
      } catch (e) {
        dimensions = null;
      }
      if (dimensions?.width && dimensions?.height) {
        if (dimensions.width > MAX_IMAGE_WIDTH || dimensions.height > MAX_IMAGE_HEIGHT) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {}
          return res.status(400).json({
            message: `Image dimensions too large. Max ${MAX_IMAGE_WIDTH}×${MAX_IMAGE_HEIGHT}px`,
          });
        }
      }
    }

    const relativePath = `${type}/${req.file.filename}`;
    const eventId = req.body.eventId ? parseInt(req.body.eventId, 10) : null;
    const teamProfileId = req.body.teamProfileId ? parseInt(req.body.teamProfileId, 10) : null;
    const altText = (req.body.altText || req.body.alt_text || "").trim() || null;
    const caption = (req.body.caption || "").trim() || null;
    const title = (req.body.title || "").trim() || null;
    const displayOrder = req.body.displayOrder != null ? parseInt(req.body.displayOrder, 10) : 0;

    connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO media (type, path, alt_text, caption, display_order, event_id, team_profile_id, title, file_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [type, relativePath, altText, caption, displayOrder, eventId || null, teamProfileId || null, title || null, req.file.mimetype || null]
    );
    const [rows] = await connection.execute(
      `SELECT m.id, m.type, m.path, m.alt_text, m.caption, m.display_order, m.event_id, m.team_profile_id, m.title, m.file_type, m.created_at, e.title AS event_title
       FROM media m LEFT JOIN events e ON m.event_id = e.id WHERE m.id = ?`,
      [result.insertId]
    );
    connection.release();

    res.status(201).json({
      message: "File uploaded successfully",
      media: formatMediaRow(rows[0]),
    });
  } catch (error) {
    if (connection) connection.release();
    const uploadPath = req.file?.path ?? (req.file?.destination && req.file?.filename ? path.join(req.file.destination, req.file.filename) : null);
    if (uploadPath && fs.existsSync(uploadPath)) {
      try {
        fs.unlinkSync(uploadPath);
      } catch (e) {}
    }
    console.error("Upload media error:", error);
    res.status(500).json({ message: "Error uploading file" });
  }
};

export const deleteMedia = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    const [rows] = await connection.execute("SELECT id, path FROM media WHERE id = ?", [id]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Media not found" });
    }

    const filePath = path.join(UPLOADS_ROOT, rows[0].path);
    await connection.execute("DELETE FROM media WHERE id = ?", [id]);
    connection.release();

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error("Delete media file error:", e);
      }
    }

    res.json({ message: "Media deleted successfully" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Delete media error:", error);
    res.status(500).json({ message: "Error deleting media" });
  }
};
