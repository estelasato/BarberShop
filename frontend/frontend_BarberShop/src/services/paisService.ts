import axios from "axios"

const API_URL = "https://localhost:7145/api/Pais"

export interface CreatePaisDto {
  nome: string
  sigla: string
  ddi: string
}

export interface UpdatePaisDto {
  nome: string
  sigla: string
  ddi: string
}

export interface Pais {
  id: number
  nome: string
  sigla: string
  ddi: string
  dataCriacao: string
  dataAtualizacao: string
}

// Buscar todos os países
export async function getPaises(): Promise<Pais[]> {
  const response = await axios.get<Pais[]>(API_URL)
  return response.data
}

// Buscar país por ID
export async function getPaisById(id: number): Promise<Pais> {
  const response = await axios.get<Pais>(`${API_URL}/${id}`)
  return response.data
}

// Criar novo país
export async function criarPais(data: CreatePaisDto): Promise<Pais> {
  const response = await axios.post<Pais>(API_URL, data)
  return response.data
}

// Atualizar país
export async function atualizarPais(id: number, data: UpdatePaisDto): Promise<void> {
  await axios.put(`${API_URL}/${id}`, data)
}

// Deletar país
export async function deletarPais(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`)
}
