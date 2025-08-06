import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Github, 
  Upload, 
  Download, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  FileText,
  RefreshCw
} from 'lucide-react'

const GitHubSync = ({ produtos, onSincronizacaoCompleta }) => {
  const [chaveGitHub, setChaveGitHub] = useState('')
  const [sincronizando, setSincronizando] = useState(false)
  const [status, setStatus] = useState('idle') // idle, uploading, success, error
  const [mensagem, setMensagem] = useState('')
  const [arquivosGerados, setArquivosGerados] = useState([])

  const gerarArquivosJSON = () => {
    const timestamp = new Date().toISOString()
    
    // Arquivo de produtos
    const produtosJSON = {
      versao: '1.0',
      ultimaAtualizacao: timestamp,
      produtos: produtos.map(produto => ({
        id: produto.id,
        emoji: produto.emoji,
        titulo: produto.titulo,
        subtitulo: produto.subtitulo,
        caracteristicas: produto.caracteristicas,
        tabelas: produto.tabelas,
        observacoes: produto.observacoes,
        agentesIA: produto.agentesIA,
        ativo: true,
        criadoEm: produto.criadoEm || timestamp,
        atualizadoEm: timestamp
      }))
    }

    // Arquivo de configuração da plataforma
    const configJSON = {
      versao: '1.0',
      ultimaAtualizacao: timestamp,
      configuracoes: {
        titulo: 'Plataforma do Vini',
        subtitulo: 'Vivo Brasil',
        tema: 'vivo-brasil',
        sidebar: {
          itensFixos: [
            { id: 'home', label: 'Home', icon: 'Home' },
            ...produtos.map(p => ({
              id: p.id,
              label: `${p.emoji} ${p.titulo}`,
              icon: 'Bot'
            })),
            { id: 'admin', label: 'Admin', icon: 'Settings' }
          ]
        }
      }
    }

    // Arquivo de metadados
    const metadataJSON = {
      versao: '1.0',
      geradoEm: timestamp,
      totalProdutos: produtos.length,
      totalTabelas: produtos.reduce((acc, p) => acc + (p.tabelas?.length || 0), 0),
      checksum: btoa(JSON.stringify(produtosJSON)).slice(0, 16)
    }

    setArquivosGerados([
      { nome: 'produtos.json', conteudo: produtosJSON, tamanho: JSON.stringify(produtosJSON).length },
      { nome: 'config.json', conteudo: configJSON, tamanho: JSON.stringify(configJSON).length },
      { nome: 'metadata.json', conteudo: metadataJSON, tamanho: JSON.stringify(metadataJSON).length }
    ])

    return { produtosJSON, configJSON, metadataJSON }
  }

  const simularSincronizacaoGitHub = async () => {
    if (!chaveGitHub.trim()) {
      setStatus('error')
      setMensagem('Por favor, insira sua chave do GitHub')
      return
    }

    setSincronizando(true)
    setStatus('uploading')
    setMensagem('Gerando arquivos JSON...')

    try {
      // Gerar arquivos
      const arquivos = gerarArquivosJSON()
      
      // Simular upload para GitHub
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMensagem('Conectando com GitHub...')
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      setMensagem('Enviando arquivos para o repositório...')
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      setMensagem('Atualizando branch principal...')
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMensagem('Sincronização concluída com sucesso!')
      
      setStatus('success')
      
      // Simular carregamento dos dados do GitHub de volta para a plataforma
      setTimeout(() => {
        onSincronizacaoCompleta(arquivos.produtosJSON.produtos)
        setMensagem('Dados sincronizados e carregados na plataforma!')
      }, 1000)

    } catch (error) {
      setStatus('error')
      setMensagem('Erro na sincronização: ' + error.message)
    } finally {
      setSincronizando(false)
    }
  }

  const baixarArquivosLocalmente = () => {
    arquivosGerados.forEach(arquivo => {
      const blob = new Blob([JSON.stringify(arquivo.conteudo, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = arquivo.nome
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  const resetarSincronizacao = () => {
    setStatus('idle')
    setMensagem('')
    setChaveGitHub('')
    setArquivosGerados([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            Sincronização com GitHub
          </CardTitle>
          <CardDescription>
            Publique suas alterações no repositório GitHub e sincronize com a plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'idle' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Chave de Acesso do GitHub</label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={chaveGitHub}
                    onChange={(e) => setChaveGitHub(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="flex-1"
                  />
                  <Button onClick={gerarArquivosJSON} variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Gerar Arquivos
                  </Button>
                </div>
              </div>

              {arquivosGerados.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">Arquivos Gerados:</h4>
                  <div className="grid gap-2">
                    {arquivosGerados.map((arquivo, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{arquivo.nome}</span>
                          <Badge variant="secondary">{(arquivo.tamanho / 1024).toFixed(1)} KB</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={simularSincronizacaoGitHub} className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Sincronizar com GitHub
                    </Button>
                    <Button onClick={baixarArquivosLocalmente} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Localmente
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'uploading' && (
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <div>
                <h4 className="font-medium">Sincronizando...</h4>
                <p className="text-sm text-muted-foreground">{mensagem}</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Sucesso!</strong> {mensagem}
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Erro:</strong> {mensagem}
              </AlertDescription>
            </Alert>
          )}

          {(status === 'success' || status === 'error') && (
            <div className="flex justify-center">
              <Button onClick={resetarSincronizacao} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Nova Sincronização
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como Funciona a Sincronização</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">1</Badge>
              <div>
                <strong>Criar/Editar:</strong> Desenvolva produtos no painel administrativo
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">2</Badge>
              <div>
                <strong>Gerar Arquivos:</strong> Sistema cria arquivos JSON com os dados
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">3</Badge>
              <div>
                <strong>Chave GitHub:</strong> Insira sua chave de acesso pessoal
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">4</Badge>
              <div>
                <strong>Sincronizar:</strong> Arquivos são enviados para o repositório
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5">5</Badge>
              <div>
                <strong>Retroalimentar:</strong> Dados do GitHub são carregados na plataforma
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default GitHubSync

