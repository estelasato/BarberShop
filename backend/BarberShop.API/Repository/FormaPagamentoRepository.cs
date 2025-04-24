using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using BarberShop.API.Entities;

namespace BarberShop.API.Repository
{
    public class FormaPagamentoRepository
    {
        private readonly IDbConnection _cnx;
        public FormaPagamentoRepository(IDbConnection cnx) => _cnx = cnx;

        public Task<IEnumerable<FormaPagamento>> GetAllAsync() =>
            _cnx.QueryAsync<FormaPagamento>("SELECT * FROM FormasPagamento WITH(NOLOCK)");

        public Task<FormaPagamento?> GetByIdAsync(int id) =>
            _cnx.QuerySingleOrDefaultAsync<FormaPagamento>(
                "SELECT * FROM FormasPagamento WHERE Id = @id", new { id });

        public Task<int> InsertAsync(FormaPagamento f) =>
            _cnx.ExecuteScalarAsync<int>(
                @"INSERT INTO FormasPagamento (Descricao, DataCriacao, DataAtualizacao)
                  VALUES (@Descricao, GETDATE(), GETDATE());
                  SELECT CAST(SCOPE_IDENTITY() AS INT);", f);

        public Task UpdateAsync(int id, FormaPagamento f) =>
            _cnx.ExecuteAsync(
                @"UPDATE FormasPagamento
                     SET Descricao = @Descricao,
                         DataAtualizacao = GETDATE()
                   WHERE Id = @Id;",
                new { Id = id, f.Descricao });

        public Task DeleteAsync(int id) =>
            _cnx.ExecuteAsync("DELETE FROM FormasPagamento WHERE Id = @id", new { id });
    }
}
