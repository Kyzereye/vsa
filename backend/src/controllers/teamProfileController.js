import pool from "../config/database.js";

const BOARD_POSITION_ORDER = [
  "President",
  "Vice President",
  "Financial Secretary",
  "Board Member",
  "Advisor to the Board",
];

function formatTeamProfile(row) {
  return {
    id: row.id,
    name: row.name,
    bio: row.bio ?? null,
    imageUrl: row.image_url ?? null,
    displayOrder: row.display_order,
    boardPosition: row.board_position ?? null,
    isInstructor: Boolean(row.is_instructor),
    isBoardMember: Boolean(row.is_board_member),
  };
}

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

export const getBoardMembers = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT id, name, image_url, display_order, board_position
       FROM team_profiles
       WHERE is_board_member = 1
       ORDER BY FIELD(board_position, ?, ?, ?, ?, ?), display_order ASC, id ASC`,
      BOARD_POSITION_ORDER
    );
    connection.release();

    res.json(
      rows.map((row) => ({
        id: row.id,
        name: row.name,
        imageUrl: row.image_url ?? null,
        displayOrder: row.display_order,
        boardPosition: row.board_position ?? null,
      }))
    );
  } catch (error) {
    if (connection) connection.release();
    console.error("Get board members error:", error);
    res.status(500).json({ message: "Error fetching board members" });
  }
};

export const createTeamProfile = async (req, res) => {
  let connection;
  try {
    const { name, boardPosition, imageUrl, displayOrder } = req.body;
    if (!name || !boardPosition) {
      return res.status(400).json({ message: "Name and board position are required" });
    }
    if (!BOARD_POSITION_ORDER.includes(boardPosition)) {
      return res.status(400).json({ message: "Invalid board position" });
    }

    connection = await pool.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO team_profiles (name, board_position, image_url, display_order, is_board_member)
       VALUES (?, ?, ?, ?, 1)`,
      [name.trim(), boardPosition, imageUrl && String(imageUrl).trim() || null, Number(displayOrder) || 0]
    );
    const id = result.insertId;
    const [rows] = await connection.execute(
      "SELECT id, name, image_url, display_order, board_position, is_board_member FROM team_profiles WHERE id = ?",
      [id]
    );
    connection.release();

    res.status(201).json(formatTeamProfile(rows[0]));
  } catch (error) {
    if (connection) connection.release();
    console.error("Create team profile error:", error);
    res.status(500).json({ message: "Error creating team profile" });
  }
};

export const updateTeamProfile = async (req, res) => {
  let connection;
  try {
    const { id } = req.params;
    const { name, boardPosition, imageUrl, displayOrder, isBoardMember } = req.body;

    connection = await pool.getConnection();
    const updates = [];
    const values = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name.trim());
    }
    if (boardPosition !== undefined) {
      if (boardPosition !== null && boardPosition !== "" && !BOARD_POSITION_ORDER.includes(boardPosition)) {
        connection.release();
        return res.status(400).json({ message: "Invalid board position" });
      }
      updates.push("board_position = ?");
      values.push(boardPosition === null || boardPosition === "" ? null : boardPosition);
    }
    if (imageUrl !== undefined) {
      updates.push("image_url = ?");
      values.push(imageUrl && String(imageUrl).trim() ? String(imageUrl).trim() : null);
    }
    if (displayOrder !== undefined) {
      updates.push("display_order = ?");
      values.push(Number(displayOrder) || 0);
    }
    if (isBoardMember !== undefined) {
      updates.push("is_board_member = ?");
      values.push(isBoardMember ? 1 : 0);
      if (!isBoardMember) {
        updates.push("board_position = NULL");
      }
    }

    if (updates.length === 0) {
      connection.release();
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    await connection.execute(
      `UPDATE team_profiles SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    const [rows] = await connection.execute(
      "SELECT id, name, bio, image_url, display_order, board_position, is_instructor, is_board_member FROM team_profiles WHERE id = ?",
      [id]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: "Team profile not found" });
    }
    res.json(formatTeamProfile(rows[0]));
  } catch (error) {
    if (connection) connection.release();
    console.error("Update team profile error:", error);
    res.status(500).json({ message: "Error updating team profile" });
  }
};
