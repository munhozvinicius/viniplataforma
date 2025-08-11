// api/config/[key].js
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: 'key obrigatória' });

  try {
    if (req.method === 'GET') {
      const r = await pool.query(`select value from page_configs where key=$1`, [key]);
      if (!r.rows.length) return res.status(404).json({ error: 'não encontrado' });
      return res.status(200).json({ key, value: r.rows[0].value });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
      if (!('value' in body)) return res.status(400).json({ error: 'corpo deve ter { value }' });

      await pool.query(
        `insert into page_configs(key, value, updated_at)
         values ($1, $2, now())
         on conflict (key) do update set value=$2, updated_at=now()`,
        [key, body.value]
      );
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
