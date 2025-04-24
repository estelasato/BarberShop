using BarberShop.API.Entities;
using BarberShop.API.Models.Pais;
using BarberShop.API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaisController : ControllerBase
    {
        private readonly PaisRepository _repository;

        public PaisController(PaisRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreatePaisDto dto)
        {
            var pais = new Pais
            {
                Nome = dto.Nome.ToUpper(),
                Sigla = dto.Sigla.ToUpper(),
                DDI = dto.DDI.ToUpper()
            };

            var id = await _repository.InsertAsync(pais);
            pais.Id = id;

            return CreatedAtAction(nameof(GetById), new { id = pais.Id }, pais);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdatePaisDto dto)
        {
            var pais = new Pais
            {
                Id = id,
                Nome = dto.Nome.ToUpper(),
                Sigla = dto.Sigla.ToUpper(),
                DDI = dto.DDI.ToUpper()
            };

            var success = await _repository.UpdateAsync(pais);
            if (!success) return NotFound();

            return NoContent();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var pais = await _repository.GetByIdAsync(id);
            if (pais == null) return NotFound();
            return Ok(pais);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var paises = await _repository.GetAllAsync();
            return Ok(paises);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repository.DeleteAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
