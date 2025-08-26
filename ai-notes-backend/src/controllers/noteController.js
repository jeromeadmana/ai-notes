import { pool } from "../db.js";

export const getNotes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
      [req.userId, title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      "UPDATE notes SET title=$1, content=$2, updated_at=NOW() WHERE id=$3 AND user_id=$4 RETURNING *",
      [title, content, id, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM notes WHERE id=$1 AND user_id=$2", [id, req.userId]);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
