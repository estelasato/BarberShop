import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Plus, Search, Edit, Trash, Eye } from "lucide-react"

import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction,
} from "@/components/ui/alert-dialog"

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import {
  Cliente, getClientes, criarCliente, atualizarCliente, deletarCliente,
} from "@/services/clienteService"

import { Cidade, getCidades } from "@/services/cidadeService"
import { Estado, getEstados } from "@/services/estadoService"
import { Pais, getPaises } from "@/services/paisService"

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [cidades, setCidades] = useState<Cidade[]>([])
  const [estados, setEstados] = useState<Estado[]>([])
  const [paises, setPaises] = useState<Pais[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [readOnly, setReadOnly] = useState(false)

  const [form, setForm] = useState({
    nome: "",
    cpfCnpj: "",
    pf: true,
    email: "",
    telefone: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    cidadeId: 0,
    ativo: true,
  })

  async function carregar() {
    const [cli, cid, est, pais] = await Promise.all([
      getClientes(),
      getCidades(),
      getEstados(),
      getPaises(),
    ])
    setClientes(cli)
    setCidades(cid)
    setEstados(est)
    setPaises(pais)
    setLoading(false)
  }

  async function salvar() {
    if (readOnly) return
    if (editing) {
      await atualizarCliente(editing.id, form)
    } else {
      await criarCliente(form)
    }
    setModalOpen(false)
    await carregar()
  }

  async function remover(id: number) {
    await deletarCliente(id)
    setClientes((prev) => prev.filter((c) => c.id !== id))
  }

  const openCreate = () => {
    setEditing(null)
    setReadOnly(false)
    setForm({
      nome: "",
      cpfCnpj: "",
      pf: true,
      email: "",
      telefone: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      cidadeId: cidades[0]?.id || 0,
      ativo: true,
    })
    setModalOpen(true)
  }

  const openEdit = (c: Cliente) => {
    setEditing(c)
    setReadOnly(false)
    setForm({ ...c })
    setModalOpen(true)
  }

  const openView = (c: Cliente) => {
    setEditing(c)
    setReadOnly(true)
    setForm({ ...c })
    setModalOpen(true)
  }

  const formatDateUTC3 = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    date.setHours(date.getHours() - 3)
    return date.toLocaleString("pt-BR")
  }

  useEffect(() => { carregar() }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
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
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((c) => {
            const cidade = cidades.find(ci => ci.id === c.cidadeId)
            const estado = estados.find(e => e.id === cidade?.idEstado)
            const cidadeUf = cidade && estado ? `${cidade.nome} - ${estado.uf}` : "N/A"

            return (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.nome}</TableCell>
                <TableCell>{c.cpfCnpj}</TableCell>
                <TableCell>{cidadeUf}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>
                  <span className={c.ativo ? "text-green-600" : "text-red-600"}>
                    {c.ativo ? "Habilitado" : "Desabilitado"}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
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
                          Excluir <strong>{c.nome}</strong>?
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
            )
          })}
        </TableBody>
      </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-7xl w-full">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? readOnly
                  ? "Visualizar Cliente"
                  : "Editar Cliente"
                : "Novo Cliente"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-4 py-4 text-sm">
            <div className="col-span-1 flex flex-col justify-center">
              <label>Tipo</label>
              <select
                disabled={readOnly}
                className="w-full border rounded px-2 py-1"
                value={form.pf ? "pf" : "pj"}
                onChange={(e) => setForm({ ...form, pf: e.target.value === "pf" })}
              >
                <option value="pf">Pessoa Física</option>
                <option value="pj">Pessoa Jurídica</option>
              </select>
            </div>

            <div className="col-span-2">
              <label>Cliente</label>
              <Input disabled={readOnly} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>

            <div className="col-span-1">
              <label>CPF/CNPJ</label>
              <Input disabled={readOnly} value={form.cpfCnpj} onChange={(e) => setForm({ ...form, cpfCnpj: e.target.value })} />
            </div>

            <div className="col-span-1">
              <label>Telefone</label>
              <Input disabled={readOnly} value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            </div>

            <div className="col-span-1">
              <label>Email</label>
              <Input disabled={readOnly} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="col-span-2">
              <label>Endereço</label>
              <Input disabled={readOnly} value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
            </div>

            <div className="col-span-1">
              <label>Número</label>
              <Input disabled={readOnly} value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
            </div>

            <div className="col-span-1">
              <label>Complemento</label>
              <Input disabled={readOnly} value={form.complemento} onChange={(e) => setForm({ ...form, complemento: e.target.value })} />
            </div>

            <div className="col-span-1">
              <label>Bairro</label>
              <Input disabled={readOnly} value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} />
            </div>

            <div className="col-span-1">
              <label>CEP</label>
              <Input disabled={readOnly} value={form.cep} onChange={(e) => setForm({ ...form, cep: e.target.value })} />
            </div>

            <div className="col-span-1">
              <label>ID Cidade</label>
              <Input
                type="number"
                disabled={readOnly}
                value={form.cidadeId}
                onChange={(e) => setForm({ ...form, cidadeId: Number(e.target.value) })}
              />
            </div>

            <div className="col-span-1 flex flex-col justify-center">
              <label>Situação</label>
              <select
                disabled={readOnly}
                className="w-full border rounded px-2 py-1"
                value={form.ativo ? "habilitado" : "desabilitado"}
                onChange={(e) => setForm({ ...form, ativo: e.target.value === "habilitado" })}
              >
                <option value="habilitado">Habilitado</option>
                <option value="desabilitado">Desabilitado</option>
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

            <DialogClose asChild>
              <Button variant="outline">Fechar</Button>
            </DialogClose>
            {!readOnly && (
              <Button onClick={salvar}>{editing ? "Atualizar" : "Salvar"}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
