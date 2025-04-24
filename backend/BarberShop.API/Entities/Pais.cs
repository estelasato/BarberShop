namespace BarberShop.API.Entities
{
    [Serializable]
    public class Pais : ModeloBase
    {
        public string Nome { get; set; }
        public string Sigla { get; set; }
        public string DDI { get; set; }
    }
}
