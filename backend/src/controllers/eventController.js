import pool from "../config/database.js";

const MONTH_NAMES = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

/** Parse display date string like "Sat, Jan 31" to a sortable Date (same year for comparison). */
function parseEventDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return new Date(0);
  const part = dateStr.split(", ")[1];
  if (!part) return new Date(0);
  const [mon, day] = part.trim().split(/\s+/);
  const month = MONTH_NAMES[mon] ?? 0;
  const dayNum = parseInt(day, 10) || 1;
  return new Date(2000, month, dayNum);
}

function formatEvent(row) {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    location: row.location,
    address: row.address ?? null,
    slug: row.slug,
    eventType: row.event_type,
    canceled: Boolean(row.canceled),
    dateChanged: Boolean(row.date_changed),
    locationChanged: Boolean(row.location_changed),
    originalDate: row.original_date,
    originalLocation: row.original_location,
    originalAddress: row.original_address ?? null,
  };
}

export const getEvents = async (req, res) => {
  let connection;
  try {
    const { event_type: eventType } = req.query;
    connection = await pool.getConnection();

    const eventCols = "id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed, original_date, original_location, original_address";
    let sql = `SELECT ${eventCols} FROM events`;
    const params = [];

    if (eventType === "vsa") {
      sql = `SELECT ${eventCols} FROM events WHERE event_type IN ('vsa', 'shredvets')`;
    } else if (eventType === "shredvets") {
      sql = `SELECT ${eventCols} FROM events WHERE event_type = ?`;
      params.push(eventType);
    }

    const [rows] = await connection.execute(sql, params);
    connection.release();

    const events = rows.map(formatEvent);
    events.sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date));
    res.json(events);
  } catch (error) {
    if (connection) connection.release();
    console.error("Get events error:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
};

export const getEventById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();

    const [rows] = await connection.execute(
      "SELECT id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed, original_date, original_location, original_address FROM events WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(formatEvent(rows[0]));
  } catch (error) {
    if (connection) connection.release();
    console.error("Get event by ID error:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
};

export const getEventBySlug = async (req, res) => {
  let connection;
  try {
    const { slug } = req.params;
    connection = await pool.getConnection();

    const [eventRows] = await connection.execute(
      "SELECT id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed, original_date, original_location, original_address FROM events WHERE slug = ?",
      [slug]
    );

    if (eventRows.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Event not found" });
    }

    const event = formatEvent(eventRows[0]);

    const [detailRows] = await connection.execute(
      "SELECT slug, subtitle, details FROM event_details WHERE slug = ?",
      [slug]
    );
    connection.release();

    if (detailRows.length > 0) {
      const d = detailRows[0];
      const details = typeof d.details === "string" ? JSON.parse(d.details) : d.details;
      res.json({
        ...event,
        subtitle: d.subtitle,
        details: Array.isArray(details) ? details : [details],
      });
    } else {
      res.json(event);
    }
  } catch (error) {
    if (connection) connection.release();
    console.error("Get event by slug error:", error);
    res.status(500).json({ message: "Error fetching event" });
  }
};

export const createEvent = async (req, res) => {
  let connection;
  try {
    const { date, title, location, address, slug, eventType, canceled, dateChanged, locationChanged, originalDate, originalLocation, originalAddress } = req.body;

    if (!date || !title || !location) {
      return res.status(400).json({ message: "Date, title, and location are required" });
    }

    const event_type = eventType === "shredvets" ? "shredvets" : "vsa";

    connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO events (date, title, location, address, slug, event_type, canceled, date_changed, location_changed, original_date, original_location, original_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        date,
        title,
        location,
        address || null,
        slug || null,
        event_type,
        canceled ? 1 : 0,
        dateChanged ? 1 : 0,
        locationChanged ? 1 : 0,
        originalDate || null,
        originalLocation || null,
        originalAddress || null,
      ]
    );
    const insertId = result.insertId;
    const [rows] = await connection.execute(
      "SELECT id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed, original_date, original_location, original_address FROM events WHERE id = ?",
      [insertId]
    );
    connection.release();

    res.status(201).json({ message: "Event created successfully", event: formatEvent(rows[0]) });
  } catch (error) {
    if (connection) connection.release();
    console.error("Create event error:", error);
    res.status(500).json({ message: "Error creating event" });
  }
};

export const updateEvent = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { date, title, location, address, slug, eventType, canceled, dateChanged, locationChanged, originalDate, originalLocation, originalAddress } = req.body;

    connection = await pool.getConnection();
    const [existing] = await connection.execute("SELECT id FROM events WHERE id = ?", [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Event not found" });
    }

    const updates = [];
    const values = [];

    if (date !== undefined) {
      updates.push("date = ?");
      values.push(date);
    }
    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (location !== undefined) {
      updates.push("location = ?");
      values.push(location);
    }
    if (address !== undefined) {
      updates.push("address = ?");
      values.push(address || null);
    }
    if (slug !== undefined) {
      updates.push("slug = ?");
      values.push(slug || null);
    }
    if (eventType !== undefined) {
      updates.push("event_type = ?");
      values.push(eventType === "shredvets" ? "shredvets" : "vsa");
    }
    if (canceled !== undefined) {
      updates.push("canceled = ?");
      values.push(canceled ? 1 : 0);
    }
    if (dateChanged !== undefined) {
      updates.push("date_changed = ?");
      values.push(dateChanged ? 1 : 0);
    }
    if (locationChanged !== undefined) {
      updates.push("location_changed = ?");
      values.push(locationChanged ? 1 : 0);
    }
    if (originalDate !== undefined) {
      updates.push("original_date = ?");
      values.push(originalDate || null);
    }
    if (originalLocation !== undefined) {
      updates.push("original_location = ?");
      values.push(originalLocation || null);
    }
    if (originalAddress !== undefined) {
      updates.push("original_address = ?");
      values.push(originalAddress || null);
    }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    await connection.execute(`UPDATE events SET ${updates.join(", ")} WHERE id = ?`, values);

    const [rows] = await connection.execute(
      "SELECT id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed, original_date, original_location, original_address FROM events WHERE id = ?",
      [id]
    );
    connection.release();

    res.json({ message: "Event updated successfully", event: formatEvent(rows[0]) });
  } catch (error) {
    if (connection) connection.release();
    console.error("Update event error:", error);
    res.status(500).json({ message: "Error updating event" });
  }
};

export const deleteEvent = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();

    const [result] = await connection.execute("DELETE FROM events WHERE id = ?", [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
};
