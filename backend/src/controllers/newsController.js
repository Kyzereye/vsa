import pool from "../config/database.js";

function formatNews(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    publishedDate: row.published_date ? row.published_date.toISOString().slice(0, 10) : null,
  };
}

export const getNews = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, title, description, published_date FROM news ORDER BY published_date DESC, id DESC"
    );
    connection.release();

    res.json(rows.map(formatNews));
  } catch (error) {
    if (connection) connection.release();
    console.error("Get news error:", error);
    res.status(500).json({ message: "Error fetching news" });
  }
};

export const getNewsById = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, title, description, published_date FROM news WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: "News item not found" });
    }

    res.json(formatNews(rows[0]));
  } catch (error) {
    if (connection) connection.release();
    console.error("Get news error:", error);
    res.status(500).json({ message: "Error fetching news" });
  }
};

export const createNews = async (req, res) => {
  let connection;
  try {
    const { title, description, publishedDate } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    connection = await pool.getConnection();
    const [result] = await connection.execute(
      "INSERT INTO news (title, description, published_date) VALUES (?, ?, ?)",
      [title, description, publishedDate || null]
    );
    const [rows] = await connection.execute(
      "SELECT id, title, description, published_date FROM news WHERE id = ?",
      [result.insertId]
    );
    connection.release();

    res.status(201).json({ message: "News item created successfully", news: formatNews(rows[0]) });
  } catch (error) {
    if (connection) connection.release();
    console.error("Create news error:", error);
    res.status(500).json({ message: "Error creating news" });
  }
};

export const updateNews = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { title, description, publishedDate } = req.body;

    connection = await pool.getConnection();
    const [existing] = await connection.execute("SELECT id FROM news WHERE id = ?", [id]);
    if (existing.length === 0) {
      connection.release();
      return res.status(404).json({ message: "News item not found" });
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
    if (publishedDate !== undefined) {
      updates.push("published_date = ?");
      values.push(publishedDate || null);
    }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    await connection.execute(`UPDATE news SET ${updates.join(", ")} WHERE id = ?`, values);
    const [rows] = await connection.execute(
      "SELECT id, title, description, published_date FROM news WHERE id = ?",
      [id]
    );
    connection.release();

    res.json({ message: "News item updated successfully", news: formatNews(rows[0]) });
  } catch (error) {
    if (connection) connection.release();
    console.error("Update news error:", error);
    res.status(500).json({ message: "Error updating news" });
  }
};

export const deleteNews = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    connection = await pool.getConnection();
    const [result] = await connection.execute("DELETE FROM news WHERE id = ?", [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "News item not found" });
    }

    res.json({ message: "News item deleted successfully" });
  } catch (error) {
    if (connection) connection.release();
    console.error("Delete news error:", error);
    res.status(500).json({ message: "Error deleting news" });
  }
};
