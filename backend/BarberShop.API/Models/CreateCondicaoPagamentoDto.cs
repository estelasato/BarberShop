namespace BarberShop.API.Models
{
    public class CreateCondicaoPagamentoDto
    {
        public string Descricao { get; set; }
        public decimal TaxaJuros { get; set; }
        public decimal Multa { get; set; }
    }
}
