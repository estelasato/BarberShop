using BarberShop.API.Entities;
using BarberShop.API.Models;
using System;

namespace ProjetoPF.Modelos.Localizacao
{
    [Serializable]
    public class Estado : ModeloBase
    {
        public string Nome { get; set; }
        public string UF { get; set; }
        public int IdPais { get; set; }

    }
}