import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Plus, Search, Edit, Trash } from "lucide-react"

import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog"

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogClose, DialogTrigger,
} from "@/components/ui/dialog"

import {
  CondicaoPagamento,
  getCondicoesPagamento,
  criarCondicaoPagamento,
  atualizarCondicaoPagamento,
  deletarCondicaoPagamento,
} from "@/services/condicaoPagamentoService"

export default function CondicoesPagamento() {
  const [condicoes, setCondicoes] = useState<CondicaoPagamento[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CondicaoPagamento | null>(null)
  const [form, setForm] = useState({
    descricao: "",
    taxaJuros: 0,
    multa: 0,
  })

  async function carregar() {
    const data = await getCondicoesPagamento()
    setCondicoes(data)
    setLoading(false)
  }

  async function salvar() {
    if (editing) {
      await atualizarCondicaoPagamento(editing.id, form)
    } else {
      await criarCondicaoPagamento(form)
    }
    setModalOpen(false)
    await carregar()
  }

  async function remover(id: number) {
    await deletarCondicaoPagamento(id)
    setCondicoes((prev) => prev.filter((c) => c.id !== id))
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ descricao: "", taxaJuros: 0, multa: 0 })
    setModalOpen(true)
  }

  const openEdit = (c: CondicaoPagamento) => {
    setEditing(c)
    setForm({ descricao: c.descricao, taxaJuros: c.taxaJuros, multa: c.multa })
    setModalOpen(true)
  }

  useEffect(() => { carregar() }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Condições de Pagamento</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Condição
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Condições de Pagamento</CardTitle>
          <CardDescription>Cadastre ou edite condições de pagamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 pb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="pl-8 w-[300px]" />
            </div>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Juros (%)</TableHead>
                  <TableHead>Multa (%)</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {condicoes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.descricao}</TableCell>
                    <TableCell>{c.taxaJuros}</TableCell>
                    <TableCell>{c.multa}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(c)}>
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Excluir <strong>{c.descricao}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => remover(c.id)}
                              className="bg-destructive text-white hover:bg-destructive/90"
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* modal criar/editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Condição" : "Nova Condição"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <Input
                placeholder="Descrição"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Taxa de Juros (%)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.taxaJuros}
                onChange={(e) => setForm({ ...form, taxaJuros: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Multa (%)</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.multa}
                onChange={(e) => setForm({ ...form, multa: Number(e.target.value) })}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={salvar}>
              {editing ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
