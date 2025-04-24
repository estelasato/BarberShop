import axios from "axios"

const BASE_URL = "https://localhost:7145/api/CondicaoPagamento"

export interface CondicaoPagamento {
  id: number
  descricao: string
  taxaJuros: number       
  multa: number           
  dataCriacao: string
  dataAtualizacao: string
}

export interface CreateCondicaoPagamentoDto {
  descricao: string
  taxaJuros: number
  multa: number
}

export type UpdateCondicaoPagamentoDto = CreateCondicaoPagamentoDto

export async function getCondicoesPagamento(): Promise<CondicaoPagamento[]> {
  const { data } = await axios.get<CondicaoPagamento[]>(BASE_URL)
  return data
}

export async function criarCondicaoPagamento(dto: CreateCondicaoPagamentoDto) {
  const { data } = await axios.post<number>(BASE_URL, dto)
  return data
}

export async function atualizarCondicaoPagamento(
  id: number,
  dto: UpdateCondicaoPagamentoDto,
) {
  await axios.put(`${BASE_URL}/${id}`, dto)
}

export async function deletarCondicaoPagamento(id: number) {
  await axios.delete(`${BASE_URL}/${id}`)
}
