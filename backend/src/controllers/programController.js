import pool from "../config/database.js";

function formatProgram(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    link: row.link || undefined,
    url: row.url || undefined,
  };
}

export const getPrograms = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, title, description, link, url FROM programs ORDER BY id"
    );
    connection.release();

    res.json(rows.map(formatProgram));
  } catch (error) {
    if (connection) connection.release();
    console.error("Get programs error:", error);
    res.status(500).json({ message: "Error fetching programs" });
  }
};

export const getProgramById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, title, description, link, url FROM programs WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(formatProgram(rows[0]));
  } catch (error) {
    if (connection) connection.release();
    console.error("Get program error:", error);
    res.status(500).json({ message: "Error fetching program" });
  }
};

export const createProgram = async (req, res) => {
  let connection;
  try {
    const { id, title, description, link, url } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const programId = id || `program-${Date.now()}`;

    connection = await pool.getConnection();
    await connection.execute(
      "INSERT INTO programs (id, title, description, link, url) VALUES (?, ?, ?, ?, ?)",
      [programId, title, description, link || null, url || null]
    );
    const [rows] = await connection.execute(
      "SELECT id, title, description, link, url FROM programs WHERE id = ?",
      [programId]
    );
    connection.release();

    res.status(201).json({ message: "Program created successfully", program: formatProgram(rows[0]) });
  } catch (error) {
    if (connection) connection.release();
    console.error("Create program error:", error);
    res.status(500).json({ message: "Error creating program" });
  }
};

export const updateProgram = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { title, description, link, url } = req.body;

    connection = await pool.getConnection();
    const [existing] = await connection.execute("SELECT id FROM programs WHERE id = ?", [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Program not found" });
    }

    const updates = [];
    const values = [];
    if (title !== undefined) {
      updates.push("title = ?");
      values.push(title);
    }
    if (description !== undefined) {
      updates.push("description = ?");
      values.push(description);
    }
    if (link !== undefined) {
      updates.push("link = ?");
      values.push(link || null);
    }
    if (url !== undefined) {
      updates.push("url = ?");
      values.push(url || null);
    }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    await connection.execute(`UPDATE programs SET ${updates.join(", ")} WHERE id = ?`, values);
    const [rows] = await connection.execute(
      "SELECT id, title, description, link, url FROM programs WHERE id = ?",
      [id]
    );
    connection.release();

    res.json({ message: "Program updated successfully", program: formatProgram(rows[0]) });
  } catch (error) {
    if (connection) connection.release();
    console.error("Update program error:", error);
    res.status(500).json({ message: "Error updating program" });
  }
};

export const deleteProgram = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    const [result] = await connection.execute("DELETE FROM programs WHERE id = ?", [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json({ message: "Program deleted successfully" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Delete program error:", error);
    res.status(500).json({ message: "Error deleting program" });
  }
};
