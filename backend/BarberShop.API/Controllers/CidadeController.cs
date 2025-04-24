using BarberShop.API.Entities;
using BarberShop.API.Models.Cidade;
using BarberShop.API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CidadeController : ControllerBase
    {
        private readonly CidadeRepository _repository;

        public CidadeController(CidadeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cidades = await _repository.GetAllAsync();
            return Ok(cidades);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cidade = await _repository.GetByIdAsync(id);
            if (cidade == null) return NotFound();
            return Ok(cidade);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateCidadeDto dto)
        {
            var cidade = new Cidade
            {
                Nome = dto.Nome.ToUpper(),
                DDD = dto.DDD.ToUpper(),
                IdEstado = dto.IdEstado
            };

            var id = await _repository.InsertAsync(cidade);
            cidade.Id = id;

            return CreatedAtAction(nameof(GetById), new { id = cidade.Id }, cidade);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateCidadeDto dto)
        {
            var cidade = new Cidade
            {
                Id = id,
                Nome = dto.Nome.ToUpper(),
                DDD = dto.DDD.ToUpper(),
                IdEstado = dto.IdEstado
            };

            var updated = await _repository.UpdateAsync(cidade);
            if (!updated) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repository.DeleteAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
