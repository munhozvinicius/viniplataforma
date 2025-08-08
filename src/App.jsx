import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import AdminProdutos from './components/AdminProdutos.jsx'
import AdminHome from './components/AdminHome.jsx'
import { DataService } from './services/dataService.js'
import { 
  Home, 
  Bot, 
  Settings, 
  Star, 
  DollarSign, 
  AlertCircle, 
  ExternalLink,
  Menu,
  X,
  Edit,
  CheckCircle,
  Info,
  Bell
} from 'lucide-react'
import './App.css'

// --------- Defaults seguros ---------
const DEFAULT_HOME = {
  hero: {
    titulo: 'Bem-vindo à Plataforma do Vini',
    subtitulo: 'Sua central de informações',
    descricao: 'Acesse produtos, preços e agentes IA.',
    corFundo: '#663399',
    imagemFundo: ''
  },
  atualizacoes: {
    titulo: 'Atualizações Recentes',
    mostrar: true,
    itens: []
  },
  produtos: {
    titulo: 'Produtos Disponíveis',
    subtitulo: 'Sincronizados com o banco',
    layoutCards: 'grid',
    mostrarContadores: true
  },
  cardsPersonalizados: []
}

const DEFAULT_PRODUCTS = [
  {
    id: 'ajuda-ai-ia',
    emoji: '🤖',
    titulo: 'Ajuda aí IA',
    subtitulo: 'Assistente virtual inteligente',
    caracteristicas: 'IA avançada para suporte e vendas',
    tabelas: [
      {
        id: 1,
        titulo: 'Planos Básicos',
        colunas: ['Plano', 'Preço', 'Recursos'],
        linhas: [
          ['Starter', 'R$ 29,90', 'Até 100 consultas'],
          ['Pro', 'R$ 59,90', 'Até 500 consultas'],
          ['Enterprise', 'R$ 129,90', 'Consultas ilimitadas']
        ]
      }
    ],
    observacoes: 'Produto em constante evolução com atualizações mensais.',
    agentesIA: [
      { titulo: 'Agente Vendas', descricao: 'Especializado em conversão', link: '#' }
    ]
  }
]

