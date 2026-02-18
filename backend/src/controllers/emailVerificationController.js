import pool from "../config/database.js";
import { verifyToken, deleteVerificationToken } from "../models/emailVerificationModel.js";

export const verifyEmail = async (req, res) => {
  let connection;
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }

    // Verify token
    const verification = await verifyToken(token);

    if (!verification) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    connection = await pool.getConnection();

    if (verification.is_email_change) {
      // Email change verification - update email and reset verification status
      await connection.execute(
        `UPDATE users 
         SET email = ?, email_verified = 1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [verification.email, verification.user_id]
      );
    } else {
      // Initial email verification - just mark as verified
      await connection.execute(
        `UPDATE users 
         SET email_verified = 1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [verification.user_id]
      );
    }

    // Delete used token
    await deleteVerificationToken(token);

    connection.release();

    res.json({
      message: "Email verified successfully",
      verified: true,
    });
  } catch (error) {
    if (connection) connection.release();
    console.error("Email verification error:", error);
    res.status(500).json({ message: "Error verifying email" });
  }
};

export const resendVerificationEmail = async (req, res) => {
  let connection;
  try {
    const userId = req.user.id;

    connection = await pool.getConnection();

    const [users] = await connection.execute(
      "SELECT u.id, u.email, u.email_verified, d.name FROM users u LEFT JOIN user_details d ON d.user_id = u.id WHERE u.id = ?",
      [userId]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    if (user.email_verified) {
      connection.release();
      return res.status(400).json({ message: "Email is already verified" });
    }

    connection.release();

    // Generate new token and send email
    const { generateVerificationToken, storeVerificationToken } = await import(
      "../models/emailVerificationModel.js"
    );
    const { sendVerificationEmail } = await import("../services/emailService.js");

    const verificationToken = generateVerificationToken();
    await storeVerificationToken(user.id, user.email, verificationToken, false);

    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
      res.json({ message: "Verification email sent successfully" });
    } catch (err) {
      console.error("Failed to send verification email:", err);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  } catch (error) {
    if (connection) connection.release();
    console.error("Resend verification email error:", error);
    res.status(500).json({ message: "Error resending verification email" });
  }
};
