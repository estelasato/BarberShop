namespace BarberShop.API.Models
{
    public class FornecedorDto : CreateFornecedorDto
    {
        public int Id { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }
    }
}
