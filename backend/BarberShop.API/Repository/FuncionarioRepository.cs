using System.Data;
using System.Threading.Tasks;
using Dapper;
using BarberShop.API.Entities;

namespace BarberShop.API.Repository
{
    public class FuncionarioRepository
    {
        private readonly IDbConnection _connection;

        public FuncionarioRepository(IDbConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Funcionario>> GetAllAsync()
        {
            const string sql = "SELECT * FROM Funcionarios WITH(NOLOCK)";
            return await _connection.QueryAsync<Funcionario>(sql);
        }

        public async Task<Funcionario?> GetByIdAsync(int id)
        {
            const string sql = "SELECT * FROM Funcionarios WHERE Id = @Id";
            return await _connection.QuerySingleOrDefaultAsync<Funcionario>(sql, new { id });
        }

        public async Task<int> InsertAsync(Funcionario entidade)
        {
            const string sql = @"
                    INSERT INTO Funcionarios
                    (
                        TipoPessoa, NomeRazaoSocial, ApelidoNomeFantasia, DataNascimentoCriacao,
                        CpfCnpj, RgInscricaoEstadual, Email, Telefone, Rua, Numero, Bairro, Cep,
                        Classificacao, Complemento,
                        Matricula, Cargo, Salario, DataAdmissao, DataDemissao, Turno, CargaHoraria, IdCidade,
                        DataCriacao, DataAtualizacao
                    )
                    VALUES
                    (
                        @TipoPessoa, @NomeRazaoSocial, @ApelidoNomeFantasia, @DataNascimentoCriacao,
                        @CpfCnpj, @RgInscricaoEstadual, @Email, @Telefone, @Rua, @Numero, @Bairro, @Cep,
                        @Classificacao, @Complemento,
                        @Matricula, @Cargo, @Salario, @DataAdmissao, @DataDemissao, @Turno, @CargaHoraria, @IdCidade,
                        GETDATE(), GETDATE()
                    );
                    SELECT CAST(SCOPE_IDENTITY() AS INT);";

            return await _connection.ExecuteScalarAsync<int>(sql, entidade);
        }

        public async Task UpdateAsync(int id, Funcionario entidade)
        {
            const string sql = @"
                    UPDATE Funcionarios SET
                        TipoPessoa               = @TipoPessoa,
                        NomeRazaoSocial          = @NomeRazaoSocial,
                        ApelidoNomeFantasia      = @ApelidoNomeFantasia,
                        DataNascimentoCriacao    = @DataNascimentoCriacao,
                        CpfCnpj                  = @CpfCnpj,
                        RgInscricaoEstadual      = @RgInscricaoEstadual,
                        Email                    = @Email,
                        Telefone                 = @Telefone,
                        Rua                      = @Rua,
                        Numero                   = @Numero,
                        Bairro                   = @Bairro,
                        Cep                      = @Cep,
                        Classificacao            = @Classificacao,
                        Complemento              = @Complemento,
                        Matricula                = @Matricula,
                        Cargo                    = @Cargo,
                        Salario                  = @Salario,
                        DataAdmissao             = @DataAdmissao,
                        DataDemissao             = @DataDemissao,
                        Turno                    = @Turno,
                        CargaHoraria             = @CargaHoraria,
                        IdCidade                 = @IdCidade,
                        DataAtualizacao          = GETDATE()
                    WHERE Id = @Id;";

            var parametros = entidade;
            await _connection.ExecuteAsync(sql, new
            {
                Id = id,
                parametros.TipoPessoa,
                parametros.NomeRazaoSocial,
                parametros.ApelidoNomeFantasia,
                parametros.DataNascimentoCriacao,
                parametros.CpfCnpj,
                parametros.RgInscricaoEstadual,
                parametros.Email,
                parametros.Telefone,
                parametros.Rua,
                parametros.Numero,
                parametros.Bairro,
                parametros.Cep,
                parametros.Classificacao,
                parametros.Complemento,
                parametros.Matricula,
                parametros.Cargo,
                parametros.Salario,
                parametros.DataAdmissao,
                parametros.DataDemissao,
                parametros.Turno,
                parametros.CargaHoraria,
                parametros.IdCidade
            });
        }

        public async Task DeleteAsync(int id)
        {
            const string sql = "DELETE FROM Funcionarios WHERE Id = @Id";
            await _connection.ExecuteAsync(sql, new { id });
        }
    }
}
