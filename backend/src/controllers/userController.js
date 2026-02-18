import pool from "../config/database.js";
import { normalizePhoneToDigits } from "../utils/phone.js";
import bcrypt from "bcryptjs";
import { sendEmailChangeVerificationEmail } from "../services/emailService.js";
import {
  generateVerificationToken,
  storeVerificationToken,
} from "../models/emailVerificationModel.js";

function formatUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    status: row.status,
    joinDate: row.join_date,
    emailOptIn: Boolean(row.email_opt_in),
    emailVerified: Boolean(row.email_verified),
    instructorNumber: row.instructor_number ?? null,
  };
}

export const getUsers = async (req, res) => {
  let connection;
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT u.id, u.email, u.status, u.email_verified, d.name, d.phone, d.role, d.join_date, d.email_opt_in, d.instructor_number FROM users u LEFT JOIN user_details d ON d.user_id = u.id"
    );
    connection.release();

    res.json(rows.map(formatUser));
  } catch (error) {
    if (connection) connection.release();
    console.error("Get users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUserById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT u.id, u.email, u.status, u.email_verified, d.name, d.phone, d.role, d.join_date, d.email_opt_in, d.instructor_number FROM users u LEFT JOIN user_details d ON d.user_id = u.id WHERE u.id = ?",
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(formatUser(rows[0]));
  } catch (error) {
    if (connection) connection.release();
    console.error("Get user by ID error:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateUser = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    connection = await pool.getConnection();

    const [existing] = await connection.execute(
      "SELECT u.id, u.email, d.name FROM users u LEFT JOIN user_details d ON d.user_id = u.id WHERE u.id = ?",
      [id]
    );
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: "User not found" });
    }

    const current = existing[0];
    const { name, email, phone, role, status, password, emailOptIn, instructorNumber } = req.body;

    const instructorNumberRegex = /^[A-Za-z0-9]{9,10}$/;
    if (instructorNumber !== undefined && instructorNumber !== null && instructorNumber !== "") {
      const val = String(instructorNumber).trim();
      if (val && !instructorNumberRegex.test(val)) {
        connection.release();
        return res.status(400).json({ message: "NRA Instructor Number must be 9–10 alphanumeric characters" });
      }
    }

    const userUpdates = [];
    const userValues = [];
    const detailUpdates = [];
    const detailValues = [];
    let emailChanged = false;

    if (email !== undefined && email.trim() !== current.email) {
      emailChanged = true;
    } else if (email !== undefined) {
      userUpdates.push("email = ?");
      userValues.push(email.trim());
    }

    if (status !== undefined && req.user.role === "admin") {
      userUpdates.push("status = ?");
      userValues.push(status);
    }

    if (password) {
      userUpdates.push("password_hash = ?");
      userValues.push(await bcrypt.hash(password, 10));
    }

    if (name !== undefined) {
      detailUpdates.push("name = ?");
      detailValues.push(name.trim());
    }
    if (phone !== undefined) {
      detailUpdates.push("phone = ?");
      detailValues.push(normalizePhoneToDigits(phone));
    }
    if (emailOptIn !== undefined) {
      detailUpdates.push("email_opt_in = ?");
      detailValues.push(emailOptIn ? 1 : 0);
    }
    if (role !== undefined && req.user.role === "admin") {
      detailUpdates.push("role = ?");
      detailValues.push(role);
    }
    if (instructorNumber !== undefined && (req.user.role === "admin" || (req.user.id === parseInt(id) && req.user.role === "instructor"))) {
      detailUpdates.push("instructor_number = ?");
      detailValues.push(instructorNumber === null || instructorNumber === "" ? null : String(instructorNumber).trim());
    }

    if (emailChanged) {
      const verificationToken = generateVerificationToken();
      await storeVerificationToken(id, email.trim(), verificationToken, true);
      try {
        await sendEmailChangeVerificationEmail(email.trim(), (name ?? current.name) || "", verificationToken);
      } catch (err) {
        console.error("Failed to send email change verification:", err);
        connection.release();
        return res.status(500).json({ message: "Failed to send verification email. Please try again." });
      }
      connection.release();
      return res.json({
        message: "Email change requested. Please check your new email for verification instructions.",
        emailChangePending: true,
      });
    }

    if (userUpdates.length === 0 && detailUpdates.length === 0) {
      connection.release();
      return res.status(400).json({ message: "No fields to update" });
    }

    if (userUpdates.length > 0) {
      userUpdates.push("updated_at = CURRENT_TIMESTAMP");
      userValues.push(id);
      await connection.execute(`UPDATE users SET ${userUpdates.join(", ")} WHERE id = ?`, userValues);
    }

    if (detailUpdates.length > 0) {
      detailUpdates.push("updated_at = CURRENT_TIMESTAMP");
      detailValues.push(id);
      await connection.execute(`UPDATE user_details SET ${detailUpdates.join(", ")} WHERE user_id = ?`, detailValues);
    }

    const [rows] = await connection.execute(
      "SELECT u.id, u.email, u.status, u.email_verified, d.name, d.phone, d.role, d.join_date, d.email_opt_in, d.instructor_number FROM users u LEFT JOIN user_details d ON d.user_id = u.id WHERE u.id = ?",
      [id]
    );
    connection.release();

    res.json({ message: "User updated successfully", user: formatUser(rows[0]) });
  } catch (error) {
    if (connection) connection.release();
    console.error("Update user error:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;

    // Users can delete their own account, or admins can delete any account
    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    connection = await pool.getConnection();

    // Check if user exists
    const [existingUsers] = await connection.execute("SELECT id FROM users WHERE id = ?", [id]);
    if (existingUsers.length === 0) {
      connection.release();
      return res.status(404).json({ message: "User not found" });
    }

    await connection.execute("DELETE FROM users WHERE id = ?", [id]);
    connection.release();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const resetPassword = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Users can only reset their own password
    if (req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "Access denied" });
    }

    connection = await pool.getConnection();

    // Get user with password
    const [users] = await connection.execute(
      "SELECT id, password_hash FROM users WHERE id = ?",
      [id]
    );

    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      connection.release();
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await connection.execute(
      "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, id]
    );
    connection.release();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Error resetting password" });
  }
};
