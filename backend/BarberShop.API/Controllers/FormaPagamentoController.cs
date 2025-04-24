using Microsoft.AspNetCore.Mvc;
using BarberShop.API.Entities;
using BarberShop.API.Repository;
using BarberShop.API.Models;

namespace BarberShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormaPagamentoController : ControllerBase
    {
        private readonly FormaPagamentoRepository _repo;
        public FormaPagamentoController(FormaPagamentoRepository repo) => _repo = repo;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _repo.GetAllAsync());

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
            => (await _repo.GetByIdAsync(id)) is { } fp ? Ok(fp) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create(CreateFormaPagamentoDto dto)
        {
            var entidade = new FormaPagamento { Descricao = dto.Descricao };
            var id = await _repo.InsertAsync(entidade);
            return CreatedAtAction(nameof(Get), new { id }, id);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UpdateFormaPagamentoDto dto)
        {
            await _repo.UpdateAsync(id, new FormaPagamento { Descricao = dto.Descricao });
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
