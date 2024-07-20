using System.Data;
using Microsoft.Data.SqlClient;

namespace TimeTracker.Data;

public class DataContext
{
    private readonly IConfiguration _configuration;
    private readonly string _connectionString;

    public DataContext(IConfiguration configuration)
    {
        _configuration = configuration;
        _connectionString = _configuration.GetConnectionString("DefaultConnection");
    }

    public IDbConnection CreateConnection()
        => new SqlConnection(_connectionString);
}