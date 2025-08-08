import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Button } from '@/components/ui/button.jsx'
import { DataService } from '@/services/dataService.js'

export default function AdminHome({ configHome, onConfigChange }) {
  const [localCfg, setLocalCfg] = useState(configHome)

  const salvar = async () => {
    try {
      await DataService.setConfig('home', localCfg)
      onConfigChange(localCfg)
      alert('Home salva com sucesso!')
    } catch (e) {
      console.error(e)
      alert('Falhou ao salvar a Home.')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Editor da Tela Inicial</CardTitle>
          <CardDescription>Personalize completamente a página inicial da plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="principal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="principal">Conteúdo Principal</TabsTrigger>
              <TabsTrigger value="avisos">Avisos e Atualizações</TabsTrigger>
              <TabsTrigger value="layout">Layout e Aparência</TabsTrigger>
              <TabsTrigger value="cards">Cards Personalizados</TabsTrigger>
            </TabsList>

            <TabsContent value="principal" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Título Principal</label>
                  <Input value={localCfg.hero.titulo} onChange={e => setLocalCfg(s => ({ ...s, hero: { ...s.hero, titulo: e.target.value } }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Subtítulo</label>
                  <Input value={localCfg.hero.subtitulo} onChange={e => setLocalCfg(s => ({ ...s, hero: { ...s.hero, subtitulo: e.target.value } }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea value={localCfg.hero.descricao} onChange={e => setLocalCfg(s => ({ ...s, hero: { ...s.hero, descricao: e.target.value } }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Cor de Fundo</label>
                  <Input value={localCfg.hero.corFundo} onChange={e => setLocalCfg(s => ({ ...s, hero: { ...s.hero, corFundo: e.target.value } }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Imagem de Fundo (URL)</label>
                  <Input value={localCfg.hero.imagemFundo} onChange={e => setLocalCfg(s => ({ ...s, hero: { ...s.hero, imagemFundo: e.target.value } }))} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={salvar}>Salvar e Publicar Home</Button>
              </div>
            </TabsContent>

            <TabsContent value="avisos" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título da Seção</label>
                <Input value={localCfg.atualizacoes.titulo} onChange={e => setLocalCfg(s => ({ ...s, atualizacoes: { ...s.atualizacoes, titulo: e.target.value } }))} />
              </div>
              <div>
                <label className="text-sm font-medium">Mostrar seção?</label>
                <Button variant="outline" onClick={() => setLocalCfg(s => ({ ...s, atualizacoes: { ...s.atualizacoes, mostrar: !s.atualizacoes.mostrar } }))}>
                  {localCfg.atualizacoes.mostrar ? 'Ocultar' : 'Mostrar'}
                </Button>
              </div>
              <div className="flex justify-end">
                <Button onClick={salvar}>Salvar e Publicar Home</Button>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Título da Seção de Produtos</label>
                  <Input value={localCfg.produtos.titulo} onChange={e => setLocalCfg(s => ({ ...s, produtos: { ...s.produtos, titulo: e.target.value } }))} />
                </div>
                <div>
                  <label className="text-sm font-medium">Subtítulo</label>
                  <Input value={localCfg.produtos.subtitulo} onChange={e => setLocalCfg(s => ({ ...s, produtos: { ...s.produtos, subtitulo: e.target.value } }))} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={salvar}>Salvar e Publicar Home</Button>
              </div>
            </TabsContent>

            <TabsContent value="cards" className="space-y-4">
              <p className="text-sm text-muted-foreground">Gerencie seus cards personalizados aqui (opcional).</p>
              <div className="flex justify-end">
                <Button onClick={salvar}>Salvar e Publicar Home</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
