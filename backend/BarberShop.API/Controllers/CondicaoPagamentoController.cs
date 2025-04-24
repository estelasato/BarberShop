using Microsoft.AspNetCore.Mvc;
using BarberShop.API.Entities;
using BarberShop.API.Repository;
using BarberShop.API.Models;

namespace BarberShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CondicaoPagamentoController : ControllerBase
    {
        private readonly CondicaoPagamentoRepository _repo;
        public CondicaoPagamentoController(CondicaoPagamentoRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
            => (await _repo.GetByIdAsync(id)) is { } c ? Ok(c) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create(CreateCondicaoPagamentoDto dto)
        {
            var ent = new CondicaoPagamento
            {
                Descricao = dto.Descricao,
                TaxaJuros = dto.TaxaJuros,
                Multa = dto.Multa
            };
            var id = await _repo.InsertAsync(ent);
            return CreatedAtAction(nameof(Get), new { id }, id);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UpdateCondicaoPagamentoDto dto)
        {
            await _repo.UpdateAsync(id, new CondicaoPagamento
            {
                Descricao = dto.Descricao,
                TaxaJuros = dto.TaxaJuros,
                Multa = dto.Multa
            });
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _repo.DeleteAsync(id);
            return NoContent();
        }
    }
}
