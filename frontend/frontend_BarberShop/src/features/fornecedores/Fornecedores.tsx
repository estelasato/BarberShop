import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Plus, Search, Edit, Trash, ChevronDown } from "lucide-react"
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
  Fornecedor, getFornecedores, criarFornecedor,
  atualizarFornecedor, deletarFornecedor,
} from "@/services/fornecedorService"
import { Cidade, getCidades, criarCidade } from "@/services/cidadeService"
import { Estado, getEstados, criarEstado } from "@/services/estadoService"
import { Pais, getPaises, criarPais } from "@/services/paisService"

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [paises, setPaises] = useState<Pais[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Fornecedor | null>(null)

  const [cidadeSelectorOpen, setCidadeSelectorOpen] = useState(false)
  const [novoCidadeModal, setNovoCidadeModal] = useState(false)
  const [estadoSelectorNovoCidade, setEstadoSelectorNovoCidade] = useState(false)
  const [novoEstadoModal, setNovoEstadoModal] = useState(false)
  const [paisSelectorNovoEstado, setPaisSelectorNovoEstado] = useState(false)
  const [novoPaisModal, setNovoPaisModal] = useState(false)

  const [form, setForm] = useState({
    nomeRazaoSocial: "",
    cpfCnpj: "",
    telefone: "",
    email: "",
    formaPagamentoId: 0,
    condicaoPagamentoId: 0,
    idCidade: 0,
    valorMinimoPedido: 0,
  })

  const [formNovoCidade, setFormNovoCidade] = useState({
    nome: "",
    ddd: "",
    idEstado: 0,
  })
  const [formNovoEstado, setFormNovoEstado] = useState({
    nome: "",
    uf: "",
    idPais: 0,
  })
  const [formNovoPais, setFormNovoPais] = useState({
    nome: "",
    sigla: "",
    ddi: "",
  })

  const getNomeCidade = (id: number) =>
    cidades.find((c) => c.id === id)?.nome || "-"
  const getNomeEstado = (id: number) =>
    estados.find((e) => e.id === id)?.nome || "-"
  const getNomePais = (id: number) =>
    paises.find((p) => p.id === id)?.nome || "-"

  async function carregar() {
    const [f, c, e, p] = await Promise.all([
      getFornecedores(),
      getCidades(),
      getEstados(),
      getPaises(),
    ])
    setFornecedores(f)
    setCidades(c)
    setEstados(e)
    setPaises(p)
    setLoading(false)
  }

  async function salvarFornecedor() {
    if (editing) {
      await atualizarFornecedor(editing.id, form)
    } else {
      await criarFornecedor(form)
    }
    setModalOpen(false)
    await carregar()
  }

  async function remover(id: number) {
    await deletarFornecedor(id)
    setFornecedores((prev) => prev.filter((f) => f.id !== id))
  }

  async function salvarCidade() {
    const novo = await criarCidade(formNovoCidade)
    const novas = await getCidades()
    setCidades(novas)
    setForm({ ...form, idCidade: novo.id })
    setNovoCidadeModal(false)
    setFormNovoCidade({ nome: "", ddd: "", idEstado: estados[0]?.id || 0 })
  }

  async function salvarEstado() {
    const novo = await criarEstado(formNovoEstado)
    const novos = await getEstados()
    setEstados(novos)
    setFormNovoCidade({ ...formNovoCidade, idEstado: novo.id })
    setNovoEstadoModal(false)
    setFormNovoEstado({ nome: "", uf: "", idPais: paises[0]?.id || 0 })
  }

  async function salvarPais() {
    const novo = await criarPais(formNovoPais)
    const novos = await getPaises()
    setPaises(novos)
    setFormNovoEstado({ ...formNovoEstado, idPais: novo.id })
    setNovoPaisModal(false)
    setFormNovoPais({ nome: "", sigla: "", ddi: "" })
  }

  const openCreate = () => {
    setEditing(null)
    setForm({
      nomeRazaoSocial: "",
      cpfCnpj: "",
      telefone: "",
      email: "",
      formaPagamentoId: 0,
      condicaoPagamentoId: 0,
      idCidade: cidades[0]?.id || 0,
      valorMinimoPedido: 0,
    })
    setModalOpen(true)
  }

  const openEdit = (f: Fornecedor) => {
    setEditing(f)
    setForm({
      nomeRazaoSocial: f.nomeRazaoSocial,
      cpfCnpj: f.cpfCnpj,
      telefone: f.telefone,
      email: f.email,
      formaPagamentoId: f.formaPagamentoId,
      condicaoPagamentoId: f.condicaoPagamentoId,
      idCidade: f.idCidade,
      valorMinimoPedido: f.valorMinimoPedido ?? 0,
    })
    setModalOpen(true)
  }

  useEffect(() => { carregar() }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Fornecedores</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Fornecedor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Fornecedores</CardTitle>
          <CardDescription>Cadastre, edite ou remova fornecedores.</CardDescription>
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
                  <TableHead>Nome / Razão Social</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fornecedores.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{f.id}</TableCell>
                    <TableCell>{f.nomeRazaoSocial}</TableCell>
                    <TableCell>{f.cpfCnpj}</TableCell>
                    <TableCell>{f.telefone}</TableCell>
                    <TableCell>{f.email}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEdit(f)}>
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
                              Excluir <strong>{f.nomeRazaoSocial}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => remover(f.id)}
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

      {/* modal fornecedor */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Fornecedor" : "Novo Fornecedor"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome / Razão Social</label>
              <Input value={form.nomeRazaoSocial}
                     onChange={(e) => setForm({ ...form, nomeRazaoSocial: e.target.value })}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CNPJ</label>
              <Input value={form.cpfCnpj}
                     onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Input value={form.telefone}
                     onChange={(e) => setForm({ ...form, telefone: e.target.value })}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={form.email}
                     onChange={(e) => setForm({ ...form, email: e.target.value })}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ID Forma de Pagamento</label>
              <Input type="number" value={form.formaPagamentoId}
                     onChange={(e) =>
                       setForm({ ...form, formaPagamentoId: Number(e.target.value) })}/>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ID Condição de Pagamento</label>
              <Input type="number" value={form.condicaoPagamentoId}
                     onChange={(e) =>
                       setForm({ ...form, condicaoPagamentoId: Number(e.target.value) })}/>
            </div>

            {/* seletor / cadastro de cidade */}
            <div>
              <label className="block text-sm font-medium mb-1">Cidade</label>
              <Dialog open={cidadeSelectorOpen} onOpenChange={setCidadeSelectorOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getNomeCidade(form.idCidade)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Selecionar Cidade</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[300px] overflow-auto space-y-1">
                    {cidades.map((c) => (
                      <Button key={c.id}
                              variant={form.idCidade === c.id ? "default" : "outline"}
                              className="w-full justify-start"
                              onDoubleClick={() => {
                                setForm({ ...form, idCidade: c.id })
                                setCidadeSelectorOpen(false)
                              }}>
                        {c.nome}
                      </Button>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Button variant="secondary" onClick={() => setNovoCidadeModal(true)}>
                      Cadastrar nova cidade
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Valor Mínimo de Pedido</label>
              <Input type="number" value={form.valorMinimoPedido ?? 0}
                     onChange={(e) =>
                       setForm({ ...form, valorMinimoPedido: Number(e.target.value) })}/>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={salvarFornecedor}>
              {editing ? "Atualizar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* modal nova cidade */}
      <Dialog open={novoCidadeModal} onOpenChange={setNovoCidadeModal}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Nova Cidade</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="Nome"
                   value={formNovoCidade.nome}
                   onChange={(e) =>
                     setFormNovoCidade({ ...formNovoCidade, nome: e.target.value })}/>
            <Input placeholder="DDD"
                   value={formNovoCidade.ddd}
                   onChange={(e) =>
                     setFormNovoCidade({ ...formNovoCidade, ddd: e.target.value })}/>

            {/* seletor estado */}
            <div>
              <label className="block text-sm font-medium mb-1">Estado</label>
              <Dialog open={estadoSelectorNovoCidade}
                      onOpenChange={setEstadoSelectorNovoCidade}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getNomeEstado(formNovoCidade.idEstado)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Selecionar Estado</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[300px] overflow-auto space-y-1">
                    {estados.map((e) => (
                      <Button key={e.id}
                              variant={formNovoCidade.idEstado === e.id ? "default" : "outline"}
                              className="w-full justify-start"
                              onDoubleClick={() => {
                                setFormNovoCidade({ ...formNovoCidade, idEstado: e.id })
                                setEstadoSelectorNovoCidade(false)
                              }}>
                        {e.nome} ({e.uf}) – {getNomePais(e.idPais)}
                      </Button>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Button variant="secondary" onClick={() => setNovoEstadoModal(true)}>
                      Cadastrar novo estado
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
            <Button onClick={salvarCidade}>Salvar Cidade</Button>
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
            <Input placeholder="Nome"
                   value={formNovoEstado.nome}
                   onChange={(e) =>
                     setFormNovoEstado({ ...formNovoEstado, nome: e.target.value })}/>
            <Input placeholder="UF" maxLength={2}
                   value={formNovoEstado.uf}
                   onChange={(e) =>
                     setFormNovoEstado({ ...formNovoEstado, uf: e.target.value.toUpperCase() })}/>

            {/* seletor país */}
            <div>
              <label className="block text-sm font-medium mb-1">País</label>
              <Dialog open={paisSelectorNovoEstado}
                      onOpenChange={setPaisSelectorNovoEstado}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {getNomePais(formNovoEstado.idPais)}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Selecionar País</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[300px] overflow-auto space-y-1">
                    {paises.map((p) => (
                      <Button key={p.id}
                              variant={formNovoEstado.idPais === p.id ? "default" : "outline"}
                              className="w-full justify-start"
                              onDoubleClick={() => {
                                setFormNovoEstado({ ...formNovoEstado, idPais: p.id })
                                setPaisSelectorNovoEstado(false)
                              }}>
                        {p.nome} ({p.sigla})
                      </Button>
                    ))}
                  </div>
                  <div className="pt-4">
                    <Button variant="secondary" onClick={() => setNovoPaisModal(true)}>
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
            <Input placeholder="Nome"
                   value={formNovoPais.nome}
                   onChange={(e) =>
                     setFormNovoPais({ ...formNovoPais, nome: e.target.value })}/>
            <Input placeholder="Sigla" maxLength={2}
                   value={formNovoPais.sigla}
                   onChange={(e) =>
                     setFormNovoPais({ ...formNovoPais, sigla: e.target.value.toUpperCase() })}/>
            <Input placeholder="DDI"
                   value={formNovoPais.ddi}
                   onChange={(e) =>
                     setFormNovoPais({ ...formNovoPais, ddi: e.target.value })}/>
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
