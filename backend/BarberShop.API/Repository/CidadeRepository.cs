using System.Data;
using Dapper;
using BarberShop.API.Entities;

namespace BarberShop.API.Repository
{
    public class CidadeRepository
    {
        private readonly IDbConnection _connection;

        public CidadeRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Cidade>> GetAllAsync()
        {
            var sql = "SELECT * FROM Cidades";
            return await _connection.QueryAsync<Cidade>(sql);
        }

        public async Task<Cidade?> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Cidades WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Cidade>(sql, new { Id = id });
        }

        public async Task<int> InsertAsync(Cidade cidade)
        {
            var sql = @"
                INSERT INTO Cidades (Nome, DDD, IdEstado, DataCriacao, DataAtualizacao)
                VALUES (@Nome, @DDD, @IdEstado, @DataCriacao, @DataAtualizacao);
                SELECT SCOPE_IDENTITY();";

            cidade.DataCriacao = cidade.DataAtualizacao = DateTime.UtcNow;
            return await _connection.ExecuteScalarAsync<int>(sql, cidade);
        }

        public async Task<bool> UpdateAsync(Cidade cidade)
        {
            var sql = @"
                UPDATE Cidades
                SET Nome = @Nome, DDD = @DDD, IdEstado = @IdEstado, DataAtualizacao = @DataAtualizacao
                WHERE Id = @Id";

            cidade.DataAtualizacao = DateTime.UtcNow;
            var affected = await _connection.ExecuteAsync(sql, cidade);
            return affected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Cidades WHERE Id = @Id";
            var affected = await _connection.ExecuteAsync(sql, new { Id = id });
            return affected > 0;
        }
    }
}
