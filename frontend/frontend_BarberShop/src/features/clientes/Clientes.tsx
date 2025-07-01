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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Plus, Search, Edit, Trash, Eye, ChevronDown } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Cliente,
  getClientes,
  criarCliente,
  atualizarCliente,
  deletarCliente,
  CreateClienteDto,
  UpdateClienteDto,
} from "@/services/clienteService"
import { Cidade, getCidades } from "@/services/cidadeService"
import { Estado, getEstados } from "@/services/estadoService"
import {
  CondicaoPagamento,
  getCondicoesPagamento,
} from "@/services/condicaoPagamentoService"
import { ModalCidades } from "@/components/modals/ModalCidades"
import { ModalCondicaoPagamento } from "@/components/modals/ModalCondicaoPagamento"
import { buildClienteSchema } from "@/schemas/clienteSchema"

export default function Clientes() {
  const mockClientes: Cliente[] = [
    {
      id: 1,
      nome: "JOÃO DA SILVA",
      cpfCnpj: "12345678901",
      pf: true,
      sexo: "M",
      dataNascimento: "1990-05-10",
      email: "joao.silva@hotmail.com",
      telefone: "(45) 99876-1234",
      rua: "RUA DAS FLORES",
      numero: "100",
      complemento: "",
      bairro: "CENTRO",
      cep: "85851-000",
      idCidade: 1,
      idCondicaoPagamento: 1,
      limiteCredito: 1500,
      ativo: true,
      dataCriacao: "2025-06-01T12:00:00Z",
      dataAtualizacao: "2025-06-10T14:30:00Z",
    },
    {
      id: 2,
      nome: "MARIA DE SOUZA",
      cpfCnpj: "98765432100",
      pf: true,
      sexo: "F",
      dataNascimento: "1985-08-20",
      email: "maria.souza@gmail.com",
      telefone: "(45) 98765-4321",
      rua: "AVENIDA PARANÁ",
      numero: "200",
      complemento: "APTO 302",
      bairro: "JARDIM",
      cep: "85852-000",
      idCidade: 1,
      idCondicaoPagamento: 1,
      limiteCredito: 2500,
      ativo: true,
      dataCriacao: "2025-05-15T09:00:00Z",
      dataAtualizacao: "2025-06-12T16:00:00Z",
    },
    {
      id: 3,
      nome: "EMPRESA TESTE LTDA",
      cpfCnpj: "12345678000190",
      pf: false,
      sexo: "M",
      dataNascimento: "",
      email: "contato@teste.com.br",
      telefone: "(45) 3344-5566",
      rua: "RUA INDUSTRIAL",
      numero: "500",
      complemento: "GALPÃO",
      bairro: "INDUSTRIAL",
      cep: "85853-000",
      idCidade: 1,
      idCondicaoPagamento: 1,
      limiteCredito: 10000,
      ativo: true,
      dataCriacao: "2025-04-01T08:30:00Z",
      dataAtualizacao: "2025-06-11T11:15:00Z",
    },
  ]

  const mockCidades: Cidade[] = [
    { id: 1, nome: "FOZ DO IGUAÇU", ddd: "45", idEstado: 1, dataCriacao: "", dataAtualizacao: "" },
  ]

  const mockEstados: Estado[] = [
    { id: 1, nome: "PARANÁ", uf: "PR", idPais: 1, dataCriacao: "", dataAtualizacao: "" },
  ]

  const mockCondicoes: CondicaoPagamento[] = [
    {
      id: 1,
      descricao: "A VISTA",
      taxaJuros: 0,
      multa: 0,
      desconto: 5,
      parcelas: [],
      dataCriacao: "",
      dataAtualizacao: "",
    },
  ]

  const [clientes, setClientes] = useState<Cliente[]>(mockClientes)
  const [cidades, setCidades] = useState<Cidade[]>(mockCidades)
  const [estados, setEstados] = useState<Estado[]>(mockEstados)
  const [condicoes, setCondicoes] = useState<CondicaoPagamento[]>(mockCondicoes)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [readOnly, setReadOnly] = useState(false)
  const [citySelectorOpen, setCitySelectorOpen] = useState(false)
  const [condSelectorOpen, setCondSelectorOpen] = useState(false)
  const [modalCidadeOpen, setModalCidadeOpen] = useState(false)
  const [modalCondOpen, setModalCondOpen] = useState(false)
  const [searchCidade, setSearchCidade] = useState("")
  const [form, setForm] = useState<CreateClienteDto>({
    nome: "",
    cpfCnpj: "",
    pf: true,
    sexo: "M",
    dataNascimento: "",
    email: "",
    telefone: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    idCidade: 0,
    idCondicaoPagamento: 0,
    limiteCredito: 0,
    ativo: true,
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  async function carregar() {
    try {
      const [cli, cid, est, cp] = await Promise.all([
        getClientes(),
        getCidades(),
        getEstados(),
        getCondicoesPagamento(),
      ])
      setClientes(cli.length ? cli : mockClientes)
      setCidades(cid.length ? cid : mockCidades)
      setEstados(est.length ? est : mockEstados)
      setCondicoes(cp.length ? cp : mockCondicoes)
    } catch {
      setClientes(mockClientes)
      setCidades(mockCidades)
      setEstados(mockEstados)
      setCondicoes(mockCondicoes)
    }
    setLoading(false)
  }

  async function salvar() {
    const estadoSel = estados.find(
      (e) => e.id === cidades.find((c) => c.id === form.idCidade)?.idEstado,
    )
    const isBrasil = estadoSel?.idPais === 1
    const schema = buildClienteSchema(isBrasil)
    const parse = schema.safeParse(form)
    if (!parse.success) {
      setErrors(parse.error.flatten().fieldErrors)
      return
    }
    if (editing) await atualizarCliente(editing.id, form as UpdateClienteDto)
    else await criarCliente(form as CreateClienteDto)
    setModalOpen(false)
    await carregar()
  }

  async function remover(id: number) {
    await deletarCliente(id)
    setClientes((prev) => prev.filter((c) => c.id !== id))
  }

  function openCreate() {
    setEditing(null)
    setReadOnly(false)
    setForm({
      nome: "",
      cpfCnpj: "",
      pf: true,
      sexo: "M",
      dataNascimento: "",
      email: "",
      telefone: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      idCidade: 0,
      idCondicaoPagamento: 0,
      limiteCredito: 0,
      ativo: true,
    })
    setModalOpen(true)
    setErrors({})
  }

  function openEdit(c: Cliente) {
    setEditing(c)
    setReadOnly(false)
    setForm({ ...c })
    setModalOpen(true)
    setErrors({})
  }

  function openView(c: Cliente) {
    setEditing(c)
    setReadOnly(true)
    setForm({ ...c })
    setModalOpen(true)
    setErrors({})
  }

  function formatDateUTC3(s?: string) {
    if (!s) return ""
    const d = new Date(s)
    d.setHours(d.getHours() - 3)
    return d.toLocaleString("pt-BR")
  }

  function getCidadeUf(id: number) {
    const cid = cidades.find((c) => c.id === id)
    const est = estados.find((e) => e.id === cid?.idEstado)
    return cid && est ? `${cid.nome.toUpperCase()} - ${est.uf}` : "N/A"
  }

  const getNomeCondicao = (id: number) =>
    condicoes.find((c) => c.id === id)?.descricao.toUpperCase() || "SELECIONE..."

  const cidadesFiltradas = useMemo(() => {
    const texto = searchCidade.toLowerCase()
    return cidades
      .filter((c) => getCidadeUf(c.id).toLowerCase().includes(texto))
      .sort((a, b) => getCidadeUf(a.id).localeCompare(getCidadeUf(b.id)))
  }, [cidades, searchCidade, estados])

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ModalCidades
        isOpen={modalCidadeOpen}
        onOpenChange={setModalCidadeOpen}
        onSave={async () => setCidades(await getCidades())}
      />
      <ModalCondicaoPagamento
        isOpen={modalCondOpen}
        onOpenChange={setModalCondOpen}
        condicao={null}
        onSave={async () => setCondicoes(await getCondicoesPagamento())}
      />
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Clientes</CardTitle>
          <CardDescription>Cadastre, edite ou remova clientes.</CardDescription>
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
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Cidade - UF</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.nome}</TableCell>
                    <TableCell>{c.cpfCnpj}</TableCell>
                    <TableCell>{getCidadeUf(c.idCidade)}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>
                      <span className={c.ativo ? "text-green-600" : "text-red-600"}>
                        {c.ativo ? "HABILITADO" : "DESABILITADO"}
                      </span>
                    </TableCell>
                    <TableCell className="flex justify-center items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => openView(c)}>
                        <Eye className="h-4 w-4" />
                      </Button>
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
                              Excluir <span className="uppercase">{c.nome}</span>?
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
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-7xl w-full">
          <DialogHeader>
            <DialogTitle>
              {editing ? (readOnly ? "Visualizar Cliente" : "Editar Cliente") : "Novo Cliente"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4 text-sm">
            <div className="col-span-1 flex flex-col">
              <label>Tipo</label>
              <select
                disabled={readOnly}
                className={`w-full border rounded px-2 py-1 ${
                  errors.pf ? "border-destructive" : ""
                }`}
                value={form.pf ? "pf" : "pj"}
                onChange={(e) => setForm({ ...form, pf: e.target.value === "pf" })}
              >
                <option value="pf">PESSOA FÍSICA</option>
                <option value="pj">PESSOA JURÍDICA</option>
              </select>
              {errors.pf && <span className="text-xs text-destructive">{errors.pf[0]}</span>}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Sexo</label>
              <select
                disabled={readOnly}
                className={`w-full border rounded px-2 py-1 ${
                  errors.sexo ? "border-destructive" : ""
                }`}
                value={form.sexo}
                onChange={(e) => setForm({ ...form, sexo: e.target.value as "M" | "F" })}
              >
                <option value="M">MASCULINO</option>
                <option value="F">FEMININO</option>
              </select>
              {errors.sexo && <span className="text-xs text-destructive">{errors.sexo[0]}</span>}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Data de Nascimento</label>
              <Input
                type="date"
                disabled={readOnly}
                value={form.dataNascimento}
                className={errors.dataNascimento ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
              />
              {errors.dataNascimento && (
                <span className="text-xs text-destructive">{errors.dataNascimento[0]}</span>
              )}
            </div>
            <div className="col-span-3 flex flex-col">
              <label>Nome / Razão Social</label>
              <Input
                placeholder="NOME COMPLETO"
                disabled={readOnly}
                value={form.nome}
                className={errors.nome ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
              {errors.nome && <span className="text-xs text-destructive">{errors.nome[0]}</span>}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>CPF/CNPJ</label>
              <Input
                placeholder="SOMENTE NÚMEROS"
                disabled={readOnly}
                value={form.cpfCnpj}
                className={errors.cpfCnpj ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })}
              />
              {errors.cpfCnpj && (
                <span className="text-xs text-destructive">{errors.cpfCnpj[0]}</span>
              )}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Telefone</label>
              <Input
                placeholder="(DDD) 99999-9999"
                disabled={readOnly}
                value={form.telefone ?? ""}
                className={errors.telefone ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
              />
              {errors.telefone && (
                <span className="text-xs text-destructive">{errors.telefone[0]}</span>
              )}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Email</label>
              <Input
                placeholder="EMAIL@EXEMPLO.COM"
                disabled={readOnly}
                value={form.email ?? ""}
                className={errors.email ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {errors.email && <span className="text-xs text-destructive">{errors.email[0]}</span>}
            </div>
            <div className="col-span-2 flex flex-col">
              <label>Rua</label>
              <Input
                placeholder="RUA / AVENIDA"
                disabled={readOnly}
                value={form.rua ?? ""}
                className={errors.rua ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, rua: e.target.value })}
              />
              {errors.rua && <span className="text-xs text-destructive">{errors.rua[0]}</span>}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Número</label>
              <Input
                placeholder="123"
                disabled={readOnly}
                value={form.numero ?? ""}
                className={errors.numero ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, numero: e.target.value })}
              />
              {errors.numero && (
                <span className="text-xs text-destructive">{errors.numero[0]}</span>
              )}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Complemento</label>
              <Input
                placeholder="APTO / SALA"
                disabled={readOnly}
                value={form.complemento ?? ""}
                className={errors.complemento ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, complemento: e.target.value })}
              />
              {errors.complemento && (
                <span className="text-xs text-destructive">{errors.complemento[0]}</span>
              )}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Bairro</label>
              <Input
                placeholder="BAIRRO"
                disabled={readOnly}
                value={form.bairro ?? ""}
                className={errors.bairro ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, bairro: e.target.value })}
              />
              {errors.bairro && <span className="text-xs text-destructive">{errors.bairro[0]}</span>}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>CEP</label>
              <Input
                placeholder="00000-000"
                disabled={readOnly}
                value={form.cep ?? ""}
                className={errors.cep ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, cep: e.target.value })}
              />
              {errors.cep && <span className="text-xs text-destructive">{errors.cep[0]}</span>}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Cidade</label>
              <Dialog open={citySelectorOpen} onOpenChange={setCitySelectorOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={readOnly}
                    className={`w-full justify-between uppercase font-normal ${
                      errors.idCidade ? "border-destructive" : ""
                    }`}
                  >
                    {getCidadeUf(form.idCidade)}
                    {!readOnly && <ChevronDown className="h-4 w-4" />}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl">
                  <DialogHeader>
                    <DialogTitle>Selecionar Cidade</DialogTitle>
                  </DialogHeader>
                  <div className="flex items-center gap-2 pb-2">
                    <Input
                      placeholder="Buscar..."
                      className="w-full"
                      value={searchCidade}
                      onChange={(e) => setSearchCidade(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {cidadesFiltradas.map((cid) => (
                      <Button
                        key={cid.id}
                        variant={form.idCidade === cid.id ? "default" : "outline"}
                        className="w-full justify-start font-normal uppercase"
                        onDoubleClick={() => {
                          setForm({ ...form, idCidade: cid.id })
                          setCitySelectorOpen(false)
                        }}
                      >
                        {getCidadeUf(cid.id)}
                      </Button>
                    ))}
                  </div>
                  <div className="pt-4 flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCitySelectorOpen(false)
                        setModalCidadeOpen(true)
                      }}
                    >
                      Cadastrar nova cidade
                    </Button>
                    <Button variant="outline" onClick={() => setCitySelectorOpen(false)}>
                      Voltar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              {errors.idCidade && (
                <span className="text-xs text-destructive">{errors.idCidade[0]}</span>
              )}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Condição de Pagamento</label>
              <Dialog open={condSelectorOpen} onOpenChange={setCondSelectorOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={readOnly}
                    className={`w-full justify-between uppercase font-normal ${
                      errors.idCondicaoPagamento ? "border-destructive" : ""
                    }`}
                  >
                    {getNomeCondicao(form.idCondicaoPagamento)}
                    {!readOnly && <ChevronDown className="h-4 w-4" />}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>Selecionar Condição</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {condicoes.map((c) => (
                      <Button
                        key={c.id}
                        variant={form.idCondicaoPagamento === c.id ? "default" : "outline"}
                        className="w-full justify-start font-normal uppercase"
                        onDoubleClick={() => {
                          setForm({ ...form, idCondicaoPagamento: c.id })
                          setCondSelectorOpen(false)
                        }}
                      >
                        {c.descricao.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                  <div className="pt-4 flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCondSelectorOpen(false)
                        setModalCondOpen(true)
                      }}
                    >
                      Cadastrar nova condição
                    </Button>
                    <Button variant="outline" onClick={() => setCondSelectorOpen(false)}>
                      Voltar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              {errors.idCondicaoPagamento && (
                <span className="text-xs text-destructive">
                  {errors.idCondicaoPagamento[0]}
                </span>
              )}
            </div>
            <div className="col-span-1 flex flex-col">
              <label>Limite de Crédito</label>
              <Input
                type="number"
                placeholder="0,00"
                disabled={readOnly}
                value={form.limiteCredito}
                className={errors.limiteCredito ? "border-destructive" : ""}
                onChange={(e) => setForm({ ...form, limiteCredito: Number(e.target.value) })}
              />
              {errors.limiteCredito && (
                <span className="text-xs text-destructive">{errors.limiteCredito[0]}</span>
              )}
            </div>
            <div className="col-span-1 flex flex-col justify-center">
              <label>Situação</label>
              <select
                disabled={readOnly}
                className="w-full border rounded px-2 py-1"
                value={form.ativo ? "habilitado" : "desabilitado"}
                onChange={(e) => setForm({ ...form, ativo: e.target.value === "habilitado" })}
              >
                <option value="habilitado">HABILITADO</option>
                <option value="desabilitado">DESABILITADO</option>
              </select>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <div className="text-xs text-muted-foreground mr-auto pl-1">
              {editing && (
                <>
                  <div>Data Criação: {formatDateUTC3(editing.dataCriacao)}</div>
                  <div>Data Atualização: {formatDateUTC3(editing.dataAtualizacao)}</div>
                </>
              )}
            </div>
            {!readOnly && (
              <Button onClick={salvar}>{editing ? "Atualizar" : "Salvar"}</Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
