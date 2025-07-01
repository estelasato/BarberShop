import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, Search } from "lucide-react"
import { Cidade, criarCidade, atualizarCidade } from "@/services/cidadeService"
import { Estado } from "@/services/estadoService"
import { ModalEstados } from "@/components/modals/ModalEstados"
import { toast } from "react-toastify"
import { CidadeSchema } from "@/validations/localizacao"

type Props = {
  isOpen: boolean
  onOpenChange: (o: boolean) => void
  cidade?: Cidade | null
  onSave: () => Promise<void> 
  readOnly?: boolean
  estados: Estado[] 
}

export function ModalCidades({
  isOpen,
  onOpenChange,
  cidade,
  onSave,
  readOnly = false,
  estados,
}: Props) {
  const [form, setForm] = useState({ nome: "", ddd: "", idEstado: 0 })
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false)
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [searchEstado, setSearchEstado] = useState("")


  useEffect(() => {
    if (cidade) {
      setForm({ nome: cidade.nome, ddd: cidade.ddd, idEstado: cidade.idEstado })
    } else {
      setForm({ nome: "", ddd: "", idEstado: 0 })
    }
  }, [cidade, isOpen])

  const estadosFiltrados = useMemo(() => {
    const t = searchEstado.toLowerCase()
    return estados
      .filter((e) => `${e.nome} ${e.uf}`.toLowerCase().includes(t))
      .sort((a, b) => a.nome.localeCompare(b.nome))
  }, [estados, searchEstado])

  const getNomeEstado = (id: number) => {
    const e = estados.find((x) => x.id === id)
    return e ? `${e.nome.toUpperCase()} - ${e.uf}` : "SELECIONE..."
  }

  const formatDate = (s?: string) => {
    if (!s) return ""
    const d = new Date(s)
    d.setHours(d.getHours() - 3)
    return d.toLocaleString("pt-BR")
  }

  async function handleSubmit() {
    try {
      const parsed = CidadeSchema.safeParse(form)
      if (!parsed.success) {
        toast.error('Preencha todos os campos corretamente')
        return
      }
      if (readOnly) return
      if (cidade) {
        await atualizarCidade(cidade.id, form)
      } else {
        await criarCidade(form)
      }
      await onSave() 
      onOpenChange(false)
    } catch(e) {
      toast.error('Erro ao salvar Cidade')
    }
  }

  return (
    <>
      <ModalEstados
        isOpen={modalEstadoOpen}
        onOpenChange={setModalEstadoOpen}
        onSave={onSave} 
      />

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {readOnly ? "VISUALIZAR CIDADE" : cidade ? "EDITAR CIDADE" : "NOVA CIDADE"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Input
              placeholder="NOME*"
              disabled={readOnly}
              className="uppercase"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value.toUpperCase() })}
            />
            <Input
              maxLength={3}
              placeholder="DDD*"
              disabled={readOnly}
              value={form.ddd}
              onChange={(e) => setForm({ ...form, ddd: e.target.value })}
            />

            <div>
              <label className="block text-sm mb-1">ESTADO*</label>
              <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={readOnly}
                    className="w-full justify-between uppercase font-normal"
                  >
                    {getNomeEstado(form.idEstado)}
                    {!readOnly && <ChevronDown className="ml-2 h-4 w-4" />}
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>SELECIONAR ESTADO</DialogTitle>
                  </DialogHeader>

                  <div className="flex items-center gap-2 pb-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="BUSCAR..."
                      value={searchEstado}
                      onChange={(e) => setSearchEstado(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {estadosFiltrados.map((e) => (
                      <Button
                        key={e.id}
                        variant={form.idEstado === e.id ? "default" : "outline"}
                        className="w-full justify-start font-normal uppercase"
                        onDoubleClick={() => {
                          setForm({ ...form, idEstado: e.id })
                          setSelectorOpen(false)
                        }}
                      >
                        {e.nome.toUpperCase()} ({e.uf})
                      </Button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <Button variant="secondary" onClick={() => { setSelectorOpen(false); setModalEstadoOpen(true) }}>
                      CADASTRAR NOVO ESTADO
                    </Button>
                    <Button variant="outline" onClick={() => setSelectorOpen(false)}>
                      VOLTAR
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <DialogFooter>
            <div className="text-xs text-muted-foreground mr-auto pl-1 space-y-0.5">
              {cidade && (
                <>
                  <div>DATA CRIAÇÃO: {formatDate(cidade.dataCriacao)}</div>
                  <div>DATA ATUALIZAÇÃO: {formatDate(cidade.dataAtualizacao)}</div>
                </>
              )}
            </div>

            {!readOnly && (
              <Button onClick={handleSubmit}>
                {cidade ? "ATUALIZAR" : "CADASTRAR"}
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">VOLTAR</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}