export default function App() {
  const [produtoAtivo, setProdutoAtivo] = useState('home')
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const [dadosSincronizados, setDadosSincronizados] = useState(true)
  const [configHome, setConfigHome] = useState(DEFAULT_HOME)
  const [produtos, setProdutos] = useState(DEFAULT_PRODUCTS)

  // --------- Carrega do banco (Neon via API) ---------
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const homeCfg = await DataService.getConfig('home')
        if (!cancelled) {
          const v = (homeCfg && homeCfg.value) || {}
          const merged = {
            ...DEFAULT_HOME,
            ...v,
            hero: { ...DEFAULT_HOME.hero, ...(v.hero || {}) },
            atualizacoes: { ...DEFAULT_HOME.atualizacoes, ...(v.atualizacoes || {}) },
            produtos: { ...DEFAULT_HOME.produtos, ...(v.produtos || {}) },
            cardsPersonalizados: Array.isArray(v.cardsPersonalizados) ? v.cardsPersonalizados : []
          }
          setConfigHome(merged)
        }
      } catch (e) {
        // segue com defaults
      }

      try {
        const prods = await DataService.getConfig('produtos')
        if (!cancelled) {
          if (Array.isArray(prods?.value)) setProdutos(prods.value)
        }
      } catch (e) {
        // segue com defaults
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // --------- Menu lateral ---------
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    ...produtos.map(p => ({ id: p.id, icon: Bot, label: `${p.emoji ?? '🟣'} ${p.titulo}` })),
    { id: 'admin', icon: Settings, label: 'Admin' }
  ]

  // --------- Renderizações ---------
  const renderHome = () => (
    <div className="space-y-8">
      <div 
        className="rounded-lg p-8 text-white"
        style={{ 
          background: (configHome?.hero?.imagemFundo && String(configHome.hero.imagemFundo).trim().length > 0)
            ? `linear-gradient(rgba(102, 51, 153, 0.8), rgba(102, 51, 153, 0.8)), url(${configHome.hero.imagemFundo})`
            : (configHome?.hero?.corFundo || '#663399')
        }}
      >
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">{configHome?.hero?.titulo}</h1>
          <h2 className="text-xl mb-4 opacity-90">{configHome?.hero?.subtitulo}</h2>
          <p className="text-lg opacity-80 leading-relaxed">{configHome?.hero?.descricao}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{configHome?.produtos?.titulo}</CardTitle>
              <CardDescription>{configHome?.produtos?.subtitulo}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${
                configHome?.produtos?.layoutCards === 'lista' ? 'grid-cols-1' : 'md:grid-cols-2'
              }`}>
                {produtos.map((produto) => (
                  <Card key={produto.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{produto.emoji ?? '🟣'}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{produto.titulo}</h3>
                          <p className="text-muted-foreground mb-4">{produto.subtitulo}</p>
                          <Button className="w-full" onClick={() => setProdutoAtivo(produto.id)}>
                            Acessar Produto
                          </Button>
                          {configHome?.produtos?.mostrarContadores && (
                            <div className="mt-3 text-center">
                              <Badge variant="secondary">{produto.tabelas?.length || 0} tabelas</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Cards Personalizados */}
                {(configHome?.cardsPersonalizados || []).filter(c => c.ativo).map(card => (
                  <Card key={card.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{card.icone ?? '🟣'}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{card.titulo}</h3>
                          <p className="text-muted-foreground mb-4">{card.descricao}</p>
                          {card.link && (
                            <Button className="w-full" style={{ backgroundColor: card.cor || undefined }}
                              onClick={() => window.open(card.link, '_blank')}>
                              Acessar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        {configHome?.atualizacoes?.mostrar && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {configHome?.atualizacoes?.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(configHome?.atualizacoes?.itens || []).map((item) => {
                    const getIconAndColor = (tipo) => {
                      switch (tipo) {
                        case 'success': return { icon: CheckCircle, color: 'text-green-600' }
                        case 'warning': return { icon: AlertCircle, color: 'text-yellow-600' }
                        case 'error':   return { icon: X, color: 'text-red-600' }
                        default:        return { icon: Info, color: 'text-blue-600' }
                      }
                    }
                    const { icon: Icon, color } = getIconAndColor(item.tipo)
                    return (
                      <div key={item.id ?? String(item.titulo)} className="border-l-4 border-primary pl-4">
                        <div className="flex items-start gap-2">
                          <Icon className={`h-4 w-4 mt-0.5 ${color}`} />
                          <div>
                            <p className="text-sm font-medium">{item.titulo}</p>
                            <p className="text-xs text-muted-foreground">{item.data}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )

  const renderProduto = (produto) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{produto.emoji ?? '🟣'}</span>
          <div>
            <h1 className="text-3xl font-bold text-primary">{produto.titulo}</h1>
            <p className="text-muted-foreground">{produto.subtitulo}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!dadosSincronizados && (
            <Badge variant="outline" className="text-amber-600 border-amber-300">Não sincronizado</Badge>
          )}
          <Button variant="outline" onClick={() => setProdutoAtivo('admin')} className="flex items-center gap-2">
            <Edit className="h-4 w-4" /> Editar no Admin
          </Button>
        </div>
      </div>

      <Tabs defaultValue="caracteristicas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="caracteristicas">Características</TabsTrigger>
          <TabsTrigger value="precos">Preços</TabsTrigger>
          <TabsTrigger value="observacoes">Observações</TabsTrigger>
          <TabsTrigger value="agentes">Agentes IA</TabsTrigger>
        </TabsList>

        <TabsContent value="caracteristicas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" /> Características Principais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{produto.caracteristicas}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="precos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" /> Tabelas de Preços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(produto.tabelas || []).map((tabela) => (
                  <Card key={tabela.id} className="overflow-hidden">
                    <CardHeader className="bg-primary text-primary-foreground">
                      <CardTitle>{tabela.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-primary/80">
                              {tabela.colunas.map((coluna, index) => (
                                <th key={index} className="border border-primary/20 p-3 text-left font-semibold text-white">
                                  {coluna}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tabela.linhas.map((linha, linhaIndex) => (
                              <tr key={linhaIndex} className="hover:bg-muted/50">
                                {linha.map((celula, celulaIndex) => (
                                  <td key={celulaIndex} className="border border-border p-3">{celula}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" /> Observações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{produto.observacoes}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agentes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" /> Agentes IA Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {(produto.agentesIA || []).map((agente, index) => (
                  <Card key={index} className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-lg">{agente.titulo}</CardTitle>
                      <CardDescription>{agente.descricao}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline" onClick={() => window.open(agente.link ?? '#', '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" /> Acessar Agente
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderAdmin = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Painel Administrativo
          </CardTitle>
          <CardDescription>Gerencie produtos e configure a plataforma</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="produtos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="produtos">Gestão de Produtos</TabsTrigger>
          <TabsTrigger value="home">Editor da Home</TabsTrigger>
          <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="produtos" className="space-y-6">
          <AdminProdutos 
            produtos={produtos}
            onProdutosChange={(list) => { setProdutos(list); DataService.setConfig('produtos', list).catch(() => {}) }}
          />
        </TabsContent>

        <TabsContent value="home" className="space-y-6">
          <AdminHome 
            configHome={configHome}
            onConfigChange={(cfg) => { setConfigHome(cfg); DataService.setConfig('home', cfg).catch(() => {}) }}
          />
        </TabsContent>

        <TabsContent value="configuracoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
              <CardDescription>Estado atual da plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total de Produtos</div>
                  <div className="text-lg font-semibold">{produtos.length}</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Total de Tabelas</div>
                  <div className="text-lg font-semibold">{produtos.reduce((acc, p) => acc + (p.tabelas?.length || 0), 0)}</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-sm text-muted-foreground">Agentes IA</div>
                  <div className="text-lg font-semibold">{produtos.reduce((acc, p) => acc + (p.agentesIA?.length || 0), 0)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderConteudo = () => {
    if (produtoAtivo === 'home') return renderHome()
    if (produtoAtivo === 'admin') return renderAdmin()
    const produto = produtos.find(p => p.id === produtoAtivo)
    if (produto) return renderProduto(produto)
    return renderHome()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Botão mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setSidebarAberta(!sidebarAberta)}>
          {sidebarAberta ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${ (sidebarAberta ? 'translate-x-0' : '-translate-x-full') }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="text-xl font-bold text-sidebar-foreground">vivo</h2>
            <p className="text-sm text-sidebar-foreground/70">Plataforma do Vini</p>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={produtoAtivo === item.id ? 'secondary' : 'ghost'}
                className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent ${produtoAtivo === item.id ? 'bg-sidebar-accent' : ''}`}
                onClick={() => { setProdutoAtivo(item.id); setSidebarAberta(false) }}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay mobile */}
      {sidebarAberta && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarAberta(false)} />}

      {/* Conteúdo principal */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-6 pt-16 lg:pt-6">{renderConteudo()}</main>
      </div>
    </div>
  )
}
