// src/components/AdminHome.jsx
import React, { useEffect, useState } from 'react';
import { DataService } from '@/services/dataService.js';

export default function AdminHome() {
  const [configHome, setConfigHome] = useState({ hero: {}, cardsPersonalizados: [] });

  useEffect(() => {
    DataService.getHome().then(v => {
      const safe = v || {};
      safe.hero = safe.hero || {};
      safe.cardsPersonalizados = Array.isArray(safe.cardsPersonalizados) ? safe.cardsPersonalizados : [];
      setConfigHome(safe);
    }).catch(() => {});
  }, []);

  const salvarHome = async () => {
    try {
      await DataService.salvarHome(configHome);
      alert('Home salva com sucesso.');
    } catch {
      alert('Erro ao salvar Home.');
    }
  };

  const onChangeHero = (campo, valor) => {
    setConfigHome(prev => ({ ...prev, hero: { ...(prev.hero||{}), [campo]: valor } }));
  };

  const addCard = () => {
    setConfigHome(prev => ({
      ...prev,
      cardsPersonalizados: [
        ...(prev.cardsPersonalizados || []),
        {
          id: (globalThis.crypto?.randomUUID?.() ?? String(Date.now()+Math.random())),
          ativo: true,
          icone: '🧩',
          titulo: 'Novo Card',
          descricao: '',
          cor: '#663399',
          link: ''
        }
      ]
    }));
  };

  const updateCard = (id, patch) => {
    setConfigHome(prev => ({
      ...prev,
      cardsPersonalizados: (prev.cardsPersonalizados || []).map(c => c.id === id ? { ...c, ...patch } : c)
    }));
  };

  const removeCard = (id) => {
    setConfigHome(prev => ({
      ...prev,
      cardsPersonalizados: (prev.cardsPersonalizados || []).filter(c => c.id !== id)
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Editor da Home</h1>

      <div>
        <label className="block text-sm">Cor de Fundo</label>
        <input
          type="color"
          value={configHome.hero.corFundo || '#663399'}
          onChange={e => onChangeHero('corFundo', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm">Imagem de Fundo (URL)</label>
        <input
          type="text"
          value={configHome.hero.imagemFundo || ''}
          onChange={e => onChangeHero('imagemFundo', e.target.value)}
          className="border p-1 w-full"
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Cards Personalizados</h2>
          <button onClick={addCard} className="bg-green-600 text-white px-3 py-1 rounded">+ Adicionar Card</button>
        </div>

        <div className="mt-2 space-y-2">
          {(configHome.cardsPersonalizados || []).map(card => (
            <div key={card.id} className="border p-2 rounded space-y-2">
              <div className="flex gap-2">
                <input
                  value={card.titulo}
                  onChange={e => updateCard(card.id, { titulo: e.target.value })}
                  className="border p-1 flex-1"
                  placeholder="Título"
                />
                <input
                  value={card.descricao}
                  onChange={e => updateCard(card.id, { descricao: e.target.value })}
                  className="border p-1 flex-1"
                  placeholder="Descrição"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={card.cor || '#663399'}
                  onChange={e => updateCard(card.id, { cor: e.target.value })}
                />
                <input
                  value={card.link || ''}
                  onChange={e => updateCard(card.id, { link: e.target.value })}
                  className="border p-1 flex-1"
                  placeholder="https://link-do-card"
                />
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={card.ativo ?? true}
                    onChange={e => updateCard(card.id, { ativo: e.target.checked })}
                  />
                  Ativo
                </label>
                <button onClick={() => removeCard(card.id)} className="bg-red-600 text-white px-3 py-1 rounded">Remover</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button onClick={salvarHome} className="bg-blue-600 text-white px-4 py-2 rounded">Salvar Home</button>
      </div>
    </div>
  );
}
