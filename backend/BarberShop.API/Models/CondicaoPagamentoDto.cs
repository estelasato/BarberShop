namespace BarberShop.API.Models
{
    public class CondicaoPagamentoDto : CreateCondicaoPagamentoDto
    {
        public int Id { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }
    }
}
