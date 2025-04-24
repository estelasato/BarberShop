import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash } from "lucide-react"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  getPaises,
  deletarPais,
  criarPais,
  atualizarPais,
  Pais,
} from "@/services/paisService"

export default function PaisesPage() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPais, setEditingPais] = useState<Pais | null>(null)
  const [formData, setFormData] = useState({ nome: "", sigla: "", ddi: "" })

  async function carregarPaises() {
    try {
      const data = await getPaises()
      setPaises(data)
    } catch (err) {
      console.error("Erro ao buscar países:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletarPais(id)
      setPaises((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error("Erro ao excluir país:", err)
    }
  }

  function openCreateModal() {
    setEditingPais(null)
    setFormData({ nome: "", sigla: "", ddi: "" })
    setModalOpen(true)
  }

  function openEditModal(pais: Pais) {
    setEditingPais(pais)
    setFormData({ nome: pais.nome, sigla: pais.sigla, ddi: pais.ddi })
    setModalOpen(true)
  }

  async function handleSubmit() {
    try {
      if (editingPais) {
        await atualizarPais(editingPais.id, formData)
      } else {
        await criarPais(formData)
      }
      setModalOpen(false)
      await carregarPaises()
    } catch (err) {
      console.error("Erro ao salvar país:", err)
    }
  }

  useEffect(() => {
    carregarPaises()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Países</h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Novo País
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Países</CardTitle>
          <CardDescription>Lista de todos os países cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar país..." className="pl-8 w-[300px]" />
              </div>
            </div>
          </div>

          {loading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Sigla</TableHead>
                  <TableHead>DDI</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paises.map((pais) => (
                  <TableRow key={pais.id}>
                    <TableCell>{pais.id}</TableCell>
                    <TableCell>{pais.nome}</TableCell>
                    <TableCell>{pais.sigla}</TableCell>
                    <TableCell>{pais.ddi}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(pais)}
                      >
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
                              Deseja realmente excluir o país <strong>{pais.nome}</strong>? Esta ação não poderá ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(pais.id)}
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPais ? "Editar País" : "Novo País"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium">Nome</label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Sigla</label>
              <Input
                value={formData.sigla}
                maxLength={2}
                onChange={(e) => setFormData({ ...formData, sigla: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">DDI</label>
              <Input
                value={formData.ddi}
                onChange={(e) => setFormData({ ...formData, ddi: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>
              {editingPais ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
