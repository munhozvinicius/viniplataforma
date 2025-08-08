import { useState } from 'react'
import { DataService } from '@/services/dataService.js'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import PopupSincronizacao from './PopupSincronizacao.jsx'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  ArrowUp, 
  ArrowDown,
  Eye,
  Home,
  Bell,
  Palette,
  Layout,
  Settings,
  Upload,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  X
} from 'lucide-react'

const AdminHome = ({ configHome, onConfigChange }) => {
  const [abaSelecionada, setAbaSelecionada] = useState('conteudo')
  const [popupAberto, setPopupAberto] = useState(false)
  const [dadosParaPublicar, setDadosParaPublicar] = useState(null)
  const [configEditando, setConfigEditando] = useState(configHome || {
    hero: {
      titulo: 'Bem-vindo à Plataforma do Vini',
      subtitulo: 'Sua central de informações para produtos e soluções Vivo',
      descricao: 'Acesse informações atualizadas sobre produtos, preços e conte com nossos agentes IA especializados para otimizar suas consultas e vendas.',
      corFundo: '#663399',
      imagemFundo: ''
    },
    atualizacoes: {
      titulo: 'Atualizações Recentes',
      mostrar: true,
      itens: [
        {
          id: 1,
          data: '06/08/2025',
          titulo: 'Nova funcionalidade de comparação de preços adicionada',
          tipo: 'success'
        },
        {
          id: 2,
          data: '05/08/2025',
          titulo: 'Atualização dos agentes IA com melhor precisão',
          tipo: 'info'
        },
        {
          id: 3,
          data: '04/08/2025',
          titulo: 'Interface redesenhada com cores da Vivo',
          tipo: 'info'
        }
      ]
    },
    produtos: {
      titulo: 'Produtos Disponíveis',
      subtitulo: 'Dados sincronizados com GitHub',
      layoutCards: 'grid', // grid, lista, carousel
      mostrarContadores: true
    },
    cardsPersonalizados: []
  })

  const tiposAviso = [
    { value: 'info', label: 'Informação', icon: Info, color: 'bg-blue-500' },
    { value: 'success', label: 'Sucesso', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'warning', label: 'Aviso', icon: AlertCircle, color: 'bg-yellow-500' },
    { value: 'error', label: 'Erro', icon: X, color: 'bg-red-500' }
  ]

  const iniciarPublicacaoHome = () => {
    setDadosParaPublicar({
      configHome: configEditando
    })
    setPopupAberto(true)
  }

  const onSucessoSincronizacao = (dadosAtualizados) => {
    onConfigChange(configEditando)
    // Aqui poderia recarregar a configuração do GitHub se necessário
  }

  const adicionarAtualizacao = () => {
    const novaAtualizacao = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR'),
      titulo: '',
      tipo: 'info'
    }
    
    setConfigEditando({
      ...configEditando,
      atualizacoes: {
        ...configEditando.atualizacoes,
        itens: [novaAtualizacao, ...configEditando.atualizacoes.itens]
      }
    })
  }

  const removerAtualizacao = (id) => {
    setConfigEditando({
      ...configEditando,
      atualizacoes: {
        ...configEditando.atualizacoes,
        itens: configEditando.atualizacoes.itens.filter(item => item.id !== id)
      }
    })
  }

  const atualizarAtualizacao = (id, campo, valor) => {
    setConfigEditando({
      ...configEditando,
      atualizacoes: {
        ...configEditando.atualizacoes,
        itens: configEditando.atualizacoes.itens.map(item =>
          item.id === id ? { ...item, [campo]: valor } : item
        )
      }
    })
  }

  const moverAtualizacao = (index, direcao) => {
    const itens = [...configEditando.atualizacoes.itens]
    const novoIndex = direcao === 'up' ? index - 1 : index + 1
    
    if (novoIndex >= 0 && novoIndex < itens.length) {
      [itens[index], itens[novoIndex]] = [itens[novoIndex], itens[index]]
      
      setConfigEditando({
        ...configEditando,
        atualizacoes: {
          ...configEditando.atualizacoes,
          itens
        }
      })
    }
  }

  const adicionarCardPersonalizado = () => {
    const novoCard = {
      id: Date.now(),
      titulo: 'Novo Card',
      descricao: 'Descrição do card',
      icone: '📋',
      link: '',
      cor: '#663399',
      ativo: true
    }
    
    setConfigEditando({
      ...configEditando,
      cardsPersonalizados: [...configEditando.cardsPersonalizados, novoCard]
    })
  }

  const removerCardPersonalizado = (id) => {
    setConfigEditando({
      ...configEditando,
      cardsPersonalizados: configEditando.cardsPersonalizados.filter(card => card.id !== id)
    })
  }

  const atualizarCardPersonalizado = (id, campo, valor) => {
    setConfigEditando({
      ...configEditando,
      cardsPersonalizados: configEditando.cardsPersonalizados.map(card =>
        card.id === id ? { ...card, [campo]: valor } : card
      )
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Editor da Tela Inicial
          </CardTitle>
          <CardDescription>
            Personalize completamente a página inicial da plataforma
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conteudo">
            <Edit className="h-4 w-4 mr-2" />
            Conteúdo Principal
          </TabsTrigger>
          <TabsTrigger value="avisos">
            <Bell className="h-4 w-4 mr-2" />
            Avisos e Atualizações
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout className="h-4 w-4 mr-2" />
            Layout e Aparência
          </TabsTrigger>
          <TabsTrigger value="cards">
            <Plus className="h-4 w-4 mr-2" />
            Cards Personalizados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conteudo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seção Principal (Hero)</CardTitle>
              <CardDescription>
                Configure o conteúdo principal da página inicial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Título Principal</label>
                  <Input
                    value={configEditando.hero.titulo}
                    onChange={(e) => setConfigEditando({
                      ...configEditando,
                      hero: { ...configEditando.hero, titulo: e.target.value }
                    })}
                    placeholder="Título da página"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subtítulo</label>
                  <Input
                    value={configEditando.hero.subtitulo}
                    onChange={(e) => setConfigEditando({
                      ...configEditando,
                      hero: { ...configEditando.hero, subtitulo: e.target.value }
                    })}
                    placeholder="Subtítulo explicativo"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={configEditando.hero.descricao}
                  onChange={(e) => setConfigEditando({
                    ...configEditando,
                    hero: { ...configEditando.hero, descricao: e.target.value }
                  })}
                  placeholder="Descrição detalhada da plataforma"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Cor de Fundo</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={configEditando.hero.corFundo}
                      onChange={(e) => setConfigEditando({
                        ...configEditando,
                        hero: { ...configEditando.hero, corFundo: e.target.value }
                      })}
                      className="w-16 h-10"
                    />
                    <Input
                      value={configEditando.hero.corFundo}
                      onChange={(e) => setConfigEditando({
                        ...configEditando,
                        hero: { ...configEditando.hero, corFundo: e.target.value }
                      })}
                      placeholder="#663399"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Imagem de Fundo (URL)</label>
                  <Input
                    value={configEditando.hero.imagemFundo}
                    onChange={(e) => setConfigEditando({
                      ...configEditando,
                      hero: { ...configEditando.hero, imagemFundo: e.target.value }
                    })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seção de Produtos</CardTitle>
              <CardDescription>
                Configure como os produtos são exibidos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Título da Seção</label>
                  <Input
                    value={configEditando.produtos.titulo}
                    onChange={(e) => setConfigEditando({
                      ...configEditando,
                      produtos: { ...configEditando.produtos, titulo: e.target.value }
                    })}
                    placeholder="Produtos Disponíveis"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Subtítulo</label>
                  <Input
                    value={configEditando.produtos.subtitulo}
                    onChange={(e) => setConfigEditando({
                      ...configEditando,
                      produtos: { ...configEditando.produtos, subtitulo: e.target.value }
                    })}
                    placeholder="Dados sincronizados com GitHub"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avisos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Avisos e Atualizações</span>
                <Button onClick={adicionarAtualizacao} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Aviso
                </Button>
              </CardTitle>
              <CardDescription>
                Gerencie os avisos e atualizações exibidos na página inicial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Título da Seção:</label>
                <Input
                  value={configEditando.atualizacoes.titulo}
                  onChange={(e) => setConfigEditando({
                    ...configEditando,
                    atualizacoes: { ...configEditando.atualizacoes, titulo: e.target.value }
                  })}
                  placeholder="Atualizações Recentes"
                  className="max-w-xs"
                />
              </div>

              <div className="space-y-3">
                {configEditando.atualizacoes.itens.map((item, index) => {
                  const TipoIcon = tiposAviso.find(t => t.value === item.tipo)?.icon || Info
                  const corTipo = tiposAviso.find(t => t.value === item.tipo)?.color || 'bg-blue-500'
                  
                  return (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${corTipo} text-white`}>
                            <TipoIcon className="h-4 w-4" />
                          </div>
                          
                          <div className="flex-1 space-y-3">
                            <div className="grid gap-3 md:grid-cols-3">
                              <Input
                                type="date"
                                value={item.data.split('/').reverse().join('-')}
                                onChange={(e) => {
                                  const dataFormatada = e.target.value.split('-').reverse().join('/')
                                  atualizarAtualizacao(item.id, 'data', dataFormatada)
                                }}
                              />
                              <select
                                value={item.tipo}
                                onChange={(e) => atualizarAtualizacao(item.id, 'tipo', e.target.value)}
                                className="px-3 py-2 border rounded-md"
                              >
                                {tiposAviso.map(tipo => (
                                  <option key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                  </option>
                                ))}
                              </select>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => moverAtualizacao(index, 'up')}
                                  disabled={index === 0}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => moverAtualizacao(index, 'down')}
                                  disabled={index === configEditando.atualizacoes.itens.length - 1}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removerAtualizacao(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <Input
                              value={item.titulo}
                              onChange={(e) => atualizarAtualizacao(item.id, 'titulo', e.target.value)}
                              placeholder="Título da atualização"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout e Aparência</CardTitle>
              <CardDescription>
                Configure o visual e layout da página inicial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Palette className="h-4 w-4" />
                <AlertDescription>
                  As configurações de layout serão aplicadas após a sincronização com o GitHub.
                </AlertDescription>
              </Alert>
              
              <div>
                <label className="text-sm font-medium">Layout dos Cards de Produtos</label>
                <select
                  value={configEditando.produtos.layoutCards}
                  onChange={(e) => setConfigEditando({
                    ...configEditando,
                    produtos: { ...configEditando.produtos, layoutCards: e.target.value }
                  })}
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  <option value="grid">Grade (Grid)</option>
                  <option value="lista">Lista Vertical</option>
                  <option value="carousel">Carrossel</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mostrarContadores"
                  checked={configEditando.produtos.mostrarContadores}
                  onChange={(e) => setConfigEditando({
                    ...configEditando,
                    produtos: { ...configEditando.produtos, mostrarContadores: e.target.checked }
                  })}
                />
                <label htmlFor="mostrarContadores" className="text-sm font-medium">
                  Mostrar contadores de tabelas nos cards
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Cards Personalizados</span>
                <Button onClick={adicionarCardPersonalizado} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Card
                </Button>
              </CardTitle>
              <CardDescription>
                Crie cards personalizados para links importantes, CTAs ou informações especiais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {configEditando.cardsPersonalizados.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum card personalizado criado ainda.</p>
                  <p className="text-sm">Clique em "Adicionar Card" para começar.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {configEditando.cardsPersonalizados.map((card) => (
                    <Card key={card.id}>
                      <CardContent className="p-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <Input
                              value={card.titulo}
                              onChange={(e) => atualizarCardPersonalizado(card.id, 'titulo', e.target.value)}
                              placeholder="Título do card"
                            />
                            <Textarea
                              value={card.descricao}
                              onChange={(e) => atualizarCardPersonalizado(card.id, 'descricao', e.target.value)}
                              placeholder="Descrição do card"
                              rows={2}
                            />
                            <Input
                              value={card.link}
                              onChange={(e) => atualizarCardPersonalizado(card.id, 'link', e.target.value)}
                              placeholder="Link (opcional)"
                            />
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium">Ícone (Emoji)</label>
                              <Input
                                value={card.icone}
                                onChange={(e) => atualizarCardPersonalizado(card.id, 'icone', e.target.value)}
                                placeholder="📋"
                                className="text-center text-lg"
                                maxLength={2}
                              />
                            </div>
                            
                            <div>
                              <label className="text-sm font-medium">Cor</label>
                              <div className="flex gap-2">
                                <Input
                                  type="color"
                                  value={card.cor}
                                  onChange={(e) => atualizarCardPersonalizado(card.id, 'cor', e.target.value)}
                                  className="w-16 h-10"
                                />
                                <Input
                                  value={card.cor}
                                  onChange={(e) => atualizarCardPersonalizado(card.id, 'cor', e.target.value)}
                                  placeholder="#663399"
                                  className="flex-1"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`ativo-${card.id}`}
                                  checked={card.ativo}
                                  onChange={(e) => atualizarCardPersonalizado(card.id, 'ativo', e.target.checked)}
                                />
                                <label htmlFor={`ativo-${card.id}`} className="text-sm font-medium">
                                  Ativo
                                </label>
                              </div>
                              
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removerCardPersonalizado(card.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={iniciarPublicacaoHome} size="lg">
          <Upload className="h-4 w-4 mr-2" />
          Salvar e Publicar Home
        </Button>
      </div>

      <PopupSincronizacao
        aberto={popupAberto}
        onFechar={() => setPopupAberto(false)}
        dadosParaPublicar={dadosParaPublicar}
        onSucesso={onSucessoSincronizacao}
        tipoOperacao="editar"
      />
    </div>
  )
}

export default AdminHome

