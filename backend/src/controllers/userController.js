import pool from "../config/database.js";
import { normalizePhoneToDigits } from "../utils/phone.js";
import bcrypt from "bcryptjs";
import { sendEmailChangeVerificationEmail } from "../services/emailService.js";
import {
  generateVerificationToken,
  storeVerificationToken,
} from "../models/emailVerificationModel.js";

export const getUsers = async (req, res) => {
  let connection;
  try {
    // Only admins can see all users
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    connection = await pool.getConnection();
    const [users] = await connection.execute(
      "SELECT id, name, email, phone, role, status, join_date, email_opt_in, email_verified FROM users"
    );
    connection.release();

    const usersFormatted = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      joinDate: user.join_date,
      emailOptIn: Boolean(user.email_opt_in),
      emailVerified: Boolean(user.email_verified),
    }));

    res.json(usersFormatted);
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

    // Users can only view their own profile unless they're admin
    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    connection = await pool.getConnection();
    const [users] = await connection.execute(
      "SELECT id, name, email, phone, role, status, join_date, email_opt_in, email_verified FROM users WHERE id = ?",
      [id]
    );
    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];
    const userFormatted = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      joinDate: user.join_date,
      emailOptIn: Boolean(user.email_opt_in),
      emailVerified: Boolean(user.email_verified),
    };

    res.json(userFormatted);
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

    // Users can only update their own profile unless they're admin
    if (req.user.id !== parseInt(id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    connection = await pool.getConnection();

    // Check if user exists and get current email
    const [existingUsers] = await connection.execute(
      "SELECT id, email, name FROM users WHERE id = ?",
      [id]
    );
    if (existingUsers.length === 0) {
      connection.release();
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = existingUsers[0];
    const { name, email, phone, role, status, password, emailOptIn } = req.body;

    // Build update query dynamically
    const updates = [];
    const values = [];
    let emailChanged = false;

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name.trim());
    }
    if (email !== undefined && email.trim() !== currentUser.email) {
      // Email is changing - need to verify new email
      emailChanged = true;
      // Don't update email yet - will be updated after verification
      // Store the new email in a pending state or send verification
    } else if (email !== undefined) {
      updates.push("email = ?");
      values.push(email.trim());
    }
    if (phone !== undefined) {
      updates.push("phone = ?");
      values.push(normalizePhoneToDigits(phone));
    }
    if (emailOptIn !== undefined) {
      updates.push("email_opt_in = ?");
      values.push(emailOptIn ? 1 : 0);
    }

    // Only admins can change role and status
    if (req.user.role === "admin") {
      if (role !== undefined) {
        updates.push("role = ?");
        values.push(role);
      }
      if (status !== undefined) {
        updates.push("status = ?");
        values.push(status);
      }
    }

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push("password_hash = ?");
      values.push(hashedPassword);
    }

    // Handle email change separately
    if (emailChanged) {
      // Generate verification token for new email
      const verificationToken = generateVerificationToken();
      await storeVerificationToken(id, email.trim(), verificationToken, true);

      // Send verification email to new address
      try {
        await sendEmailChangeVerificationEmail(
          email.trim(),
          name.trim() || currentUser.name,
          verificationToken
        );
      } catch (err) {
        console.error("Failed to send email change verification:", err);
        connection.release();
        return res.status(500).json({
          message: "Failed to send verification email. Please try again.",
        });
      }

      // Don't update email yet - wait for verification
      connection.release();
      return res.json({
        message: "Email change requested. Please check your new email for verification instructions.",
        emailChangePending: true,
      });
    }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ message: "No fields to update" });
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);

    await connection.execute(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    // Get updated user
    const [updatedUsers] = await connection.execute(
      "SELECT id, name, email, phone, role, status, join_date, email_opt_in, email_verified FROM users WHERE id = ?",
      [id]
    );
    connection.release();

    const user = updatedUsers[0];
    const userFormatted = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      joinDate: user.join_date,
      emailOptIn: Boolean(user.email_opt_in),
      emailVerified: Boolean(user.email_verified),
    };

    res.json({
      message: "User updated successfully",
      user: userFormatted,
    });
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
