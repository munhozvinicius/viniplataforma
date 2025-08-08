import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Produto from './pages/Produto';
import AdminHome from './admin/AdminHome';
import AdminProdutos from './admin/AdminProdutos';
import { DataService } from './services/dataService';

function App() {
  const [configHome, setConfigHome] = useState({
    titulo: 'Bem-vindo à Plataforma do Vini',
    subtitulo: 'Plataforma criada pensando em te ajudar a ser um consultor da Vivo',
    atualizacoes: {
      ultima: '08/08/2025',
      descricao: 'Primeira versão com salvamento no banco'
    }
  });

  const [produtos, setProdutos] = useState([
    {
      id: 'ajuda-ai-ia',
      nome: 'Ajuda aí IA',
      descricao: 'Agente de inteligência artificial para vendas',
      precos: [],
      observacoes: [],
      agentes: []
    }
  ]);

  // Carrega configurações e produtos do banco (page_configs)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const homeCfg = await DataService.getConfig('home');
        if (!cancelled && homeCfg?.value) setConfigHome(homeCfg.value);
      } catch {}

      try {
        const prods = await DataService.getConfig('produtos');
        if (!cancelled && Array.isArray(prods?.value)) setProdutos(prods.value);
      } catch {}
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <Router>
      <div className="flex">
        <Sidebar produtos={produtos} />
        <main className="flex-1 p-4">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  config={configHome}
                  produtos={produtos}
                />
              }
            />
            <Route
              path="/admin/home"
              element={
                <AdminHome
                  config={configHome}
                  onConfigChange={(cfg) => {
                    setConfigHome(cfg);
                    DataService.setConfig('home', cfg).catch(() => {});
                  }}
                />
              }
            />
            <Route
              path="/admin/produtos"
              element={
                <AdminProdutos
                  produtos={produtos}
                  onProdutosChange={(list) => {
                    setProdutos(list);
                    DataService.setConfig('produtos', list).catch(() => {});
                  }}
                />
              }
            />
            {produtos.map((p) => (
              <Route
                key={p.id}
                path={`/produto/${p.id}`}
                element={<Produto produto={p} />}
              />
            ))}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
