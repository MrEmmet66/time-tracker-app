using Dapper;
using TimeTracker.Constants;
using TimeTracker.Data;
using TimeTracker.Dtos;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;
using TimeTracker.Utils;

namespace TimeTracker.Repositories.Implementations;

public class VacationRepository : IVacationRepository
{
    private readonly DataContext _dataContext;

    public VacationRepository(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Vacation> GetById(int id)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Vacations.Id, StartVacation, EndVacation, Status, UserId, u.* FROM Vacations
                                 LEFT JOIN Users u on u.Id = UserId
                                 WHERE Vacations.Id = @Id
                                 """;
        var permissionUtils = new PermissionUtils();
        var vacation = await dbConnection.QueryAsync<Vacation, UserDto, Vacation>(sqlQuery, (vac, user) =>
        {
            vac.User = new User
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsActive = user.IsActive,
                Permissions = permissionUtils.DeserializePermissions(user.Permissions)
            };
            return vac;
        }, new { Id = id }, splitOn:"UserId");
        return vacation.FirstOrDefault();
    }
    
    public async  Task<(IEnumerable<Vacation> Entities, int PagesCount)> GetAll(int? page = 1)
    {
        using var dbConnection = _dataContext.CreateConnection();
        var permissionUtils = new PermissionUtils();
        const string sqlQuery = $"""
                                 SELECT Vacations.Id, StartVacation, EndVacation, Status, UserId, u.* FROM Vacations
                                 LEFT JOIN Users u on u.Id = UserId
                                 ORDER BY StartVacation DESC
                                 OFFSET @Offset ROWS
                                 FETCH NEXT @PageSize ROWS ONLY
                                 """;
        var vacations = await dbConnection.QueryAsync<Vacation, UserDto, Vacation>(sqlQuery, (vac, user) =>
        {
            
            vac.User = new User
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsActive = user.IsActive,
                Permissions = permissionUtils.DeserializePermissions(user.Permissions)
            };
            return vac;
        }, new { Offset = (page - 1) * Pages.ElementsOnPage, PageSize = Pages.ElementsOnPage }, splitOn:"UserId");
        
        var totalPages = await GetPageCount();
        return (vacations, totalPages);
    }

    public async Task<Vacation> Create(Vacation obj)
    {
        using var dbConnection = _dataContext.CreateConnection();
        
        const string sqlQuery = $"""
                                    INSERT INTO Vacations (UserId, StartVacation, EndVacation, Status)
                                    OUTPUT INSERTED.Id
                                    VALUES (@UserId, @StartVacation, @EndVacation, @Status)
                                 """;
        var vacationId = await dbConnection.ExecuteScalarAsync<int>(sqlQuery, new
        {
            UserId = obj.User.Id,
            StartVacation = obj.StartVacation.ToString("s"),
            EndVacation = obj.EndVacation.ToString("s"),
            Status = obj.Status
        });
        return await GetById(vacationId);
    }

    public async Task<Vacation> DeleteById(int id)
    {
        Vacation vacation = await GetById(id);
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 DELETE FROM Vacations
                                 WHERE Id = @Id
                                 """;
        await dbConnection.ExecuteAsync(sqlQuery, new { Id = id });
        return vacation;
    }

    public async Task<IEnumerable<Vacation>> GetUserVacations(int userId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Vacations.Id, StartVacation, EndVacation, Status, UserId, u.* FROM Vacations
                                 LEFT JOIN Users u on u.Id = UserId
                                 WHERE Vacations.UserId = @UserId
                                 """;
        var permissionUtils = new PermissionUtils();
        var vacations = await dbConnection.QueryAsync<Vacation, UserDto, Vacation>(sqlQuery, (vac, user) =>
        {
            vac.User = new User
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsActive = user.IsActive,
                Permissions = permissionUtils.DeserializePermissions(user.Permissions)
            };
            return vac;
        }, new { UserId = userId }, splitOn:"UserId");
        return vacations;
    }
    public async Task<Vacation> GetLastUserVacation(int userId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT TOP 1 Vacations.Id, StartVacation, EndVacation, Status, UserId, u.* FROM Vacations
                                 LEFT JOIN Users u on u.Id = UserId
                                 WHERE UserId = @UserId
                                 ORDER BY StartVacation DESC
                                 """;
        var permissionUtils = new PermissionUtils();
        var vacations = await dbConnection.QueryAsync<Vacation, UserDto, Vacation>(sqlQuery, (vac, user) =>
        {
            vac.User = new User
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsActive = user.IsActive,
                Permissions = permissionUtils.DeserializePermissions(user.Permissions)
            };
            return vac;
        }, new { UserId = userId }, splitOn:"UserId");
        return vacations.FirstOrDefault();
    }
    

    public async Task<Vacation> ApproveVacation(int vacationId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE Vacations
                                 SET Status = @Status
                                 WHERE Id = @Id
                                 """;
        await dbConnection.ExecuteAsync(sqlQuery, new { Id = vacationId, Status = ApplicationStatuses.Approved });
        return await GetById(vacationId);
    }

    public async Task<Vacation> RejectVacation(int vacationId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE Vacations
                                 SET Status = @Status
                                 WHERE Id = @Id
                                 """;
        await dbConnection.ExecuteAsync(sqlQuery, new { Id = vacationId, Status = ApplicationStatuses.Rejected });
        return await GetById(vacationId);
    }

    public async Task<Vacation> CancelVacation(int vacationId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE Vacations
                                 SET Status = @Status
                                 WHERE Id = @Id
                                 """;
        await dbConnection.ExecuteAsync(sqlQuery, new { Id = vacationId, Status = ApplicationStatuses.Cancelled });
        return await GetById(vacationId);
    }
    
    private async Task<int> GetTotalRecords()
    {
        var dbConnection = _dataContext.CreateConnection();
        const string slqQuery = $"""
                                 SELECT COUNT(*) FROM Vacations
                                 """;

        var totalCount = await dbConnection.QueryFirstAsync<int>(slqQuery);

        return totalCount;
    }
    
    private async Task<int> GetPageCount()
    {
        var totalRecords = await GetTotalRecords();
        int totalPages = (int)Math.Ceiling(totalRecords / (double)Pages.ElementsOnPage);

        return totalPages;
    }
}