using Dapper;
using TimeTracker.Data;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly DataContext _dataContext;

    public UserRepository(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<User> GetById(int id)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Id, Email, FirstName, LastName, Permissions FROM Users
                                 WHERE Id = @Id
                                 """;

        var user = await dbConnection.QueryFirstAsync<User>(sqlQuery, new { Id = id });

        if (user == null)
        {
            throw new Exception("User not found.");
        }

        return user;
    }

    public async Task<IEnumerable<User>> GetAll()
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Id, Email, FirstName, LastName, Permissions FROM Users
                                 """;
        var users = await dbConnection.QueryAsync<User>(sqlQuery);

        return users;
    }

    public async Task<User> Create(User user)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 INSERT INTO Users (Email, PasswordHash, FirstName, LastName)
                                 OUTPUT INSERTED.Id
                                 VALUES (@Email, @PasswordHash, @FirstName, @LastName)
                                 """;
        var userId = await dbConnection.ExecuteScalarAsync<int>(sqlQuery, user);

        return await GetById(userId);
    }

    public async Task<User> DeleteById(int id)
    {
        using var connection = _dataContext.CreateConnection();
        const string query = $"""
                             DELETE FROM Users
                             OUTPUT DELETED.*
                             WHERE Id = @Id;
                             """;
        var user = await connection.QuerySingleOrDefaultAsync<User>(query, new { Id = id });

        if (user == null) throw new Exception("This user does not exist!");

        return user;
    }

    public async Task<User> Login(string email, string password)
    {
        var candidate = await GetByEmail(email);
        var isPasswordsMatch = BCrypt.Net.BCrypt.Verify(password, candidate.PasswordHash);

        if (!isPasswordsMatch)
        {
            throw new Exception("Incorrect email or password.");
        }        
        
        return null;
    }

    public async Task<User> GetByEmail(string email)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Id, Email, FirstName, LastName, Permissions FROM Users
                                 WHERE Email = @Email
                                 """;

        var user = await dbConnection.QueryFirstAsync<User>(sqlQuery, new { Email = email });

        if (user == null)
        {
            throw new Exception("User not found.");
        }

        return user;
    }
}