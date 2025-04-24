using System.Data;
using Dapper;
using BarberShop.API.Entities;
using Microsoft.Data.SqlClient;
using ProjetoPF.Modelos.Localizacao;

namespace BarberShop.API.Repository
{
    public class EstadoRepository
    {
        private readonly IDbConnection _connection;

        public EstadoRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Estado>> GetAllAsync()
        {
            var sql = "SELECT * FROM Estados";
            return await _connection.QueryAsync<Estado>(sql);
        }

        public async Task<Estado?> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Estados WHERE Id = @Id";
            return await _connection.QueryFirstOrDefaultAsync<Estado>(sql, new { Id = id });
        }

        public async Task<int> InsertAsync(Estado estado)
        {
            var sql = @"
                INSERT INTO Estados (Nome, UF, IdPais, DataCriacao, DataAtualizacao)
                VALUES (@Nome, @UF, @IdPais, @DataCriacao, @DataAtualizacao);
                SELECT SCOPE_IDENTITY();";

            estado.DataCriacao = estado.DataAtualizacao = DateTime.UtcNow;
            return await _connection.ExecuteScalarAsync<int>(sql, estado);
        }

        public async Task<bool> UpdateAsync(Estado estado)
        {
            var sql = @"
                UPDATE Estados
                SET Nome = @Nome, UF = @UF, IdPais = @IdPais, DataAtualizacao = @DataAtualizacao
                WHERE Id = @Id";

            estado.DataAtualizacao = DateTime.UtcNow;
            var rows = await _connection.ExecuteAsync(sql, estado);
            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Estados WHERE Id = @Id";
            var rows = await _connection.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }
    }
}
