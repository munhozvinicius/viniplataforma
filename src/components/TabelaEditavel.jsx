import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader } from '@/components/ui/card.jsx'
import { 
  Plus, 
  Minus, 
  Trash2, 
  Edit3, 
  Check, 
  X,
  GripVertical
} from 'lucide-react'

const TabelaEditavel = ({ tabelas, onTabelasChange, editMode = false }) => {
  const [editandoTitulo, setEditandoTitulo] = useState(null)
  const [editandoCelula, setEditandoCelula] = useState(null)

  const adicionarTabela = () => {
    const novaTabela = {
      id: Date.now(),
      titulo: 'Nova Tabela',
      colunas: ['Coluna 1', 'Coluna 2', 'Coluna 3'],
      linhas: [
        ['Linha 1', 'Valor 1', 'Valor 2'],
        ['Linha 2', 'Valor 3', 'Valor 4']
      ]
    }
    onTabelasChange([...tabelas, novaTabela])
  }

  const removerTabela = (tabelaId) => {
    onTabelasChange(tabelas.filter(t => t.id !== tabelaId))
  }

  const atualizarTituloTabela = (tabelaId, novoTitulo) => {
    onTabelasChange(tabelas.map(t => 
      t.id === tabelaId ? { ...t, titulo: novoTitulo } : t
    ))
  }

  const adicionarColuna = (tabelaId) => {
    onTabelasChange(tabelas.map(t => {
      if (t.id === tabelaId) {
        const novasColunas = [...t.colunas, `Coluna ${t.colunas.length + 1}`]
        const novasLinhas = t.linhas.map(linha => [...linha, ''])
        return { ...t, colunas: novasColunas, linhas: novasLinhas }
      }
      return t
    }))
  }

  const removerColuna = (tabelaId, colunaIndex) => {
    onTabelasChange(tabelas.map(t => {
      if (t.id === tabelaId && t.colunas.length > 1) {
        const novasColunas = t.colunas.filter((_, i) => i !== colunaIndex)
        const novasLinhas = t.linhas.map(linha => linha.filter((_, i) => i !== colunaIndex))
        return { ...t, colunas: novasColunas, linhas: novasLinhas }
      }
      return t
    }))
  }

  const adicionarLinha = (tabelaId) => {
    onTabelasChange(tabelas.map(t => {
      if (t.id === tabelaId) {
        const novaLinha = new Array(t.colunas.length).fill('')
        return { ...t, linhas: [...t.linhas, novaLinha] }
      }
      return t
    }))
  }

  const removerLinha = (tabelaId, linhaIndex) => {
    onTabelasChange(tabelas.map(t => {
      if (t.id === tabelaId && t.linhas.length > 1) {
        const novasLinhas = t.linhas.filter((_, i) => i !== linhaIndex)
        return { ...t, linhas: novasLinhas }
      }
      return t
    }))
  }

  const atualizarColunaHeader = (tabelaId, colunaIndex, novoNome) => {
    onTabelasChange(tabelas.map(t => {
      if (t.id === tabelaId) {
        const novasColunas = [...t.colunas]
        novasColunas[colunaIndex] = novoNome
        return { ...t, colunas: novasColunas }
      }
      return t
    }))
  }

  const atualizarCelula = (tabelaId, linhaIndex, colunaIndex, novoValor) => {
    onTabelasChange(tabelas.map(t => {
      if (t.id === tabelaId) {
        const novasLinhas = [...t.linhas]
        novasLinhas[linhaIndex] = [...novasLinhas[linhaIndex]]
        novasLinhas[linhaIndex][colunaIndex] = novoValor
        return { ...t, linhas: novasLinhas }
      }
      return t
    }))
  }

  const renderCelulaEditavel = (valor, tabelaId, linhaIndex, colunaIndex, isHeader = false) => {
    const chaveEdicao = `${tabelaId}-${linhaIndex}-${colunaIndex}`
    const estaEditando = editandoCelula === chaveEdicao

    if (!editMode) {
      return (
        <div className={`p-3 ${isHeader ? 'font-semibold text-white' : ''}`}>
          {valor}
        </div>
      )
    }

    if (estaEditando) {
      return (
        <div className="flex items-center gap-1 p-1">
          <Input
            value={valor}
            onChange={(e) => {
              if (isHeader) {
                atualizarColunaHeader(tabelaId, colunaIndex, e.target.value)
              } else {
                atualizarCelula(tabelaId, linhaIndex, colunaIndex, e.target.value)
              }
            }}
            className="h-8 text-sm"
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setEditandoCelula(null)}
            className="h-8 w-8 p-0"
          >
            <Check className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    return (
      <div 
        className={`p-3 cursor-pointer hover:bg-muted/50 flex items-center justify-between group ${
          isHeader ? 'font-semibold text-white' : ''
        }`}
        onClick={() => setEditandoCelula(chaveEdicao)}
      >
        <span>{valor}</span>
        <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {tabelas.map((tabela) => (
        <Card key={tabela.id} className="overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {editMode && editandoTitulo === tabela.id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={tabela.titulo}
                      onChange={(e) => atualizarTituloTabela(tabela.id, e.target.value)}
                      className="h-8 bg-white text-black"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditandoTitulo(null)}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <h3 
                    className={`text-lg font-semibold ${editMode ? 'cursor-pointer hover:underline' : ''}`}
                    onClick={() => editMode && setEditandoTitulo(tabela.id)}
                  >
                    {tabela.titulo}
                    {editMode && <Edit3 className="h-4 w-4 inline ml-2" />}
                  </h3>
                )}
              </div>
              
              {editMode && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => adicionarColuna(tabela.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Coluna
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => adicionarLinha(tabela.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Linha
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removerTabela(tabela.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary/80">
                    {tabela.colunas.map((coluna, colunaIndex) => (
                      <th key={colunaIndex} className="border border-primary/20 relative group">
                        {renderCelulaEditavel(coluna, tabela.id, -1, colunaIndex, true)}
                        {editMode && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => removerColuna(tabela.id, colunaIndex)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tabela.linhas.map((linha, linhaIndex) => (
                    <tr key={linhaIndex} className="hover:bg-muted/50 group">
                      {linha.map((celula, colunaIndex) => (
                        <td key={colunaIndex} className="border border-border relative">
                          {renderCelulaEditavel(celula, tabela.id, linhaIndex, colunaIndex)}
                        </td>
                      ))}
                      {editMode && (
                        <td className="border border-border w-12">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 mx-auto"
                            onClick={() => removerLinha(tabela.id, linhaIndex)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {editMode && (
        <Card className="border-dashed border-2 border-primary/30">
          <CardContent className="p-6 text-center">
            <Button onClick={adicionarTabela} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Nova Tabela
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TabelaEditavel

