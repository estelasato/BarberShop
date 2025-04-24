using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using BarberShop.API.Entities;

namespace BarberShop.API.Repository
{
    public class FornecedorRepository
    {
        private readonly IDbConnection _cnx;
        public FornecedorRepository(IDbConnection cnx) => _cnx = cnx;

        public Task<IEnumerable<Fornecedor>> GetAllAsync() =>
            _cnx.QueryAsync<Fornecedor>("SELECT * FROM Fornecedores WITH(NOLOCK)");

        public Task<Fornecedor?> GetByIdAsync(int id) =>
            _cnx.QuerySingleOrDefaultAsync<Fornecedor>(
                "SELECT * FROM Fornecedores WHERE Id = @id", new { id });

        public Task<int> InsertAsync(Fornecedor f) =>
            _cnx.ExecuteScalarAsync<int>(
                @"INSERT INTO Fornecedores
                  (TipoPessoa, NomeRazaoSocial, ApelidoNomeFantasia, DataNascimentoCriacao,
                   CpfCnpj, RgInscricaoEstadual, Email, Telefone, Rua, Numero, Bairro, Cep,
                   Classificacao, Complemento,
                   FormaPagamentoId, CondicaoPagamentoId, IdCidade, ValorMinimoPedido,
                   DataCriacao, DataAtualizacao)
                  VALUES
                  (@TipoPessoa, @NomeRazaoSocial, @ApelidoNomeFantasia, @DataNascimentoCriacao,
                   @CpfCnpj, @RgInscricaoEstadual, @Email, @Telefone, @Rua, @Numero, @Bairro, @Cep,
                   @Classificacao, @Complemento,
                   @FormaPagamentoId, @CondicaoPagamentoId, @IdCidade, @ValorMinimoPedido,
                   GETDATE(), GETDATE());
                  SELECT CAST(SCOPE_IDENTITY() AS INT);", f);

        public Task UpdateAsync(int id, Fornecedor f) =>
            _cnx.ExecuteAsync(
                @"UPDATE Fornecedores SET
                     TipoPessoa            = @TipoPessoa,
                     NomeRazaoSocial       = @NomeRazaoSocial,
                     ApelidoNomeFantasia   = @ApelidoNomeFantasia,
                     DataNascimentoCriacao = @DataNascimentoCriacao,
                     CpfCnpj               = @CpfCnpj,
                     RgInscricaoEstadual   = @RgInscricaoEstadual,
                     Email                 = @Email,
                     Telefone              = @Telefone,
                     Rua                   = @Rua,
                     Numero                = @Numero,
                     Bairro                = @Bairro,
                     Cep                   = @Cep,
                     Classificacao         = @Classificacao,
                     Complemento           = @Complemento,
                     FormaPagamentoId      = @FormaPagamentoId,
                     CondicaoPagamentoId   = @CondicaoPagamentoId,
                     IdCidade              = @IdCidade,
                     ValorMinimoPedido     = @ValorMinimoPedido,
                     DataAtualizacao       = GETDATE()
                   WHERE Id = @Id;", new
                {
                    Id = id,
                    f.TipoPessoa,
                    f.NomeRazaoSocial,
                    f.ApelidoNomeFantasia,
                    f.DataNascimentoCriacao,
                    f.CpfCnpj,
                    f.RgInscricaoEstadual,
                    f.Email,
                    f.Telefone,
                    f.Rua,
                    f.Numero,
                    f.Bairro,
                    f.Cep,
                    f.Classificacao,
                    f.Complemento,
                    f.FormaPagamentoId,
                    f.CondicaoPagamentoId,
                    f.IdCidade,
                    f.ValorMinimoPedido
                });

        public Task DeleteAsync(int id) =>
            _cnx.ExecuteAsync("DELETE FROM Fornecedores WHERE Id = @id", new { id });
    }
}
