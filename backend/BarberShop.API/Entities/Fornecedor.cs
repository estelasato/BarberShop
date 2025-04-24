using System;

namespace BarberShop.API.Entities
{
    [Serializable]
    public class Fornecedor : ModeloPessoa
    {
        public int FormaPagamentoId { get; set; }
        public int CondicaoPagamentoId { get; set; }
        public int IdCidade { get; set; }
        public decimal? ValorMinimoPedido { get; set; }
    }
}
