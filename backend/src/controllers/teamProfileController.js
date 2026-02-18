import pool from "../config/database.js";

export const getInstructors = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      "SELECT id, name, bio, image_url, display_order FROM team_profiles WHERE is_instructor = 1 ORDER BY display_order ASC, id ASC"
    );
    connection.release();

    const instructors = rows.map((row) => ({
      id: row.id,
      name: row.name,
      bio: row.bio ?? null,
      imageUrl: row.image_url ?? null,
      displayOrder: row.display_order,
    }));

    res.json(instructors);
  } catch (error) {
    if (connection) connection.release();
    console.error("Get instructors error:", error);
    res.status(500).json({ message: "Error fetching instructors" });
  }
};
