// /api/config/get.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    const { key } = req.query;
    if (!key) return res.status(400).json({ ok: false, error: 'Missing key' });

    const { rows } = await pool.query(
      'SELECT value FROM page_configs WHERE key = $1 LIMIT 1',
      [key]
    );

    if (!rows.length) {
      return res.status(200).json({ ok: true, value: null });
    }

    return res.status(200).json({ ok: true, value: rows[0].value });
  } catch (err) {
    console.error('GET /api/config/get error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}