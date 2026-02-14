import pool from "../config/database.js";
import { sendRegistrationConfirmationEmail } from "../services/emailService.js";
import { normalizePhoneToDigits } from "../utils/phone.js";

/** Create a new event registration (public; if authenticated, links to user for "My RSVPs"). */
export const createRegistration = async (req, res) => {
  let connection;
  try {
    const { eventId, name, email, phone, message } = req.body;
    const userId = req.user?.id ?? null;

    if (!eventId || !name || !email) {
      return res.status(400).json({ message: "Event ID, name, and email are required" });
    }

    connection = await pool.getConnection();
    const [eventRows] = await connection.execute(
      "SELECT id, title, date, location, address FROM events WHERE id = ?",
      [eventId]
    );
    if (eventRows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Event not found" });
    }
    const event = {
      title: eventRows[0].title,
      date: eventRows[0].date,
      location: eventRows[0].location,
      address: eventRows[0].address ?? null,
    };

    const trimmedEmail = email.trim();

    if (userId) {
      const [existingByUser] = await connection.execute(
        "SELECT 1 FROM event_registrations WHERE event_id = ? AND user_id = ? LIMIT 1",
        [eventId, userId]
      );
      if (existingByUser.length > 0) {
        connection.release();
        sendRegistrationConfirmationEmail(trimmedEmail, name, event).catch((emailErr) => {
          console.error("Resend confirmation email failed:", emailErr);
        });
        return res.status(200).json({
          message: "You're already signed up for this event. We've sent another confirmation email to your address.",
          alreadyRegistered: true,
        });
      }
    } else {
      const [existingByEmail] = await connection.execute(
        "SELECT 1 FROM event_registrations WHERE event_id = ? AND LOWER(TRIM(email)) = LOWER(?) LIMIT 1",
        [eventId, trimmedEmail]
      );
      if (existingByEmail.length > 0) {
        connection.release();
        sendRegistrationConfirmationEmail(trimmedEmail, name, event).catch((emailErr) => {
          console.error("Resend confirmation email failed:", emailErr);
        });
        return res.status(200).json({
          message: "You're already signed up for this event. We've sent another confirmation email to your address.",
          alreadyRegistered: true,
        });
      }
    }

    const phoneDigits = normalizePhoneToDigits(phone);
    await connection.execute(
      `INSERT INTO event_registrations (event_id, user_id, name, email, phone, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [eventId, userId, name, trimmedEmail, phoneDigits, message?.trim() || null]
    );
    connection.release();

    sendRegistrationConfirmationEmail(trimmedEmail, name, event).catch((emailErr) => {
      console.error("Registration saved but confirmation email failed:", emailErr);
    });

    res.status(201).json({ message: "Registration submitted successfully" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Create registration error:", error);
    res.status(500).json({ message: "Error submitting registration" });
  }
};

/** List current user's event registrations (member only). */
export const getMyRegistrations = async (req, res) => {
  let connection;
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT r.id, r.event_id, r.registration_date,
              e.title AS event_title, e.date AS event_date, e.slug AS event_slug, e.location AS event_location, e.address AS event_address
       FROM event_registrations r
       JOIN events e ON e.id = r.event_id
       WHERE r.user_id = ? OR (r.user_id IS NULL AND LOWER(TRIM(r.email)) = LOWER(?))
       ORDER BY e.date ASC, r.registration_date DESC`,
      [userId, userEmail]
    );
    connection.release();

    const registrations = rows.map((row) => ({
      id: row.id,
      eventId: row.event_id,
      eventTitle: row.event_title,
      eventDate: row.event_date,
      eventSlug: row.event_slug,
      eventLocation: row.event_location,
      eventAddress: row.event_address ?? null,
      registrationDate: row.registration_date,
    }));

    res.json(registrations);
  } catch (error) {
    if (connection) connection.release();
    console.error("Get my registrations error:", error);
    res.status(500).json({ message: "Error fetching your registrations" });
  }
};

/** Delete one of the current user's registrations (cancel RSVP). */
export const deleteRegistration = async (req, res) => {
  let connection;
  try {
    const registrationId = Number(req.params.id);
    const userId = req.user.id;
    const userEmail = req.user.email;
    if (!Number.isInteger(registrationId) || registrationId < 1) {
      return res.status(400).json({ message: "Invalid registration ID" });
    }

    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id FROM event_registrations WHERE id = ? AND (user_id = ? OR (user_id IS NULL AND LOWER(TRIM(email)) = LOWER(?)))",
      [registrationId, userId, userEmail]
    );
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Registration not found or you cannot cancel it" });
    }

    await connection.execute("DELETE FROM event_registrations WHERE id = ?", [registrationId]);
    connection.release();

    res.status(200).json({ message: "Registration cancelled" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Delete registration error:", error);
    res.status(500).json({ message: "Error cancelling registration" });
  }
};

/** List all event registrations with event info (admin only). */
export const getRegistrations = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT r.id, r.event_id, r.user_id, r.name, r.email, r.phone, r.message, r.registration_date,
              e.title AS event_title, e.date AS event_date, e.slug AS event_slug
       FROM event_registrations r
       JOIN events e ON e.id = r.event_id
       ORDER BY r.registration_date DESC`
    );
    connection.release();

    const registrations = rows.map((row) => ({
      id: row.id,
      eventId: row.event_id,
      eventTitle: row.event_title,
      eventDate: row.event_date,
      eventSlug: row.event_slug,
      userId: row.user_id,
      name: row.name,
      email: row.email,
      phone: row.phone || null,
      message: row.message || null,
      registrationDate: row.registration_date,
    }));

    res.json(registrations);
  } catch (error) {
    if (connection) connection.release();
    console.error("Get registrations error:", error);
    res.status(500).json({ message: "Error fetching registrations" });
  }
};
