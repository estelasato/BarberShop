namespace BarberShop.API.Entities
{
    [Serializable]
    public class ModeloBase
    {
        public int Id { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }
    }
}