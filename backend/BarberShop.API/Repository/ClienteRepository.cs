using System.Data;
using Dapper;
using BarberShop.API.Entities;

namespace BarberShop.API.Repository
{
    public class ClienteRepository
    {
        private readonly IDbConnection _connection;

        public ClienteRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Cliente>> GetAllAsync()
        {
            var sql = "SELECT * FROM Clientes";
            return await _connection.QueryAsync<Cliente>(sql);
        }

        public async Task<Cliente?> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Clientes WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Cliente>(sql, new { Id = id });
        }

        public async Task<int> InsertAsync(Cliente cliente)
        {
            var sql = @"
                INSERT INTO Clientes (Nome, CpfCnpj, Pf, Email, Telefone, Endereco, Numero, Complemento, Bairro, CEP, IdCidade, DataCriacao, DataAtualizacao, Ativo)
                VALUES (@Nome, @CpfCnpj, @Pf, @Email, @Telefone, @Endereco, @Numero, @Complemento, @Bairro, @CEP, @IdCidade, @DataCriacao, @DataAtualizacao, @Ativo);
                SELECT SCOPE_IDENTITY();";


            cliente.DataCriacao = cliente.DataAtualizacao = DateTime.UtcNow;
            return await _connection.ExecuteScalarAsync<int>(sql, cliente);
        }

        public async Task<bool> UpdateAsync(Cliente cliente)
        {
            var sql = @"
                UPDATE Clientes
                SET Nome = @Nome, CpfCnpj = @CpfCnpj, Pf = @Pf, Email = @Email, Telefone = @Telefone, Endereco = @Endereco, Numero = @Numero,
                    Complemento = @Complemento, Bairro = @Bairro, CEP = @CEP, IdCidade = @IdCidade, DataAtualizacao = @DataAtualizacao, Ativo = @Ativo
                WHERE Id = @Id";


            cliente.DataAtualizacao = DateTime.UtcNow;
            var affected = await _connection.ExecuteAsync(sql, cliente);
            return affected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Clientes WHERE Id = @Id";
            var affected = await _connection.ExecuteAsync(sql, new { Id = id });
            return affected > 0;
        }
    }
}
