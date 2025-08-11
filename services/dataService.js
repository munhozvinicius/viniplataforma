// src/services/dataService.js
export const DataService = {
  async getConfig(key) {
    const r = await fetch(`/api/config/${encodeURIComponent(key)}`);
    if (!r.ok) throw new Error(`getConfig(${key}) ${r.status}`);
    return r.json();
  },

  async setConfig(key, value) {
    const r = await fetch(`/api/config/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });
    if (!r.ok) {
      const t = await r.text().catch(()=> '');
      throw new Error(`setConfig(${key}) ${r.status} ${t}`);
    }
    return r.json();
  }
};
