using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Dapper;
using Microsoft.IdentityModel.Tokens;
using TimeTracker.Data;
using TimeTracker.Dtos;
using TimeTracker.Models;
using TimeTracker.Options;
using TimeTracker.Repositories.Infrastructure;
using TimeTracker.Utils;

namespace TimeTracker.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly DataContext _dataContext;
    private readonly JwtOptions _jwtOptions;

    public UserRepository(DataContext dataContext, JwtOptions jwtOptions)
    {
        _dataContext = dataContext;
        _jwtOptions = jwtOptions;
    }

    public async Task<User> GetById(int id)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Id, Email, FirstName, LastName, Permissions FROM Users
                                 WHERE Id = @Id
                                 """;

        var userDto = await dbConnection.QueryFirstAsync<UserDto>(sqlQuery, new { Id = id });

        if (userDto == null)
        {
            throw new Exception("User not found.");
        }

        var permissionUtils = new PermissionUtils();
        var user = new User()
        {
            Id = userDto.Id,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Permissions = permissionUtils.DeserializePermissions(userDto.Permissions)
        };

        return user;
    }

    public async Task<IEnumerable<User>> GetAll()
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Id, Email, FirstName, LastName, Permissions FROM Users
                                 """;
        var usersDto = await dbConnection.QueryAsync<UserDto>(sqlQuery);

        var permissionUtils = new PermissionUtils();
        var users = usersDto.Select(dto => new User
        {
            Id = dto.Id,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Permissions = permissionUtils.DeserializePermissions(dto.Permissions)
        }).ToList();

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

    // TODO need to implement the dismissal or concealment of an employee
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

    public async Task<LoginResult> Login(string email, string password)
    {
        var candidate = await GetByEmail(email);
        var isPasswordsMatch = BCrypt.Net.BCrypt.Verify(password, candidate.PasswordHash);

        if (!isPasswordsMatch)
        {
            throw new Exception("Incorrect email or password.");
        }

        var claims = new List<Claim>
        {
            new Claim("id", candidate.Id.ToString()),
            new Claim("email", candidate.Email),
            new Claim("firstName", candidate.FirstName),
            new Claim("lastName", candidate.LastName),
            new Claim("permissions", JsonSerializer.Serialize(candidate.Permissions)),
        };
        var keyBytes = Encoding.UTF8.GetBytes(_jwtOptions.SigningKey);
        var symmetricKey = new SymmetricSecurityKey(keyBytes);
        var jwt = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromDays(_jwtOptions.ExpirationDays)),
            signingCredentials: new SigningCredentials(symmetricKey,
                SecurityAlgorithms.HmacSha256)
        );

        return new LoginResult()
        {
            Token = new JwtSecurityTokenHandler().WriteToken(jwt),
            User = candidate
        };
    }

    public async Task<User> GetByEmail(string email)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Id, Email, FirstName, LastName, Permissions, PasswordHash FROM Users
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