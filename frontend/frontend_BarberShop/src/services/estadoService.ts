import axios from "axios"

export interface CreateEstadoDto {
  nome: string
  uf: string
  idPais: number
}

export interface Estado extends CreateEstadoDto {
  id: number
  dataCriacao: string
  dataAtualizacao: string
}

const BASE_URL = "https://localhost:7145/api/Estado"

export async function getEstados(): Promise<Estado[]> {
  const response = await axios.get<Estado[]>(BASE_URL)
  return response.data
}

export async function criarEstado(data: CreateEstadoDto): Promise<Estado> {
  const response = await axios.post<Estado>(BASE_URL, data)
  return response.data
}

export async function atualizarEstado(id: number, data: CreateEstadoDto): Promise<Estado> {
  const response = await axios.put<Estado>(`${BASE_URL}/${id}`, data)
  return response.data
}

export async function deletarEstado(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/${id}`)
}
