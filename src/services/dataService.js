async function jsonFetch(url, options = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export const DataService = {
  listProducts: () => jsonFetch('/api/products'),
  createProduct: (payload) => jsonFetch('/api/products', { method: 'POST', body: JSON.stringify(payload) }),
  getProduct: (id) => jsonFetch(`/api/products/${id}`),
  updateProduct: (id, payload) => jsonFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduct: (id) => jsonFetch(`/api/products/${id}`, { method: 'DELETE' }),
  listPriceTables: () => jsonFetch('/api/price-tables'),
  createPriceTable: (payload) => jsonFetch('/api/price-tables', { method: 'POST', body: JSON.stringify(payload) }),
  getPriceTable: (id) => jsonFetch(`/api/price-tables/${id}`),
  updatePriceTable: (id, payload) => jsonFetch(`/api/price-tables/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePriceTable: (id) => jsonFetch(`/api/price-tables/${id}`, { method: 'DELETE' }),
  getConfig: (key='home') => jsonFetch(`/api/configs?key=${encodeURIComponent(key)}`),
  setConfig: (key, value) => jsonFetch(`/api/configs?key=${encodeURIComponent(key)}`, { method: 'PUT', body: JSON.stringify({ value }) }),
};
