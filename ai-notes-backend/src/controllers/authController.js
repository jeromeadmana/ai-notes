import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashed]);
    res.json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });

    console.log("🔑 Plain password from request:", password);
    console.log("🔒 Hashed password from DB:", user.password);

    const hashedPayload = await bcrypt.hash(password, 10);
    console.log("🔒 Payload password (bcrypt hash):", hashedPayload);

    const match = await bcrypt.compare(password, user.password);
    console.log("✅ Password match result:", match);

    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error("❌ Error in loginUser:", err);
    res.status(500).json({ error: err.message });
  }
};

