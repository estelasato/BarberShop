namespace BarberShop.API.Models.Cliente
{
    public class CreateClienteDto
    {
        public string Nome { get; set; } = string.Empty;
        public string CpfCnpj { get; set; } = string.Empty;
        public bool Pf { get; set; }
        public string? Email { get; set; }
        public string? Telefone { get; set; }
        public string? Endereco { get; set; }
        public string? Numero { get; set; }
        public string? Complemento { get; set; }
        public string? Bairro { get; set; }
        public string? CEP { get; set; }
        public int IdCidade { get; set; }
        public bool Ativo { get; set; } = true;
    }
}