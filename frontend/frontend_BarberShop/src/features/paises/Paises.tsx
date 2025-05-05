import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash } from "lucide-react"


import {
  getPaises,
  deletarPais,
  criarPais,
  atualizarPais,
  Pais,
} from "@/services/paisService"
import { ModalPaises } from "@/components/modals/ModalPaises"
import { ModalConfirm } from "@/components/modals/ModalConfirm"

export default function PaisesPage() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [loading, setLoading] = useState(true)
  const [selectPais, setSelectPais] = useState<Pais>()

  const paisRef = useRef<any>(null)
  const modalConfirmRef = useRef<any>(null)

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

  async function handleDelete() {
    try {
      selectPais?.id &&  await deletarPais(selectPais.id)
      setPaises((prev) => prev.filter((p) => p.id !== selectPais?.id))
    } catch (err) {
      console.error("Erro ao excluir país:", err)
    }
  }

  useEffect(() => {
    carregarPaises()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ModalPaises ref={paisRef} carregarPaises={carregarPaises} />
      <ModalConfirm onConfirm={() => handleDelete()} title="Confirmar exclusão" description={`Deseja realmente excluir o país <strong>${selectPais?.nome}</strong>? Esta ação não poderá ser desfeita.
`} ref={modalConfirmRef} />
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Países</h2>
        <Button onClick={() => paisRef.current.open()}>
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
                        onClick={() => paisRef.current.open(pais)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => {setSelectPais(pais); modalConfirmRef.current.open()}} variant="outline" size="icon">
                    <Trash className="h-4 w-4" />
                </Button >
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
