// api/migrate.js
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    await pool.query(`
      create table if not exists page_configs (
        key text primary key,
        value jsonb not null,
        updated_at timestamptz not null default now()
      );
    `);

    const ensure = async (k, v) => {
      await pool.query(
        `insert into page_configs(key, value) values ($1, $2)
         on conflict (key) do nothing`,
        [k, v]
      );
    };

    await ensure('home', {
      hero: {
        titulo: 'Bem-vindo à Plataforma do Vini',
        subtitulo: 'Sua central de informações',
        descricao: 'Acesse produtos, preços e agentes IA.',
        corFundo: '#663399',
        imagemFundo: ''
      },
      atualizacoes: { titulo: 'Atualizações Recentes', mostrar: true, itens: [] },
      produtos: { titulo: 'Produtos Disponíveis', subtitulo: 'Sincronizados com o banco', layoutCards: 'grid', mostrarContadores: true },
      cardsPersonalizados: []
    });

    await ensure('produtos', []);

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
