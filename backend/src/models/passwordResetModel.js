import pool from "../config/database.js";
import crypto from "crypto";

export const generateResetToken = () => crypto.randomBytes(32).toString("hex");

export const storeResetToken = async (userId, token) => {
  const connection = await pool.getConnection();
  try {
    await connection.execute("DELETE FROM password_reset_tokens WHERE user_id = ?", [userId]);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry
    await connection.execute(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt]
    );
  } finally {
    connection.release();
  }
};

export const verifyResetToken = async (token) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      "SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()",
      [token]
    );
    return rows.length > 0 ? rows[0].user_id : null;
  } finally {
    connection.release();
  }
};

export const deleteResetToken = async (token) => {
  const connection = await pool.getConnection();
  try {
    await connection.execute("DELETE FROM password_reset_tokens WHERE token = ?", [token]);
  } finally {
    connection.release();
  }
};
