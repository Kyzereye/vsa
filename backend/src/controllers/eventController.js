import pool from "../config/database.js";

const MONTH_NAMES = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

/** Parse date string (ISO YYYY-MM-DD or legacy "Sat, Jan 31") to a sortable Date. */
function parseEventDate(dateStr) {
  if (!dateStr) return new Date(0);
  if (typeof dateStr === "object" && dateStr instanceof Date) return dateStr;
  const s = String(dateStr).trim();
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
  }
  const part = s.split(", ")[1];
  if (!part) return new Date(0);
  const [mon, day] = part.trim().split(/\s+/);
  const month = MONTH_NAMES[mon] ?? 0;
  const dayNum = parseInt(day, 10) || 1;
  return new Date(2000, month, dayNum);
}

/** Create a URL-safe slug from a string; append suffix to ensure uniqueness. */
function slugify(text, suffix) {
  const base = String(text || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base ? `${base}-${suffix}` : String(suffix);
}

/** Format row.date (Date or string) to ISO date string YYYY-MM-DD for API/frontend. */
function formatDateValue(val) {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  const s = String(val).trim();
  const isoMatch = s.match(/^\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];
  return s;
}

function formatEvent(row) {
  return {
    id: row.id,
    date: formatDateValue(row.date),
    title: row.title,
    location: row.location,
    address: row.address ?? null,
    slug: row.slug,
    eventType: row.event_type,
    canceled: Boolean(row.canceled),
    dateChanged: Boolean(row.date_changed),
    locationChanged: Boolean(row.location_changed),
  };
}

export const getEvents = async (req, res) => {
  let connection;
  try {
    const { event_type: eventType, time } = req.query;
    connection = await pool.getConnection();

    const eventCols = "id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed";
    let sql = `SELECT ${eventCols} FROM events`;
    const params = [];
    const conditions = [];

    if (eventType === "vsa" || eventType === "vsaNY") {
      conditions.push("event_type IN ('vsaNY', 'shredvets')");
    } else if (eventType === "vsaPA") {
      conditions.push("event_type = 'vsaPA'");
    } else if (eventType === "shredvets") {
      conditions.push("event_type = ?");
      params.push(eventType);
    } else if (eventType === "trainingNY" || eventType === "training") {
      conditions.push("event_type = 'trainingNY'");
    } else if (eventType === "orgNY" || eventType === "org") {
      conditions.push("event_type = 'orgNY'");
    } else if (["trainingPA", "orgPA"].includes(eventType)) {
      conditions.push("event_type = ?");
      params.push(eventType);
    }

    if (time === "past") {
      conditions.push("DATE(date) < CURDATE()");
    } else if (time === "upcoming") {
      conditions.push("DATE(date) >= CURDATE()");
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    const [rows] = await connection.execute(sql, params);
    connection.release();

    const events = rows.map(formatEvent);
    const asc = (a, b) => parseEventDate(a.date) - parseEventDate(b.date);
    const desc = (a, b) => parseEventDate(b.date) - parseEventDate(a.date);
    events.sort(time === "past" ? desc : asc);
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
      "SELECT id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed FROM events WHERE id = ?",
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
      "SELECT id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed FROM events WHERE slug = ?",
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
    const { date, title, location, address, slug, eventType, canceled, dateChanged, locationChanged } = req.body;

    if (!date || !title || !location) {
      return res.status(400).json({ message: "Date, title, and location are required" });
    }

    const allowed = ["vsaNY", "vsaPA", "shredvets", "org", "training"];
    const event_type = allowed.includes(eventType) ? eventType : "vsaNY";
    const dateVal = String(date).trim().match(/^\d{4}-\d{2}-\d{2}/) ? `${date.replace(/T.*$/, "")} 00:00:00` : date;

    connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO events (date, title, location, address, slug, event_type, canceled, date_changed, location_changed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dateVal,
        title,
        location,
        address || null,
        slug && String(slug).trim() ? String(slug).trim() : null,
        event_type,
        canceled ? 1 : 0,
        dateChanged ? 1 : 0,
        locationChanged ? 1 : 0,
      ]
    );
    const insertId = result.insertId;
    const finalSlug = slug && String(slug).trim() ? String(slug).trim() : slugify(title, insertId);
    if (!slug || !String(slug).trim()) {
      await connection.execute("UPDATE events SET slug = ? WHERE id = ?", [finalSlug, insertId]);
    }
    const [rows] = await connection.execute(
      "SELECT id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed FROM events WHERE id = ?",
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
      const allowed = ["vsaNY", "vsaPA", "shredvets", "trainingNY", "trainingPA", "orgNY", "orgPA"];
      updates.push("event_type = ?");
      values.push(allowed.includes(eventType) ? eventType : "vsaNY");
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

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    await connection.execute(`UPDATE events SET ${updates.join(", ")} WHERE id = ?`, values);

    const [rows] = await connection.execute(
      "SELECT id, date, title, location, address, slug, event_type, canceled, date_changed, location_changed FROM events WHERE id = ?",
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
