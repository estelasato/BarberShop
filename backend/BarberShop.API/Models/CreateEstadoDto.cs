namespace BarberShop.API.Models.Estado
{
    public class CreateEstadoDto
    {
        public string Nome { get; set; }
        public string UF { get; set; }
        public int IdPais { get; set; }
    }
}
