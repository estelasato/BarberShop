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
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { Cidade, criarCidade, atualizarCidade } from "@/services/cidadeService"
import { Estado, getEstados } from "@/services/estadoService"
import { ModalEstados } from "@/components/modals/ModalEstados"

interface ModalCidadesProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  cidade?: Cidade | null
  onSave: () => void
  readOnly?: boolean
}

export function ModalCidades({
  isOpen,
  onOpenChange,
  cidade,
  onSave,
  readOnly = false,
}: ModalCidadesProps) {
  const [formData, setFormData] = useState({ nome: "", ddd: "", idEstado: 0 })
  const [estados, setEstados] = useState<Estado[]>([])
  const [modalEstadoOpen, setModalEstadoOpen] = useState(false)
  const [selectorOpen, setSelectorOpen] = useState(false)

  useEffect(() => {
    ;(async () => setEstados(await getEstados()))()
  }, [])

  useEffect(() => {
    if (cidade) {
      setFormData({
        nome: cidade.nome,
        ddd: cidade.ddd,
        idEstado: cidade.idEstado,
      })
    } else {
      setFormData({ nome: "", ddd: "", idEstado: 0 })
    }
  }, [cidade])

  const getNomeEstado = (id: number) => {
    const e = estados.find((x) => x.id === id)
    return e ? `${e.nome.toUpperCase()} - ${e.uf}` : "SELECIONE..."
  }

  const formatDateUTC3 = (s?: string) => {
    if (!s) return ""
    const d = new Date(s)
    d.setHours(d.getHours() - 3)
    return d.toLocaleString("pt-BR")
  }

  async function handleSubmit() {
    if (readOnly) return
    if (cidade) await atualizarCidade(cidade.id, formData)
    else await criarCidade(formData)
    onOpenChange(false)
    onSave()
  }

  return (
    <>
      <ModalEstados
        isOpen={modalEstadoOpen}
        onOpenChange={setModalEstadoOpen}
        onSave={async () => setEstados(await getEstados())}
      />

      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {readOnly
                ? "Visualizar Cidade"
                : cidade
                ? "Editar Cidade"
                : "Nova Cidade"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Input
              placeholder="Nome"
              disabled={readOnly}
              className="uppercase"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value.toUpperCase() })
              }
            />
            <Input
              placeholder="DDD"
              disabled={readOnly}
              value={formData.ddd}
              onChange={(e) =>
                setFormData({ ...formData, ddd: e.target.value })
              }
            />

            <div>
              <label className="block text-sm mb-1">Estado</label>
              <Dialog open={selectorOpen} onOpenChange={setSelectorOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={readOnly}
                    className="w-full justify-between font-normal uppercase"
                  >
                    {getNomeEstado(formData.idEstado)}
                    {!readOnly && <ChevronDown className="ml-2 h-4 w-4" />}
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Selecionar Estado</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {estados.map((e) => (
                      <Button
                        key={e.id}
                        variant={
                          formData.idEstado === e.id ? "default" : "outline"
                        }
                        className="w-full justify-start font-normal uppercase"
                        onDoubleClick={() => {
                          setFormData({ ...formData, idEstado: e.id })
                          setSelectorOpen(false)
                        }}
                      >
                        {e.nome.toUpperCase()} ({e.uf})
                      </Button>
                    ))}
                  </div>

                  <div className="pt-4 flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectorOpen(false)
                        setModalEstadoOpen(true)
                      }}
                    >
                      Cadastrar novo estado
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectorOpen(false)}
                    >
                      Voltar
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
                  <div>Data Criação: {formatDateUTC3(cidade.dataCriacao)}</div>
                  <div>Data Atualização: {formatDateUTC3(cidade.dataAtualizacao)}</div>
                </>
              )}
            </div>

            {!readOnly && (
              <Button onClick={handleSubmit}>
                {cidade ? "Atualizar" : "Cadastrar"}
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">Voltar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
