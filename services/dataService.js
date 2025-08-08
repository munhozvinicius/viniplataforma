// src/services/dataService.js
export const DataService = {
  async getConfig(key) {
    const r = await fetch(`/api/configs?key=${encodeURIComponent(key)}`);
    if (!r.ok) throw new Error('GET config failed');
    return r.json();
  },
  async setConfig(key, value) {
    const r = await fetch(`/api/configs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (!r.ok) throw new Error('POST config failed');
    return r.json();
  },
  async getProdutos() {
    const res = await this.getConfig('produtos');
    return Array.isArray(res?.value) ? res.value : [];
  },
  async salvarProdutos(lista) {
    const safe = (lista || []).map(p => ({
      id: p.id || (globalThis.crypto?.randomUUID?.() ?? String(Date.now()+Math.random())),
      emoji: p.emoji || '🧩',
      titulo: p.titulo || '',
      subtitulo: p.subtitulo || '',
      caracteristicas: p.caracteristicas || '',
      tabelas: Array.isArray(p.tabelas) ? p.tabelas : [],
      observacoes: p.observacoes || '',
      agentesIA: Array.isArray(p.agentesIA) ? p.agentesIA : []
    }));
    return this.setConfig('produtos', safe);
  },
  async getHome() {
    const res = await this.getConfig('home');
    return res?.value || {};
  },
  async salvarHome(config) {
    return this.setConfig('home', config || {});
  }
};
