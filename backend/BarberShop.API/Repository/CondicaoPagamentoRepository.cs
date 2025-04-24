using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using BarberShop.API.Entities;

namespace BarberShop.API.Repository
{
    public class CondicaoPagamentoRepository
    {
        private readonly IDbConnection _cnx;
        public CondicaoPagamentoRepository(IDbConnection cnx) => _cnx = cnx;

        public Task<IEnumerable<CondicaoPagamento>> GetAllAsync() =>
            _cnx.QueryAsync<CondicaoPagamento>("SELECT * FROM CondicoesPagamento WITH(NOLOCK)");

        public Task<CondicaoPagamento?> GetByIdAsync(int id) =>
            _cnx.QuerySingleOrDefaultAsync<CondicaoPagamento>(
                "SELECT * FROM CondicoesPagamento WHERE Id = @id", new { id });

        public Task<int> InsertAsync(CondicaoPagamento c) =>
            _cnx.ExecuteScalarAsync<int>(
                @"INSERT INTO CondicoesPagamento
                  (Descricao, TaxaJuros, Multa, DataCriacao, DataAtualizacao)
                  VALUES (@Descricao, @TaxaJuros, @Multa, GETDATE(), GETDATE());
                  SELECT CAST(SCOPE_IDENTITY() AS INT);", c);

        public Task UpdateAsync(int id, CondicaoPagamento c) =>
            _cnx.ExecuteAsync(
                @"UPDATE CondicoesPagamento SET
                     Descricao       = @Descricao,
                     TaxaJuros       = @TaxaJuros,
                     Multa           = @Multa,
                     DataAtualizacao = GETDATE()
                   WHERE Id = @Id;",
                new { Id = id, c.Descricao, c.TaxaJuros, c.Multa });

        public Task DeleteAsync(int id) =>
            _cnx.ExecuteAsync("DELETE FROM CondicoesPagamento WHERE Id = @id", new { id });
    }
}
