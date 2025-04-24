namespace BarberShop.API.Entities
{
    public class ModeloPessoa : ModeloBase
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
    }
}
