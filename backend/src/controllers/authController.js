import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../services/emailService.js";
import {
  generateVerificationToken,
  storeVerificationToken,
} from "../models/emailVerificationModel.js";
import {
  generateResetToken,
  storeResetToken,
  verifyResetToken,
  deleteResetToken,
} from "../models/passwordResetModel.js";
import { normalizePhoneToDigits } from "../utils/phone.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const register = async (req, res) => {
  let connection;
  try {
    const { name, email, phone, password } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ message: "Password is required" });
    }

    connection = await pool.getConnection();

    // Check if user already exists
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email.trim()]
    );

    if (existingUsers.length > 0) {
      connection.release();
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const phoneDigits = normalizePhoneToDigits(phone);

    const [result] = await connection.execute(
      "INSERT INTO users (email, password_hash, status, email_verified) VALUES (?, ?, 'active', 0)",
      [email.trim(), hashedPassword]
    );
    await connection.execute(
      "INSERT INTO user_details (user_id, name, phone, role, join_date, email_opt_in) VALUES (?, ?, ?, 'member', CURDATE(), 0)",
      [result.insertId, name.trim(), phoneDigits]
    );

    // Generate verification token
    const verificationToken = generateVerificationToken();
    await storeVerificationToken(result.insertId, email.trim(), verificationToken, false);

    connection.release();

    sendVerificationEmail(email.trim(), name.trim(), verificationToken).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
      requiresVerification: true,
    });
  } catch (error) {
    if (connection) connection.release();
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req, res) => {
  let connection;
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    connection = await pool.getConnection();

    const [users] = await connection.execute(
      "SELECT u.id, u.email, u.password_hash, u.status, u.email_verified, d.name, d.phone, d.role, d.join_date, d.email_opt_in, d.instructor_number FROM users u LEFT JOIN user_details d ON d.user_id = u.id WHERE u.email = ?",
      [email.trim()]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = users[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Account is inactive" });
    }

    if (!user.email_verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in. Check your inbox for a verification link.",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      joinDate: user.join_date,
      emailOptIn: Boolean(user.email_opt_in),
      emailVerified: Boolean(user.email_verified),
      instructorNumber: user.instructor_number ?? null,
    };

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    if (connection) connection.release();
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const connection = await pool.getConnection();
    const [users] = await connection.execute(
      "SELECT u.id, u.email, d.name FROM users u LEFT JOIN user_details d ON d.user_id = u.id WHERE u.email = ? AND u.status = 'active'",
      [email.trim()]
    );
    connection.release();

    if (users.length === 0) {
      return res.json({
        message: "If an account exists with that email, you will receive a password reset link shortly.",
      });
    }

    const user = users[0];
    const token = generateResetToken();
    await storeResetToken(user.id, token);

    sendPasswordResetEmail(user.email, user.name, token).catch((err) => {
      console.error("Failed to send password reset email:", err);
    });

    res.json({
      message: "If an account exists with that email, you will receive a password reset link shortly.",
    });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({ message: "Error processing request" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !token.trim()) {
      return res.status(400).json({ message: "Reset token is required" });
    }
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
    }
    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
    }
    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least one number" });
    }

    const userId = await verifyResetToken(token.trim());
    if (!userId) {
      return res.status(400).json({ message: "Invalid or expired reset link. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const connection = await pool.getConnection();
    await connection.execute("UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
      hashedPassword,
      userId,
    ]);
    connection.release();

    await deleteResetToken(token.trim());

    res.json({ message: "Password has been reset successfully. You can now log in with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};
