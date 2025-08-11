// api/configs.js
import { sql } from './lib/db.js';
export default async function handler(req, res) {
  const { method, query } = req;
  if (method === 'GET') {
    const key = String(query.key || '').trim();
    if (!key) return res.status(400).json({ error: 'Missing key' });
    try {
      const rows = await sql`SELECT key, value FROM page_configs WHERE key = ${key}`;
      if (rows.length === 0) {
        await sql`INSERT INTO page_configs (key, value) VALUES (${key}, '{}'::jsonb) ON CONFLICT (key) DO NOTHING`;
        return res.status(200).json({ key, value: {} });
      }
      return res.status(200).json(rows[0]);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: String(e.message || e) });
    }
  }
  if (method === 'POST') {
    let body = req.body;
    try {
      if (typeof body === 'string') body = JSON.parse(body);
      const { key, value } = body || {};
      let jsonValue = value;
      if (typeof value === 'string') {
        try {
          jsonValue = JSON.parse(value);
        } catch (e) {
          // If it's a string but not valid JSON, keep it as is or handle as needed
          console.warn('Value is a string but not valid JSON, treating as plain text:', value);
        }
      }
      await sql`INSERT INTO page_configs (key, value) VALUES (${key}, ${JSON.stringify(jsonValue)}::jsonb)
                ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
      return res.status(200).json({ ok: true, key });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: String(e.message || e) });
    }
  }
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).end('Method Not Allowed');
}
