import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import TabelaEditavel from './TabelaEditavel.jsx'
import PopupSincronizacao from './PopupSincronizacao.jsx'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  ArrowUp, 
  ArrowDown,
  Eye,
  Settings,
  FileText,
  DollarSign,
  AlertCircle,
  Bot,
  Upload
} from 'lucide-react'

const AdminProdutos = ({ produtos, onProdutosChange }) => {
  const [abaSelecionada, setAbaSelecionada] = useState('desenvolver')
  const [produtoEditando, setProdutoEditando] = useState(null)
  const [popupAberto, setPopupAberto] = useState(false)
  const [dadosParaPublicar, setDadosParaPublicar] = useState(null)
  const [tipoOperacao, setTipoOperacao] = useState('criar')
  const [novoProduto, setNovoProduto] = useState({
    emoji: '🔧',
    titulo: '',
    subtitulo: '',
    caracteristicas: '',
    tabelas: [],
    observacoes: '',
    agentesIA: []
  })

  const emojisDisponiveis = [
    '🤖', '📱', '💻', '🌐', '📊', '🔧', '⚡', '🚀', '💡', '🎯',
    '📈', '🔒', '🌟', '💎', '🎨', '📋', '🔍', '💰', '📞', '🎪'
  ]

  const iniciarPublicacaoNovoProduto = () => {
    if (!novoProduto.titulo) {
      alert('Por favor, preencha o título do produto')
      return
    }

    const produto = {
      ...novoProduto,
      id: novoProduto.titulo.toLowerCase().replace(/\s+/g, '-'),
      tabelas: novoProduto.tabelas.length === 0 ? [{
        id: 1,
        titulo: 'Tabela de Preços',
        colunas: ['Item', 'Preço', 'Descrição'],
        linhas: [['Exemplo', 'R$ 0,00', 'Descrição exemplo']]
      }] : novoProduto.tabelas
    }

    setDadosParaPublicar({
      produtos: [...produtos, produto]
    })
    setTipoOperacao('criar')
    setPopupAberto(true)
  }

  const iniciarSalvarEdicao = () => {
    const produtosAtualizados = produtos.map(p => 
      p.id === produtoEditando.id ? produtoEditando : p
    )
    
    setDadosParaPublicar({
      produtos: produtosAtualizados
    })
    setTipoOperacao('editar')
    setPopupAberto(true)
  }

  const onSucessoSincronizacao = (novosProdutos) => {
    onProdutosChange(novosProdutos)
    
    if (tipoOperacao === 'criar') {
      setNovoProduto({
        emoji: '🔧',
        titulo: '',
        subtitulo: '',
        caracteristicas: '',
        tabelas: [],
        observacoes: '',
        agentesIA: []
      })
    } else {
      setProdutoEditando(null)
    }
  }

  const editarProduto = (produto) => {
    setProdutoEditando({ ...produto })
  }

  const excluirProduto = (produtoId) => {
    onProdutosChange(produtos.filter(p => p.id !== produtoId))
  }

  const moverProduto = (index, direcao) => {
    const novosProdutos = [...produtos]
    const novoIndex = direcao === 'up' ? index - 1 : index + 1
    
    if (novoIndex >= 0 && novoIndex < produtos.length) {
      [novosProdutos[index], novosProdutos[novoIndex]] = [novosProdutos[novoIndex], novosProdutos[index]]
      onProdutosChange(novosProdutos)
    }
  }

  const iniciarSalvarOrdem = () => {
    setDadosParaPublicar({
      produtos: produtos,
      tipoAlteracao: 'ordem'
    })
    setTipoOperacao('ordem')
    setPopupAberto(true)
  }

  const adicionarAgenteIA = (produto) => {
    const novoAgente = {
      titulo: 'Novo Agente',
      descricao: 'Descrição do agente',
      link: '#'
    }
    
    if (produtoEditando) {
      setProdutoEditando({
        ...produtoEditando,
        agentesIA: [...produtoEditando.agentesIA, novoAgente]
      })
    } else {
      setNovoProduto({
        ...novoProduto,
        agentesIA: [...novoProduto.agentesIA, novoAgente]
      })
    }
  }

  const removerAgenteIA = (index) => {
    if (produtoEditando) {
      setProdutoEditando({
        ...produtoEditando,
        agentesIA: produtoEditando.agentesIA.filter((_, i) => i !== index)
      })
    } else {
      setNovoProduto({
        ...novoProduto,
        agentesIA: novoProduto.agentesIA.filter((_, i) => i !== index)
      })
    }
  }

  const renderFormularioProduto = (produto, setProduto, isEdicao = false) => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Título do Produto</label>
          <Input
            value={produto.titulo}
            onChange={(e) => setProduto({ ...produto, titulo: e.target.value })}
            placeholder="Nome do produto"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Subtítulo</label>
          <Input
            value={produto.subtitulo}
            onChange={(e) => setProduto({ ...produto, subtitulo: e.target.value })}
            placeholder="Descrição breve"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Emoji do Produto</label>
        <div className="grid grid-cols-10 gap-2 mt-2">
          {emojisDisponiveis.map((emoji) => (
            <Button
              key={emoji}
              variant={produto.emoji === emoji ? "default" : "outline"}
              className="h-12 text-xl"
              onClick={() => setProduto({ ...produto, emoji })}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="caracteristicas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="caracteristicas">
            <FileText className="h-4 w-4 mr-2" />
            Características
          </TabsTrigger>
          <TabsTrigger value="precos">
            <DollarSign className="h-4 w-4 mr-2" />
            Tabelas
          </TabsTrigger>
          <TabsTrigger value="observacoes">
            <AlertCircle className="h-4 w-4 mr-2" />
            Observações
          </TabsTrigger>
          <TabsTrigger value="agentes">
            <Bot className="h-4 w-4 mr-2" />
            Agentes IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="caracteristicas" className="space-y-4">
          <div>
            <label className="text-sm font-medium">Características Principais</label>
            <Textarea
              value={produto.caracteristicas}
              onChange={(e) => setProduto({ ...produto, caracteristicas: e.target.value })}
              placeholder="Descreva as principais características do produto..."
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="precos" className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tabelas de Preços</label>
            <TabelaEditavel
              tabelas={produto.tabelas}
              onTabelasChange={(novasTabelas) => setProduto({ ...produto, tabelas: novasTabelas })}
              editMode={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="observacoes" className="space-y-4">
          <div>
            <label className="text-sm font-medium">Observações Importantes</label>
            <Textarea
              value={produto.observacoes}
              onChange={(e) => setProduto({ ...produto, observacoes: e.target.value })}
              placeholder="Informações importantes sobre o produto..."
              rows={4}
            />
          </div>
        </TabsContent>

        <TabsContent value="agentes" className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Agentes IA</label>
            <Button onClick={() => adicionarAgenteIA(produto)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Agente
            </Button>
          </div>
          
          <div className="space-y-3">
            {produto.agentesIA.map((agente, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="grid gap-3 md:grid-cols-3">
                    <Input
                      value={agente.titulo}
                      onChange={(e) => {
                        const novosAgentes = [...produto.agentesIA]
                        novosAgentes[index] = { ...agente, titulo: e.target.value }
                        setProduto({ ...produto, agentesIA: novosAgentes })
                      }}
                      placeholder="Título do agente"
                    />
                    <Input
                      value={agente.descricao}
                      onChange={(e) => {
                        const novosAgentes = [...produto.agentesIA]
                        novosAgentes[index] = { ...agente, descricao: e.target.value }
                        setProduto({ ...produto, agentesIA: novosAgentes })
                      }}
                      placeholder="Descrição"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={agente.link}
                        onChange={(e) => {
                          const novosAgentes = [...produto.agentesIA]
                          novosAgentes[index] = { ...agente, link: e.target.value }
                          setProduto({ ...produto, agentesIA: novosAgentes })
                        }}
                        placeholder="Link de acesso"
                        className="flex-1"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removerAgenteIA(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        {isEdicao && (
          <Button variant="outline" onClick={() => setProdutoEditando(null)}>
            Cancelar
          </Button>
        )}
        <Button onClick={isEdicao ? iniciarSalvarEdicao : iniciarPublicacaoNovoProduto}>
          <Upload className="h-4 w-4 mr-2" />
          {isEdicao ? 'Salvar e Publicar' : 'Criar e Publicar'}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Administração de Produtos</CardTitle>
          <CardDescription>
            Crie, edite e gerencie todos os produtos da plataforma
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={abaSelecionada} onValueChange={setAbaSelecionada}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="desenvolver">
            <Plus className="h-4 w-4 mr-2" />
            Desenvolver Produtos
          </TabsTrigger>
          <TabsTrigger value="editar">
            <Edit className="h-4 w-4 mr-2" />
            Editar Produtos
          </TabsTrigger>
          <TabsTrigger value="ordem">
            <Settings className="h-4 w-4 mr-2" />
            Ordem dos Produtos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="desenvolver" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Produto</CardTitle>
              <CardDescription>
                Desenvolva um novo produto do zero com todas as funcionalidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderFormularioProduto(novoProduto, setNovoProduto)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editar" className="space-y-6">
          {produtoEditando ? (
            <Card>
              <CardHeader>
                <CardTitle>Editando: {produtoEditando.titulo}</CardTitle>
                <CardDescription>
                  Modifique as informações do produto existente
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderFormularioProduto(produtoEditando, setProdutoEditando, true)}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {produtos.map((produto) => (
                <Card key={produto.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{produto.emoji}</span>
                        <div>
                          <h3 className="font-semibold">{produto.titulo}</h3>
                          <p className="text-sm text-muted-foreground">{produto.subtitulo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {produto.tabelas?.length || 0} tabelas
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editarProduto(produto)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => excluirProduto(produto.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ordem" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reorganizar Ordem dos Produtos</CardTitle>
              <CardDescription>
                Arraste ou use os botões para alterar a ordem dos produtos no menu lateral
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {produtos.map((produto, index) => (
                  <Card key={produto.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{produto.emoji}</span>
                          <div>
                            <h3 className="font-semibold">{produto.titulo}</h3>
                            <p className="text-sm text-muted-foreground">Posição {index + 1}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moverProduto(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moverProduto(index, 'down')}
                            disabled={index === produtos.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={iniciarSalvarOrdem} size="lg">
                  <Upload className="h-4 w-4 mr-2" />
                  Salvar e Publicar Ordem
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PopupSincronizacao
        aberto={popupAberto}
        onFechar={() => setPopupAberto(false)}
        dadosParaPublicar={dadosParaPublicar}
        onSucesso={onSucessoSincronizacao}
        tipoOperacao={tipoOperacao}
      />
    </div>
  )
}

export default AdminProdutos

