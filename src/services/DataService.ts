// Substitui integrações antigas com GitHub.
type Json = any;

async function getConfig(key: string): Promise<Json | null> {
  const r = await fetch(`/api/configs?key=${encodeURIComponent(key)}`);
  if (!r.ok) throw new Error(`GET /api/configs falhou: ${r.status}`);
  return r.json();
}

async function saveConfig(key: string, value: Json): Promise<void> {
  const r = await fetch('/api/configs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value }),
  });
  if (!r.ok) throw new Error(await r.text());
}

export async function getHome(): Promise<Json> {
  const v = await getConfig('home');
  return v ?? { hero: { titulo: 'Bem-vindo', subtitulo: '', descricao: '' }, cards: [], produtos: { titulo: 'Produtos' } };
}

export async function saveHome(value: Json): Promise<void> {
  await saveConfig('home', value);
}

export async function getProdutos(): Promise<Json> {
  const v = await getConfig('produtos');
  return v ?? { items: [] };
}

export async function saveProdutos(value: Json): Promise<void> {
  await saveConfig('produtos', value);
}
