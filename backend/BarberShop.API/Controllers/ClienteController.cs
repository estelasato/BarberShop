using BarberShop.API.Entities;
using BarberShop.API.Models;
using BarberShop.API.Models.Cliente;
using BarberShop.API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace BarberShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteRepository _repository;

        public ClienteController(ClienteRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clientes = await _repository.GetAllAsync();
            return Ok(clientes);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Get(int id)
        {
            var cliente = await _repository.GetByIdAsync(id);
            return cliente is null ? NotFound() : Ok(cliente);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateClienteDto dto)
        {
            var cliente = new Cliente
            {
                Nome = dto.Nome,
                CpfCnpj = dto.CpfCnpj,
                Pf = dto.Pf,
                Email = dto.Email,
                Telefone = dto.Telefone,
                Endereco = dto.Endereco,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                CEP = dto.CEP,
                IdCidade = dto.IdCidade,
                Ativo = dto.Ativo
            };

            var id = await _repository.InsertAsync(cliente);
            cliente.Id = id;

            return CreatedAtAction(nameof(Get), new { id }, cliente);
        }


        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, UpdateClienteDto dto)
        {
            var cliente = new Cliente
            {
                Id = id,
                Nome = dto.Nome,
                CpfCnpj = dto.CpfCnpj,
                Pf = dto.Pf,
                Email = dto.Email,
                Telefone = dto.Telefone,
                Endereco = dto.Endereco,
                Numero = dto.Numero,
                Complemento = dto.Complemento,
                Bairro = dto.Bairro,
                CEP = dto.CEP,
                IdCidade = dto.IdCidade,
                Ativo = dto.Ativo
            };

            var updated = await _repository.UpdateAsync(cliente);
            return updated ? NoContent() : NotFound();
        }


        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repository.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
