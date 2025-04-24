using Microsoft.Data.SqlClient;
using System.Data;

namespace BarberShop.API.Connection
{
    public class DbConnectionFactory
    {
        private readonly IConfiguration _configuration;

        public DbConnectionFactory(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IDbConnection CreateConnection()
        {
            var connectionString = _configuration.GetConnectionString("BarberCs");
            return new SqlConnection(connectionString);
        }
    }
}
