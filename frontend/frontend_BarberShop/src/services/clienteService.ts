import axios from "axios"

export interface Cliente {
  id: number
  nome: string
  cpfCnpj: string
  pf: boolean
  email: string
  telefone: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  cidadeId: number
  ativo: boolean
  dataCriacao: string
  dataAtualizacao: string
}

export interface CreateClienteDto {
  nome: string
  cpfCnpj: string
  pf: boolean
  email: string
  telefone: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  cidadeId: number
  ativo: boolean
}

export interface UpdateClienteDto {
  nome: string
  cpfCnpj: string
  pf: boolean
  email: string
  telefone: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cep: string
  cidadeId: number
  ativo: boolean
}

const BASE_URL = "https://localhost:7145/api/Cliente"

export async function getClientes(): Promise<Cliente[]> {
  const response = await axios.get<Cliente[]>(BASE_URL)
  return response.data
}

export async function getClienteById(id: number): Promise<Cliente> {
  const response = await axios.get<Cliente>(`${BASE_URL}/${id}`)
  return response.data
}

export async function criarCliente(data: CreateClienteDto): Promise<Cliente> {
  const response = await axios.post<Cliente>(BASE_URL, data)
  return response.data
}

export async function atualizarCliente(id: number, data: UpdateClienteDto): Promise<void> {
  await axios.put(`${BASE_URL}/${id}`, data)
}

export async function deletarCliente(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/${id}`)
}
