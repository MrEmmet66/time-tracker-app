using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Dapper;
using Microsoft.IdentityModel.Tokens;
using TimeTracker.Constants;
using TimeTracker.Data;
using TimeTracker.Dtos;
using TimeTracker.Factories;
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
                                 SELECT Id, Email, FirstName, LastName, Permissions, IsActive FROM Users
                                 WHERE Id = @Id
                                 """;

        var userDto = await dbConnection.QueryFirstOrDefaultAsync<UserDto>(sqlQuery, new { Id = id });

        if (userDto == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var permissionUtils = new PermissionUtils();
        var user = new User()
        {
            Id = userDto.Id,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            IsActive = userDto.IsActive,
            Permissions = permissionUtils.DeserializePermissions(userDto.Permissions)
        };

        return user;
    }

    public async Task<(IEnumerable<User> Entities, int PagesCount)> GetAll(int? page = 1)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Id, Email, FirstName, LastName, Permissions, IsActive 
                                 FROM Users
                                 ORDER BY Id
                                 OFFSET @OffsetItems ROWS
                                 FETCH NEXT @FetchItems ROWS ONLY
                                 """;
        var usersDto = await dbConnection.QueryAsync<UserDto>(sqlQuery, new
        {
            OffsetItems = Pages.ElementsOnPage * --page,
            FetchItems = Pages.ElementsOnPage
        });

        var permissionUtils = new PermissionUtils();
        var users = usersDto.Select(dto => new User
        {
            Id = dto.Id,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            IsActive = dto.IsActive,
            Permissions = permissionUtils.DeserializePermissions(dto.Permissions)
        }).ToList();
        var totalPages = await GetPageCount();
        
        return (users, totalPages);
    }

    public async Task<User> Create(User user)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string checkEmailQuery = $"""
                                        SELECT COUNT(*) FROM Users WHERE Email = @Email
                                        """;
        var count = await dbConnection.ExecuteScalarAsync<int>(checkEmailQuery, new { user.Email });
        if (count > 0)
        {
            throw new ArgumentException("User with this email already exists.");
        }

        const string sqlQuery = $"""
                                 INSERT INTO Users (Email, PasswordHash, FirstName, LastName)
                                 OUTPUT INSERTED.Id
                                 VALUES (@Email, @PasswordHash, @FirstName, @LastName)
                                 """;
        var userId = await dbConnection.ExecuteScalarAsync<int>(sqlQuery, user);

        return await GetById(userId);
    }

    public Task<User> DeleteById(int id)
    {
        throw new NotImplementedException("Method not implemented for UserRepository.");
    }

    public async Task<LoginResult> Login(string email, string password)
    {
        var candidate = await GetByEmail(email);
        var isPasswordsMatch = BCrypt.Net.BCrypt.Verify(password, candidate.PasswordHash);

        if (!isPasswordsMatch)
        {
            throw new ArgumentException("Incorrect email or password.");
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
                                 SELECT Id, Email, FirstName, LastName, Permissions, PasswordHash, IsActive FROM Users
                                 WHERE Email = @Email
                                 """;

        var userDto = await dbConnection.QueryFirstOrDefaultAsync<UserDto>(sqlQuery, new { Email = email });

        if (userDto == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        var permissionUtils = new PermissionUtils();
        var user = new User()
        {
            Id = userDto.Id,
            Email = userDto.Email,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            IsActive = userDto.IsActive,
            PasswordHash = userDto.PasswordHash,
            Permissions = permissionUtils.DeserializePermissions(userDto.Permissions)
        };

        return user;
    }

    public async Task<User> UpdatePermissions(int userId, string[] permissions)
    {
        using var dbConnection = _dataContext.CreateConnection();
        var user = await GetById(userId);
        var permissionUtils = new PermissionUtils();
        const string sqlQuery = $"""
                                 UPDATE Users
                                 SET Permissions=@Permissions
                                 WHERE Id = @Id
                                 """;

        user.Permissions.Clear();
        var uniquePermissions = permissions.Distinct();
        var newPermissions = uniquePermissions.Select(PermissionFactory.Create);
        user.Permissions.AddRange(newPermissions);

        await dbConnection.ExecuteAsync(sqlQuery, new
        {
            Id = user.Id,
            Permissions = permissionUtils.SerializePermissions(user.Permissions)
        });

        return user;
    }

    public async Task<User> SetUserStatus(int userId, bool isActive)
    {
        var user = await GetById(userId);

        if (user == null)
        {
            throw new KeyNotFoundException("User not found.");
        }

        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE Users
                                 SET IsActive=@IsActive
                                 WHERE Id=@id 
                                 """;

        await dbConnection.ExecuteAsync(sqlQuery, new
        {
            Id = userId,
            isActive = isActive
        });

        user.IsActive = isActive;
        return user;
    }

    public async Task<User> EditUser(User user)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE Users
                                 SET Email=@Email, FirstName=@FirstName, LastName=@LastName
                                 WHERE Id=@Id
                                 """;

        await dbConnection.ExecuteAsync(sqlQuery, user);

        var _user = await GetById(user.Id);

        return _user;
    }

    public async Task<bool> ChangePassword(User user, string password, string newPassword)
    {
        var _user = await GetByEmail(user.Email);
        var isPasswordsMatch = BCrypt.Net.BCrypt.Verify(password, _user.PasswordHash);

        if (!isPasswordsMatch)
        {
            throw new ArgumentException("Incorrect data entered.");
        }

        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE Users
                                 SET PasswordHash=@PasswordHash
                                 WHERE Id=@Id
                                 """;
        var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

        if (newPassword == null) return false;
        
        user.PasswordHash = newPasswordHash;
        await dbConnection.ExecuteAsync(sqlQuery, user);

        return true;
    }
    
    private async Task<int> GetTotalReconds()
    {
        var dbConnection = _dataContext.CreateConnection();
        const string slqQuery = $"""
                                 SELECT COUNT(*) FROM Users
                                 """;

        var totalCount = await dbConnection.QueryFirstAsync<int>(slqQuery);

        return totalCount;
    }
    
    private async Task<int> GetPageCount()
    {
        var totalRecords = await GetTotalReconds();
        int totalPages = (int)Math.Ceiling(totalRecords / (double)Pages.ElementsOnPage);

        return totalPages;
    }
}