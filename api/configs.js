// api/configs.js
import { sql, ensureSchema } from './_lib/db.js';
import { getJsonBody, send } from './_lib/util.js';

export default async function handler(req, res) {
  try {
    await ensureSchema();
    const url = new URL(req.url, `http://${req.headers.host}`);
    const key = url.searchParams.get('key') || 'home';

    if (req.method === 'GET') {
      const rows = await sql`SELECT value FROM page_configs WHERE key = ${key};`;
      const value = rows[0]?.value || {};
      return send(res, 200, { key, value });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = await getJsonBody(req);
      const value = body?.value ?? {};
      const rows = await sql`
        INSERT INTO page_configs (key, value)
        VALUES (${key}, ${value})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        RETURNING *;
      `;
      return send(res, 200, rows[0]);
    }

    res.setHeader('Allow', 'GET, POST, PUT');
    return send(res, 405, { error: 'Method Not Allowed' });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'Internal Error', detail: String(e) });
  }
}