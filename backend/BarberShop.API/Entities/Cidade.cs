namespace BarberShop.API.Entities
{
    [Serializable]
    public class Cidade : ModeloBase
    {
        public string Nome { get; set; }
        public string DDD { get; set; }
        public int IdEstado { get; set; }
    }
}