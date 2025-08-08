// api/diag.js
export default async function handler(req, res) {
  const out = { ok: true, node: process.version, hasEnv: !!process.env.POSTGRES_URL };

  try {
    const mod = await import('@neondatabase/serverless');
    out.neonImported = true;

    if (process.env.POSTGRES_URL) {
      const sql = mod.neon(process.env.POSTGRES_URL);
      const rows = await sql`select 1 as ok`;
      out.dbPing = rows?.[0]?.ok === 1;
    }
  } catch (e) {
    out.error = String(e && e.message ? e.message : e);
    out.stack = e?.stack;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(out, null, 2));
}
