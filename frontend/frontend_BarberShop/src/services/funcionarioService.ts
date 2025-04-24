import axios from "axios"

const BASE_URL = "https://localhost:7145/api/Funcionario"

export interface Funcionario {
  id: number
  tipoPessoa: string
  nomeRazaoSocial: string
  apelidoNomeFantasia: string
  dataNascimentoCriacao: string
  cpfCnpj: string
  rgInscricaoEstadual: string
  email: string
  telefone: string
  rua: string
  numero: string
  bairro: string
  cep: string
  classificacao: string
  complemento: string

  matricula: string
  cargo: string
  salario: number
  dataAdmissao: string
  dataDemissao: string | null
  turno: string
  cargaHoraria: string
  idCidade: number

  dataCriacao: string
  dataAtualizacao: string
}

export interface CreateFuncionarioDto extends Omit<Funcionario, "id" | "dataCriacao" | "dataAtualizacao"> {}
export type UpdateFuncionarioDto = CreateFuncionarioDto

export async function getFuncionarios(): Promise<Funcionario[]> {
  const { data } = await axios.get<Funcionario[]>(BASE_URL)
  return data
}

export async function criarFuncionario(dto: CreateFuncionarioDto): Promise<number> {
  const { data } = await axios.post<number>(BASE_URL, dto)
  return data
}

export async function atualizarFuncionario(id: number, dto: UpdateFuncionarioDto) {
  await axios.put(`${BASE_URL}/${id}`, dto)
}

export async function deletarFuncionario(id: number) {
  await axios.delete(`${BASE_URL}/${id}`)
}
