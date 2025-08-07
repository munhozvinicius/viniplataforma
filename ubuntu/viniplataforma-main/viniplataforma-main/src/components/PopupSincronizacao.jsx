import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Github, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Key
} from 'lucide-react'

const PopupSincronizacao = ({ 
  aberto, 
  onFechar, 
  dadosParaPublicar, 
  onSucesso,
  tipoOperacao = 'criar' // 'criar' ou 'editar'
}) => {
  const [chaveGitHub, setChaveGitHub] = useState('')
  const [sincronizando, setSincronizando] = useState(false)
  const [status, setStatus] = useState('idle') // idle, uploading, success, error
  const [mensagem, setMensagem] = useState('')
  const [commitInfo, setCommitInfo] = useState(null)
  const [errorDetails, setErrorDetails] = useState(null)

  const resetarEstado = () => {
    setChaveGitHub('')
    setSincronizando(false)
    setStatus('idle')
    setMensagem('')
    setCommitInfo(null)
    setErrorDetails(null)
  }

  const gerarArquivosJSON = () => {
    const timestamp = new Date().toISOString()
    
    // Arquivo de produtos (incluindo o novo/editado)
    const produtosJSON = {
      versao: '1.0',
      ultimaAtualizacao: timestamp,
      produtos: dadosParaPublicar.produtos.map(produto => ({
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
            ...dadosParaPublicar.produtos.map(p => ({
              id: p.id,
              label: `${p.emoji} ${p.titulo}`,
              icon: 'Bot'
            })),
            { id: 'admin', label: 'Admin', icon: 'Settings' }
          ]
        }
      }
    }

    return { produtosJSON, configJSON }
  }

  const executarSincronizacao = async () => {
    if (!chaveGitHub.trim()) {
      setStatus("error")
      setMensagem("Por favor, insira sua chave do GitHub")
      return
    }

    setSincronizando(true)
    setStatus("uploading")
    setMensagem("Gerando arquivos JSON...")

    try {
      const arquivos = gerarArquivosJSON()
      
      const commitData = {
        github_token: chaveGitHub,
        repo_owner: "munhozvinicius", // Substitua pelo seu usuário do GitHub
        repo_name: "viniplataforma", // Substitua pelo nome do seu repositório
        branch: "main",
        commit_message: `${tipoOperacao === "criar" ? "Adicionar novo produto" : 
                        tipoOperacao === "editar" ? "Atualizar produto" :
                        tipoOperacao === "ordem" ? "Atualizar ordem dos produtos" : "Atualizar configurações"} - ${new Date().toLocaleString("pt-BR")}`,
        files: [
          {
            path: "data/produtos.json",
            content: arquivos.produtosJSON
          },
          {
            path: "data/config.json", 
            content: arquivos.configJSON
          }
        ]
      }
      
      setMensagem("Conectando com GitHub e enviando arquivos...")
      
      // URL do serviço de automação (substitua pela sua URL de deploy)
      const serviceUrl = "https://github-automation-service.vercel.app/api/github/commit"
      
      const response = await fetch(serviceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commitData)
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || result.details || "Erro desconhecido na comunicação com o serviço")
      }
      
      setStatus("success")
      setMensagem(
        `${tipoOperacao === "criar" ? "Produto criado" : 
          tipoOperacao === "editar" ? "Produto editado" :
          tipoOperacao === "ordem" ? "Ordem dos produtos salva" :
          "Alterações salvas"} e sincronizado com sucesso! O Vercel deve iniciar o deploy automaticamente. SHA do Commit: ${result.commit_sha}`
      )
      
      setCommitInfo({
        sha: result.commit_sha,
        url: result.commit_url
      })

      setTimeout(() => {
        onSucesso({
          ...arquivos.produtosJSON.produtos,
          commitInfo: {
            sha: result.commit_sha,
            url: result.commit_url
          }
        })
        resetarEstado()
        onFechar()
      }, 3000)

    } catch (error) {
      setStatus("error")
      setMensagem("Erro na sincronização: " + error.message)
      setErrorDetails(error.message)
    } finally {
      setSincronizando(false)
    }
  }

  const cancelar = () => {
    resetarEstado()
    onFechar()
  }

  return (
    <Dialog open={aberto} onOpenChange={onFechar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-5 w-5" />
            {tipoOperacao === 'criar' ? 'Publicar Novo Produto' : 
             tipoOperacao === 'editar' ? 'Salvar Alterações' :
             tipoOperacao === 'ordem' ? 'Salvar Ordem dos Produtos' : 'Salvar Alterações'}
          </DialogTitle>
          <DialogDescription>
            {tipoOperacao === 'criar' 
              ? 'Para criar o produto, precisamos sincronizar com o GitHub'
              : tipoOperacao === 'editar'
              ? 'Para salvar as alterações, precisamos sincronizar com o GitHub'
              : tipoOperacao === 'ordem'
              ? 'Para salvar a nova ordem dos produtos, precisamos sincronizar com o GitHub'
              : 'Para salvar as alterações, precisamos sincronizar com o GitHub'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
                  <Key className="h-4 w-4 mt-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Sua chave será usada apenas para esta sincronização
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={cancelar}>
                  Cancelar
                </Button>
                <Button onClick={executarSincronizacao}>
                  <Upload className="h-4 w-4 mr-2" />
                  {tipoOperacao === 'criar' ? 'Criar e Publicar' : 
                   tipoOperacao === 'editar' ? 'Salvar e Publicar' :
                   tipoOperacao === 'ordem' ? 'Salvar e Publicar Ordem' : 'Salvar e Publicar'}
                </Button>
              </div>
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
                {commitInfo && (
                  <p className="text-xs mt-2">
                    <a href={commitInfo.url} target="_blank" rel="noopener noreferrer" className="underline">
                      Ver commit no GitHub
                    </a>
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Erro:</strong> {mensagem}
                  {errorDetails && (
                    <p className="text-xs mt-2">Detalhes: {errorDetails}</p>
                  )}
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={cancelar}>
                  Cancelar
                </Button>
                <Button onClick={() => setStatus('idle')}>
                  Tentar Novamente
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PopupSincronizacao

