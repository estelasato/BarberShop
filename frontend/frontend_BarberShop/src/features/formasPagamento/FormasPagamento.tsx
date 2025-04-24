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
import { Switch } from "@/components/ui/switch"

import {
  FormaPagamento, getFormasPagamento, criarFormaPagamento,
  atualizarFormaPagamento, deletarFormaPagamento,
} from "@/services/formaPagamentoService"

export default function FormasPagamento() {
  const [formas, setFormas] = useState<FormaPagamento[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<FormaPagamento | null>(null)
  const [form, setForm] = useState({
    descricao: "",
    tipo: "",
    ativo: true,
  })

  async function carregar() {
    const data = await getFormasPagamento()
    setFormas(data)
    setLoading(false)
  }

  async function salvar() {
    if (editing) {
      await atualizarFormaPagamento(editing.id, form)
    } else {
      await criarFormaPagamento(form)
    }
    setModalOpen(false)
    await carregar()
  }

  async function remover(id: number) {
    await deletarFormaPagamento(id)
    setFormas((prev) => prev.filter((f) => f.id !== id))
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ descricao: "", tipo: "", ativo: true })
    setModalOpen(true)
  }

  const openEdit = (fp: FormaPagamento) => {
    setEditing(fp)
    setForm({ descricao: fp.descricao, tipo: fp.tipo, ativo: fp.ativo })
    setModalOpen(true)
  }

  useEffect(() => { carregar() }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Formas de Pagamento</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Forma
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Formas de Pagamento</CardTitle>
          <CardDescription>Cadastre, edite ou desative formas de pagamento.</CardDescription>
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formas.map((fp) => (
                  <TableRow key={fp.id}>
                    <TableCell>{fp.id}</TableCell>
                    <TableCell>{fp.descricao}</TableCell>
                    <TableCell>{fp.tipo}</TableCell>
                    <TableCell>{fp.ativo ? "Sim" : "Não"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(fp)}>
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
                              Excluir <strong>{fp.descricao}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => remover(fp.id)}
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
            <DialogTitle>{editing ? "Editar Forma de Pagamento" : "Nova Forma de Pagamento"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <Input
                placeholder="Nome da forma"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <Input
                placeholder="avista / credito / debito..."
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="ativo"
                checked={form.ativo}
                onCheckedChange={(v) => setForm({ ...form, ativo: v })}
              />
              <label htmlFor="ativo" className="text-sm">Ativo</label>
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
