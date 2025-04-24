using Microsoft.AspNetCore.Mvc;
using BarberShop.API.DTOs.Funcionario;
using BarberShop.API.Entities;
using BarberShop.API.Repository;
using BarberShop.API.Models;

namespace BarberShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FuncionarioController : ControllerBase
    {
        private readonly FuncionarioRepository _repo;

        public FuncionarioController(FuncionarioRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _repo.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            return item is null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateFuncionarioDto dto)
        {
            var entidade = Map(dto);
            var id = await _repo.InsertAsync(entidade);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateFuncionarioDto dto)
        {
            var entidade = Map(dto);           
            await _repo.UpdateAsync(id, entidade);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repo.DeleteAsync(id);
            return NoContent();
        }
        private static Funcionario Map(CreateFuncionarioDto dto) => new()
        {
            TipoPessoa = dto.TipoPessoa,
            NomeRazaoSocial = dto.NomeRazaoSocial.ToUpperInvariant(),
            ApelidoNomeFantasia = dto.ApelidoNomeFantasia.ToUpperInvariant(),
            DataNascimentoCriacao = dto.DataNascimentoCriacao,
            CpfCnpj = dto.CpfCnpj,
            RgInscricaoEstadual = dto.RgInscricaoEstadual,
            Email = dto.Email,
            Telefone = dto.Telefone,
            Rua = dto.Rua,
            Numero = dto.Numero,
            Bairro = dto.Bairro,
            Cep = dto.Cep,
            Classificacao = dto.Classificacao,
            Complemento = dto.Complemento,
            Matricula = dto.Matricula,
            Cargo = dto.Cargo,
            Salario = dto.Salario,
            DataAdmissao = dto.DataAdmissao,
            DataDemissao = dto.DataDemissao ?? null!,
            Turno = dto.Turno,
            CargaHoraria = dto.CargaHoraria,
            IdCidade = dto.IdCidade
        };
    }
}
