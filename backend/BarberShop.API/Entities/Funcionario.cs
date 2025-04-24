using System;

namespace BarberShop.API.Entities
{
    [Serializable]
    public class Funcionario : ModeloPessoa   
    {
        public string Matricula { get; set; }  
        public string Cargo { get; set; }   
        public decimal Salario { get; set; }   
        public DateTime DataAdmissao { get; set; }   
        public DateTime? DataDemissao { get; set; }   
        public string Turno { get; set; }   
        public string CargaHoraria { get; set; } 
        public int IdCidade { get; set; }   
    }
}
