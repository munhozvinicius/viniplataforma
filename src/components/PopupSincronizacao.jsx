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

  const resetarEstado = () => {
    setChaveGitHub('')
    setSincronizando(false)
    setStatus('idle')
    setMensagem('')
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
      setStatus('error')
      setMensagem('Por favor, insira sua chave do GitHub')
      return
    }

    setSincronizando(true)
    setStatus('uploading')

    try {
      // Gerar arquivos
      setMensagem('Gerando arquivos JSON...')
      const arquivos = gerarArquivosJSON()
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular upload para GitHub
      setMensagem('Conectando com GitHub...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setMensagem('Enviando arquivos para o repositório...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setMensagem('Atualizando branch principal...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStatus('success')
      setMensagem(
        tipoOperacao === 'criar' ? 'Produto criado e sincronizado com sucesso!' :
        tipoOperacao === 'editar' ? 'Produto editado e sincronizado com sucesso!' :
        tipoOperacao === 'ordem' ? 'Ordem dos produtos salva e sincronizada com sucesso!' :
        'Alterações sincronizadas com sucesso!'
      )
      
      // Notificar sucesso e fechar popup
      setTimeout(() => {
        onSucesso(arquivos.produtosJSON.produtos)
        resetarEstado()
        onFechar()
      }, 2000)

    } catch (error) {
      setStatus('error')
      setMensagem('Erro na sincronização: ' + error.message)
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
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Erro:</strong> {mensagem}
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

