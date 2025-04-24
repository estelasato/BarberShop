import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash, ChevronDown } from "lucide-react"
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  getEstados,
  deletarEstado,
  criarEstado,
  atualizarEstado,
  Estado,
} from "@/services/estadoService"
import { getPaises, criarPais, Pais } from "@/services/paisService"

export default function EstadosPage() {
  const [estados, setEstados] = useState<Estado[]>([])
  const [paises, setPaises] = useState<Pais[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [novoPaisModal, setNovoPaisModal] = useState(false)
  const [editingEstado, setEditingEstado] = useState<Estado | null>(null)
  const [formData, setFormData] = useState({ nome: "", uf: "", idPais: 0 })
  const [novoPais, setNovoPais] = useState({ nome: "", sigla: "", ddi: "" })
  const [paisSelectorOpen, setPaisSelectorOpen] = useState(false)

  async function carregarDados() {
    try {
      const [estadosData, paisesData] = await Promise.all([getEstados(), getPaises()])
      setEstados(estadosData)
      setPaises(paisesData)
    } catch (err) {
      console.error("Erro ao buscar dados:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletarEstado(id)
      setEstados((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      console.error("Erro ao excluir estado:", err)
    }
  }

  function openCreateModal() {
    setEditingEstado(null)
    setFormData({ nome: "", uf: "", idPais: paises[0]?.id || 0 })
    setModalOpen(true)
  }

  function openEditModal(estado: Estado) {
    setEditingEstado(estado)
    setFormData({ nome: estado.nome, uf: estado.uf, idPais: estado.idPais })
    setModalOpen(true)
  }

  async function handleSubmit() {
    try {
      if (editingEstado) {
        await atualizarEstado(editingEstado.id, formData)
      } else {
        await criarEstado(formData)
      }
      setModalOpen(false)
      await carregarDados()
    } catch (err) {
      console.error("Erro ao salvar estado:", err)
    }
  }

  async function handleCriarPais() {
    try {
      const paisCriado = await criarPais(novoPais)
      const atualizados = await getPaises()
      setPaises(atualizados)
      setFormData((prev) => ({ ...prev, idPais: paisCriado.id }))
      setNovoPaisModal(false)
      setNovoPais({ nome: "", sigla: "", ddi: "" })
    } catch (err) {
      console.error("Erro ao criar país:", err)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function getNomePais(id: number) {
    return paises.find(p => p.id === id)?.nome || "-"
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Estados</h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Estado
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Estados</CardTitle>
          <CardDescription>Lista de todos os estados cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar estado..." className="pl-8 w-[300px]" />
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
                  <TableHead>UF</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estados.map((estado) => (
                  <TableRow key={estado.id}>
                    <TableCell>{estado.id}</TableCell>
                    <TableCell>{estado.nome}</TableCell>
                    <TableCell>{estado.uf}</TableCell>
                    <TableCell>{getNomePais(estado.idPais)}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditModal(estado)}>
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
                              Deseja excluir o estado <strong>{estado.nome}</strong>? Essa ação é irreversível.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(estado.id)}
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
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>{editingEstado ? "Editar Estado" : "Novo Estado"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            />
            <Input
              placeholder="UF"
              maxLength={2}
              value={formData.uf}
              onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium mb-1">País</label>
              <Dialog open={paisSelectorOpen} onOpenChange={setPaisSelectorOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getNomePais(formData.idPais)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl">
                  <DialogHeader>
                    <DialogTitle>Selecionar ou Cadastrar País</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {paises.map((pais) => (
                      <Button
                        key={pais.id}
                        variant={formData.idPais === pais.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onDoubleClick={() => {
                          setFormData({ ...formData, idPais: pais.id })
                          setPaisSelectorOpen(false)
                        }}
                      >
                        {pais.nome} ({pais.sigla})
                      </Button>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Button onClick={() => setNovoPaisModal(true)} variant="secondary">
                      Cadastrar novo país
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSubmit}>
              {editingEstado ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={novoPaisModal} onOpenChange={setNovoPaisModal}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo País</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Nome"
              value={novoPais.nome}
              onChange={(e) => setNovoPais({ ...novoPais, nome: e.target.value })}
            />
            <Input
              placeholder="Sigla"
              maxLength={2}
              value={novoPais.sigla}
              onChange={(e) => setNovoPais({ ...novoPais, sigla: e.target.value })}
            />
            <Input
              placeholder="DDI"
              value={novoPais.ddi}
              onChange={(e) => setNovoPais({ ...novoPais, ddi: e.target.value })}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleCriarPais}>Salvar País</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
