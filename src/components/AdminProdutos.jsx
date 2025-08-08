// src/components/AdminProdutos.jsx
import React, { useEffect, useState } from 'react';
import { DataService } from '@/services/dataService.js';

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({});

  useEffect(() => {
    DataService.getProdutos()
      .then(setProdutos)
      .catch(() => setProdutos([]));
  }, []);

  const salvarProdutos = async () => {
    try {
      await DataService.salvarProdutos(produtos);
      alert('Produtos salvos com sucesso.');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produtos.');
    }
  };

  const criarProduto = () => {
    const id = (globalThis.crypto?.randomUUID?.() ?? String(Date.now()+Math.random()));
    const lista = [
      ...produtos,
      { id, emoji: '🧩', titulo: '', subtitulo: '', caracteristicas: '', tabelas: [], observacoes: '', agentesIA: [], ...novoProduto }
    ];
    setProdutos(lista);
    DataService.salvarProdutos(lista).catch(() => {});
    setNovoProduto({});
  };

  const atualizarProduto = (id, patch) => {
    const lista = produtos.map(p => p.id === id ? { ...p, ...patch } : p);
    setProdutos(lista);
    DataService.salvarProdutos(lista).catch(() => {});
  };

  const salvarOrdem = (novaOrdem) => {
    const mapa = new Map(produtos.map(p => [p.id, p]));
    const lista = novaOrdem.map(id => mapa.get(id)).filter(Boolean);
    setProdutos(lista);
    DataService.salvarProdutos(lista).catch(() => {});
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Gerenciar Produtos</h1>

      <div className="border p-3 rounded bg-gray-50 space-x-2">
        <input
          placeholder="Título"
          value={novoProduto.titulo || ''}
          onChange={e => setNovoProduto({ ...novoProduto, titulo: e.target.value })}
          className="border p-1 mr-2"
        />
        <input
          placeholder="Subtítulo"
          value={novoProduto.subtitulo || ''}
          onChange={e => setNovoProduto({ ...novoProduto, subtitulo: e.target.value })}
          className="border p-1 mr-2"
        />
        <button
          onClick={criarProduto}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Criar e Publicar
        </button>
      </div>

      <div className="space-y-2">
        {produtos.map(p => (
          <div key={p.id} className="border p-3 rounded flex items-center gap-2">
            <input
              value={p.titulo}
              onChange={e => atualizarProduto(p.id, { titulo: e.target.value })}
              className="border p-1 flex-1"
            />
            <input
              value={p.subtitulo}
              onChange={e => atualizarProduto(p.id, { subtitulo: e.target.value })}
              className="border p-1 flex-1"
            />
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          onClick={salvarProdutos}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Salvar e Publicar
        </button>
      </div>
    </div>
  );
}
