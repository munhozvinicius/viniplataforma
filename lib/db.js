// api/lib/db.js
import { neon } from '@neondatabase/serverless';
const conn = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!conn) { console.warn('NEON_DATABASE_URL/POSTGRES_URL not set.'); }
export const sql = neon(conn);
