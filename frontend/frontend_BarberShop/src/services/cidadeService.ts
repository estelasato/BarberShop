import axios from "axios"

export interface Cidade {
  id: number
  nome: string
  ddd: string
  idEstado: number
  dataCriacao: string
  dataAtualizacao: string
}

export interface CreateCidadeDto {
  nome: string
  ddd: string
  idEstado: number
}

export interface UpdateCidadeDto {
  nome: string
  ddd: string
  idEstado: number
}

const BASE_URL = "https://localhost:7145/api/Cidade"

export async function getCidades(): Promise<Cidade[]> {
  const response = await axios.get<Cidade[]>(BASE_URL)
  return response.data
}

export async function getCidadeById(id: number): Promise<Cidade> {
  const response = await axios.get<Cidade>(`${BASE_URL}/${id}`)
  return response.data
}

export async function criarCidade(data: CreateCidadeDto): Promise<Cidade> {
  const response = await axios.post<Cidade>(BASE_URL, data)
  return response.data
}

export async function atualizarCidade(id: number, data: UpdateCidadeDto): Promise<void> {
  await axios.put(`${BASE_URL}/${id}`, data)
}

export async function deletarCidade(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/${id}`)
}
