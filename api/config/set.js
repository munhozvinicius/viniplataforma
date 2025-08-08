// /api/config/set.js
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
});

export const config = {
  api: { bodyParser: { sizeLimit: '2mb' } }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const { key, value } = req.body || {};
    if (!key) return res.status(400).json({ ok: false, error: 'Missing key' });

    const safeValue = (value === undefined) ? null : value;

    await pool.query(
      `INSERT INTO page_configs (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [key, safeValue]
    );

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('POST /api/config/set error', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}