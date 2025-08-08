import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Edit2, PlusCircle, Upload } from 'lucide-react'
import { DataService } from '@/services/dataService.js'

export default function AdminProdutos({ produtos, onProdutosChange }) {
  const [novoProduto, setNovoProduto] = useState({
    emoji: '🔧',
    titulo: '',
    subtitulo: '',
    caracteristicas: '',
    tabelas: [],
    observacoes: '',
    agentesIA: []
  })
  const [produtoEditando, setProdutoEditando] = useState(null)

  async function salvarNoBanco(novaLista) {
    try {
      await DataService.setConfig('produtos', novaLista)
      onProdutosChange(novaLista)
      alert('Produtos salvos com sucesso!')
    } catch (err) {
      console.error(err)
      alert('Falhou ao salvar no banco. Veja os logs.')
    }
  }

  function montarProdutoBase(p) {
    const tabelas = (p.tabelas?.length ? p.tabelas : [{
      id: 1,
      titulo: 'Tabela de Preços',
      colunas: ['Item', 'Preço', 'Descrição'],
      linhas: [['Exemplo', 'R$ 0,00', 'Descrição exemplo']]
    }])
    return {
      ...p,
      id: (p.id || p.titulo || 'produto').toLowerCase().replace(/\s+/g, '-'),
      tabelas,
      agentesIA: Array.isArray(p.agentesIA) ? p.agentesIA : []
    }
  }

  const criarPublicar = async () => {
    if (!novoProduto.titulo) {
      alert('Preencha o título do produto')
      return
    }
    const produto = montarProdutoBase(novoProduto)
    const novaLista = [...produtos, produto]
    await salvarNoBanco(novaLista)
    setNovoProduto({ emoji: '🔧', titulo: '', subtitulo: '', caracteristicas: '', tabelas: [], observacoes: '', agentesIA: [] })
  }

  const salvarEdicao = async () => {
    if (!produtoEditando?.id) return
    const produto = montarProdutoBase(produtoEditando)
    const novaLista = produtos.map(p => p.id === produto.id ? produto : p)
    await salvarNoBanco(novaLista)
    setProdutoEditando(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Administração de Produtos</CardTitle>
          <CardDescription>Crie, edite e gerencie todos os produtos da plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <h3 className="font-semibold">Criar Novo Produto</h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Título do Produto</label>
                <Input
                  value={novoProduto.titulo}
                  onChange={e => setNovoProduto(p => ({ ...p, titulo: e.target.value }))}
                  placeholder="Ex.: Ajuda aí IA"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subtítulo</label>
                <Input
                  value={novoProduto.subtitulo}
                  onChange={e => setNovoProduto(p => ({ ...p, subtitulo: e.target.value }))}
                  placeholder="Assistente virtual inteligente"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Emoji do Produto</label>
                <Input
                  value={novoProduto.emoji}
                  onChange={e => setNovoProduto(p => ({ ...p, emoji: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Características Principais</label>
                <Textarea
                  value={novoProduto.caracteristicas}
                  onChange={e => setNovoProduto(p => ({ ...p, caracteristicas: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setNovoProduto({ emoji: '🔧', titulo: '', subtitulo: '', caracteristicas: '', tabelas: [], observacoes: '', agentesIA: [] })}>
                Cancelar
              </Button>
              <Button onClick={criarPublicar}>
                <Upload className="h-4 w-4 mr-2" />
                Criar e Publicar
              </Button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              <h3 className="font-semibold">Editar Produtos</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {produtos.map(p => (
                  <Button key={p.id} variant={produtoEditando?.id === p.id ? 'secondary' : 'outline'} className="w-full justify-start" onClick={() => setProdutoEditando(p)}>
                    <span className="mr-2">{p.emoji || '📦'}</span>
                    {p.titulo}
                  </Button>
                ))}
              </div>

              <div>
                {produtoEditando ? (
                  <div className="space-y-3">
                    <Input value={produtoEditando.titulo} onChange={e => setProdutoEditando(s => ({ ...s, titulo: e.target.value }))} />
                    <Input value={produtoEditando.subtitulo || ''} onChange={e => setProdutoEditando(s => ({ ...s, subtitulo: e.target.value }))} />
                    <Input value={produtoEditando.emoji || ''} onChange={e => setProdutoEditando(s => ({ ...s, emoji: e.target.value }))} />
                    <Textarea value={produtoEditando.caracteristicas || ''} onChange={e => setProdutoEditando(s => ({ ...s, caracteristicas: e.target.value }))} />

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setProdutoEditando(null)}>Cancelar</Button>
                      <Button onClick={salvarEdicao}>
                        <Upload className="h-4 w-4 mr-2" />
                        Salvar e Publicar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Selecione um produto para editar</div>
                )}
              </div>
            </div>
          </section>

        </CardContent>
      </Card>
    </div>
  )
}
