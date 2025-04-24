namespace BarberShop.API.DTOs.Funcionario
{
    public class CreateFuncionarioDto
    {
        public string TipoPessoa { get; set; } 
        public string NomeRazaoSocial { get; set; }
        public string ApelidoNomeFantasia { get; set; }
        public DateTime DataNascimentoCriacao { get; set; }
        public string CpfCnpj { get; set; }
        public string RgInscricaoEstadual { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Rua { get; set; }
        public string Numero { get; set; }
        public string Bairro { get; set; }
        public string Cep { get; set; }
        public string Classificacao { get; set; }
        public string Complemento { get; set; }

        public string Matricula { get; set; }
        public string Cargo { get; set; }
        public decimal Salario { get; set; }
        public DateTime DataAdmissao { get; set; }
        public DateTime? DataDemissao { get; set; }
        public string Turno { get; set; }
        public string CargaHoraria { get; set; }
        public int IdCidade { get; set; }
    }
}