import { neon } from '@neondatabase/serverless';
if (!process.env.POSTGRES_URL) { throw new Error('Missing POSTGRES_URL'); }
export const sql = neon(process.env.POSTGRES_URL);
export async function ensureSchema() {
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`;
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      price NUMERIC,
      active BOOLEAN DEFAULT TRUE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;
  await sql`
    CREATE TABLE IF NOT EXISTS price_tables (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id UUID REFERENCES products(id) ON DELETE CASCADE,
      plan TEXT NOT NULL,
      monthly NUMERIC, annual NUMERIC, notes TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;
  await sql`
    CREATE TABLE IF NOT EXISTS page_configs (
      key TEXT PRIMARY KEY, value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`;
}
