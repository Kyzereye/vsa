import pool from "../config/database.js";
import crypto from "crypto";

// Generate verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Store verification token
export const storeVerificationToken = async (userId, email, token, isEmailChange = false) => {
  const connection = await pool.getConnection();
  try {
    // Delete any existing tokens for this user/email
    await connection.execute(
      "DELETE FROM email_verifications WHERE user_id = ? AND email = ?",
      [userId, email]
    );

    // Insert new token
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    await connection.execute(
      `INSERT INTO email_verifications (user_id, email, token, expires_at, is_email_change) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, email, token, expiresAt, isEmailChange ? 1 : 0]
    );
  } finally {
    connection.release();
  }
};

// Verify token and get user info
export const verifyToken = async (token) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT user_id, email, is_email_change, expires_at 
       FROM email_verifications 
       WHERE token = ? AND expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } finally {
    connection.release();
  }
};

// Delete verification token after use
export const deleteVerificationToken = async (token) => {
  const connection = await pool.getConnection();
  try {
    await connection.execute("DELETE FROM email_verifications WHERE token = ?", [token]);
  } finally {
    connection.release();
  }
};
