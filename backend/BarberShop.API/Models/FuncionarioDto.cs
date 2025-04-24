using BarberShop.API.DTOs.Funcionario;

namespace BarberShop.API.Models
{
    public class FuncionarioDto : CreateFuncionarioDto
    {
        public int Id { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }
    }
}
