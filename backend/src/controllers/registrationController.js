import pool from "../config/database.js";

/** Create a new event registration (public - no auth required). */
export const createRegistration = async (req, res) => {
  let connection;
  try {
    const { eventId, name, email, phone, message } = req.body;
    const userId = null; // optional: link to user when logged in via optional auth middleware

    if (!eventId || !name || !email) {
      return res.status(400).json({ message: "Event ID, name, and email are required" });
    }

    connection = await pool.getConnection();
    const [eventRows] = await connection.execute("SELECT id FROM events WHERE id = ?", [eventId]);
    if (eventRows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Event not found" });
    }

    await connection.execute(
      `INSERT INTO event_registrations (event_id, user_id, name, email, phone, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [eventId, userId, name, email.trim(), phone?.trim() || null, message?.trim() || null]
    );
    connection.release();

    res.status(201).json({ message: "Registration submitted successfully" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Create registration error:", error);
    res.status(500).json({ message: "Error submitting registration" });
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
