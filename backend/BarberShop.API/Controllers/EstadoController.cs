using BarberShop.API.Entities;
using BarberShop.API.Models.Estado;
using BarberShop.API.Repository;
using Microsoft.AspNetCore.Mvc;
using ProjetoPF.Modelos.Localizacao;

namespace BarberShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstadoController : ControllerBase
    {
        private readonly EstadoRepository _repository;

        public EstadoController(EstadoRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var estados = await _repository.GetAllAsync();
            return Ok(estados);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var estado = await _repository.GetByIdAsync(id);
            if (estado == null) return NotFound();
            return Ok(estado);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateEstadoDto dto)
        {
            var estado = new Estado
            {
                Nome = dto.Nome.ToUpper(),
                UF = dto.UF.ToUpper(),
                IdPais = dto.IdPais
            };

            var id = await _repository.InsertAsync(estado);
            estado.Id = id;

            return CreatedAtAction(nameof(GetById), new { id = estado.Id }, estado);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateEstadoDto dto)
        {
            var estado = new Estado
            {
                Id = id,
                Nome = dto.Nome.ToUpper(),
                UF = dto.UF.ToUpper(),
                IdPais = dto.IdPais
            };

            var updated = await _repository.UpdateAsync(estado);
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
