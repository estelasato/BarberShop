import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Plus,
  Search,
  Edit,
  Trash,
  ChevronDown,
} from "lucide-react"

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
  getCidades,
  criarCidade,
  atualizarCidade,
  deletarCidade,
  Cidade,
} from "@/services/cidadeService"
import {
  getEstados,
  criarEstado,
  Estado,
} from "@/services/estadoService"
import { getPaises, criarPais, Pais } from "@/services/paisService"

export default function CidadesPage() {
  /* ---------------- state -------------- */
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [paises, setPaises] = useState<Pais[]>([])
  const [loading, setLoading] = useState(true)

  /* modal cidade */
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCidade, setEditingCidade] = useState<Cidade | null>(null)
  const [formCidade, setFormCidade] = useState({ nome: "", ddd: "", idEstado: 0 })

  /* seletor de estado dentro do modal cidade */
  const [estadoSelectorOpen, setEstadoSelectorOpen] = useState(false)

  /* modal novo estado */
  const [novoEstadoModal, setNovoEstadoModal] = useState(false)
  const [formNovoEstado, setFormNovoEstado] = useState({ nome: "", uf: "", idPais: 0 })

  /* seletor de país dentro do modal novo estado */
  const [paisSelectorOpen, setPaisSelectorOpen] = useState(false)

  /* modal novo país */
  const [novoPaisModal, setNovoPaisModal] = useState(false)
  const [formNovoPais, setFormNovoPais] = useState({ nome: "", sigla: "", ddi: "" })

  /* ---------------- helpers -------------- */
  function getNomeEstado(id: number) {
    return estados.find((e) => e.id === id)?.nome || "-"
  }

  function getNomePais(id: number) {
    return paises.find((p) => p.id === id)?.nome || "-"
  }

  function getPaisPorEstado(idEstado: number) {
    const est = estados.find((e) => e.id === idEstado)
    return getNomePais(est?.idPais ?? 0)
  }

  /* ---------------- CRUD -------------- */
  async function carregarDados() {
    try {
      const [cData, eData, pData] = await Promise.all([
        getCidades(),
        getEstados(),
        getPaises(),
      ])
      setCidades(cData)
      setEstados(eData)
      setPaises(pData)
    } catch (err) {
      console.error("Erro ao buscar dados:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: number) {
    try {
      await deletarCidade(id)
      setCidades((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error("Erro ao excluir cidade:", err)
    }
  }

  async function salvarCidade() {
    try {
      if (editingCidade) {
        await atualizarCidade(editingCidade.id, formCidade)
      } else {
        await criarCidade(formCidade)
      }
      setModalOpen(false)
      await carregarDados()
    } catch (err) {
      console.error("Erro ao salvar cidade:", err)
    }
  }

  async function salvarEstado() {
    try {
      const novo = await criarEstado(formNovoEstado)
      const novosEstados = await getEstados()
      setEstados(novosEstados)
      setFormCidade((prev) => ({ ...prev, idEstado: novo.id }))
      setNovoEstadoModal(false)
      setFormNovoEstado({ nome: "", uf: "", idPais: paises[0]?.id || 0 })
    } catch (err) {
      console.error("Erro ao salvar estado:", err)
    }
  }

  async function salvarPais() {
    try {
      const novo = await criarPais(formNovoPais)
      const novosPaises = await getPaises()
      setPaises(novosPaises)
      setFormNovoEstado((prev) => ({ ...prev, idPais: novo.id }))
      setNovoPaisModal(false)
      setFormNovoPais({ nome: "", sigla: "", ddi: "" })
    } catch (err) {
      console.error("Erro ao salvar país:", err)
    }
  }

  /* ---------------- abrir modais -------------- */
  function openCreateModal() {
    setEditingCidade(null)
    setFormCidade({ nome: "", ddd: "", idEstado: estados[0]?.id || 0 })
    setModalOpen(true)
  }

  function openEditModal(c: Cidade) {
    setEditingCidade(c)
    setFormCidade({ nome: c.nome, ddd: c.ddd, idEstado: c.idEstado })
    setModalOpen(true)
  }

  /* mount */
  useEffect(() => {
    carregarDados()
  }, [])

  /* ---------------- UI -------------- */
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* header */}
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Cidades</h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Cidade
        </Button>
      </div>

      {/* tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Cidades</CardTitle>
          <CardDescription>
            Lista de todas as cidades cadastradas no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cidade..."
                  className="pl-8 w-[300px]"
                />
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
                  <TableHead>Estado</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cidades.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.nome}</TableCell>
                    <TableCell>{getNomeEstado(c.idEstado)}</TableCell>
                    <TableCell>{getPaisPorEstado(c.idEstado)}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(c)}
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
                              Deseja excluir a cidade <strong>{c.nome}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(c.id)}
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

      {/* modal cidade */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>
              {editingCidade ? "Editar Cidade" : "Nova Cidade"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Nome"
              value={formCidade.nome}
              onChange={(e) =>
                setFormCidade({ ...formCidade, nome: e.target.value })
              }
            />
            <Input
              placeholder="DDD"
              value={formCidade.ddd}
              onChange={(e) =>
                setFormCidade({ ...formCidade, ddd: e.target.value })
              }
            />

            {/* estado (com botão cadastrar novo) */}
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <Dialog
                open={estadoSelectorOpen}
                onOpenChange={setEstadoSelectorOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getNomeEstado(formCidade.idEstado)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-6xl">
                  <DialogHeader>
                    <DialogTitle>Selecionar Estado</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {estados.map((e) => (
                      <Button
                        key={e.id}
                        variant={
                          formCidade.idEstado === e.id ? "default" : "outline"
                        }
                        className="w-full justify-start"
                        onDoubleClick={() => {
                          setFormCidade({ ...formCidade, idEstado: e.id })
                          setEstadoSelectorOpen(false)
                        }}
                      >
                        {e.nome} ({e.uf}) – {getNomePais(e.idPais)}
                      </Button>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setNovoEstadoModal(true)}
                    >
                      Cadastrar novo estado
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <p className="mt-2 text-sm text-muted-foreground">
                País: <span className="font-medium">{getPaisPorEstado(formCidade.idEstado)}</span>
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={salvarCidade}>
              {editingCidade ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* modal novo estado */}
      <Dialog open={novoEstadoModal} onOpenChange={setNovoEstadoModal}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Novo Estado</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Nome"
              value={formNovoEstado.nome}
              onChange={(e) =>
                setFormNovoEstado({ ...formNovoEstado, nome: e.target.value })
              }
            />
            <Input
              placeholder="UF"
              maxLength={2}
              value={formNovoEstado.uf}
              onChange={(e) =>
                setFormNovoEstado({ ...formNovoEstado, uf: e.target.value })
              }
            />

            {/* país seletor dentro do novo estado */}
            <div>
              <label className="block text-sm font-medium mb-1">País</label>
              <Dialog
                open={paisSelectorOpen}
                onOpenChange={setPaisSelectorOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getNomePais(formNovoEstado.idPais)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Selecionar País</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {paises.map((p) => (
                      <Button
                        key={p.id}
                        variant={
                          formNovoEstado.idPais === p.id ? "default" : "outline"
                        }
                        className="w-full justify-start"
                        onDoubleClick={() => {
                          setFormNovoEstado({ ...formNovoEstado, idPais: p.id })
                          setPaisSelectorOpen(false)
                        }}
                      >
                        {p.nome} ({p.sigla})
                      </Button>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Button
                      variant="secondary"
                      onClick={() => setNovoPaisModal(true)}
                    >
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
            <Button onClick={salvarEstado}>Salvar Estado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* modal novo país */}
      <Dialog open={novoPaisModal} onOpenChange={setNovoPaisModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Novo País</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Nome"
              value={formNovoPais.nome}
              onChange={(e) =>
                setFormNovoPais({ ...formNovoPais, nome: e.target.value })
              }
            />
            <Input
              placeholder="Sigla"
              maxLength={2}
              value={formNovoPais.sigla}
              onChange={(e) =>
                setFormNovoPais({ ...formNovoPais, sigla: e.target.value })
              }
            />
            <Input
              placeholder="DDI"
              value={formNovoPais.ddi}
              onChange={(e) =>
                setFormNovoPais({ ...formNovoPais, ddi: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={salvarPais}>Salvar País</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
