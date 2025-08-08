// src/services/dataService.js
export const DataService = {
  async getConfig(key) {
    try {
      const r = await fetch(`/api/config/get?key=${encodeURIComponent(key)}`);
      return await r.json();
    } catch (e) {
      console.error('DataService.getConfig error', e);
      return { ok: false, value: null };
    }
  },

  async setConfig(key, value) {
    try {
      const r = await fetch('/api/config/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      return await r.json();
    } catch (e) {
      console.error('DataService.setConfig error', e);
      return { ok: false };
    }
  }
};