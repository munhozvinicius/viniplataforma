// api/migrate.js
import { sql } from './lib/db.js';
export default async function handler(req, res) {
  try {
    await sql`CREATE TABLE IF NOT EXISTS page_configs (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL DEFAULT '{}'::jsonb,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );`;
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
}
