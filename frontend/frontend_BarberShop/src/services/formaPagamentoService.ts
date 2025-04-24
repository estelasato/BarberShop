import axios from "axios"

const BASE_URL = "https://localhost:7145/api/FormaPagamento"

export interface FormaPagamento {
  id: number
  descricao: string
  dataCriacao: string
  dataAtualizacao: string
  tipo: string 
  ativo: boolean
}

export interface CreateFormaPagamentoDto {
  descricao: string
  tipo: string
  ativo: boolean
}
export type UpdateFormaPagamentoDto = CreateFormaPagamentoDto

export async function getFormasPagamento(): Promise<FormaPagamento[]> {
  const { data } = await axios.get<FormaPagamento[]>(BASE_URL)
  return data
}

export async function criarFormaPagamento(dto: CreateFormaPagamentoDto) {
  const { data } = await axios.post<number>(BASE_URL, dto)
  return data
}

export async function atualizarFormaPagamento(id: number, dto: UpdateFormaPagamentoDto) {
  await axios.put(`${BASE_URL}/${id}`, dto)
}

export async function deletarFormaPagamento(id: number) {
  await axios.delete(`${BASE_URL}/${id}`)
}
