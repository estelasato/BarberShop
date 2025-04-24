using BarberShop.API.Entities;
using Dapper;
using System.Data;

namespace BarberShop.API.Repository
{
    public class PaisRepository
    {
        private readonly IDbConnection _connection;

        public PaisRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Pais>> GetAllAsync()
        {
            var sql = "SELECT * FROM Paises";
            return await _connection.QueryAsync<Pais>(sql);
        }

        public async Task<Pais?> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Paises WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Pais>(sql, new { Id = id });
        }

        public async Task<int> InsertAsync(Pais pais)
        {
            var sql = @"
                INSERT INTO Paises (Nome, Sigla, DDI, DataCriacao, DataAtualizacao)
                VALUES (@Nome, @Sigla, @DDI, @DataCriacao, @DataAtualizacao);
                SELECT SCOPE_IDENTITY();";

            pais.DataCriacao = pais.DataAtualizacao = DateTime.UtcNow;

            return await _connection.ExecuteScalarAsync<int>(sql, pais);
        }

        public async Task<bool> UpdateAsync(Pais pais)
        {
            var sql = @"
                UPDATE Paises
                SET Nome = @Nome, Sigla = @Sigla, DDI = @DDI, DataAtualizacao = @DataAtualizacao
                WHERE Id = @Id";

            pais.DataAtualizacao = DateTime.UtcNow;

            var affected = await _connection.ExecuteAsync(sql, pais);
            return affected > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Paises WHERE Id = @Id";
            var affected = await _connection.ExecuteAsync(sql, new { Id = id });
            return affected > 0;
        }
    }
}
