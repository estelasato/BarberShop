namespace BarberShop.API.Entities
{
    [Serializable]
    public class CondicaoPagamento : ModeloBase
    {
        public string Descricao { get; set; }
        public decimal TaxaJuros { get; set; }
        public decimal Multa { get; set; }
    }
}
