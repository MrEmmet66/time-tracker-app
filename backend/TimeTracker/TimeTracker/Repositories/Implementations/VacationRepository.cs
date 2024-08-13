using Dapper;
using TimeTracker.Constants;
using TimeTracker.Data;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;

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
                                 SELECT Vacations.Id, UserId, StartVacation, EndVacation, Status FROM Vacations
                                 LEFT JOIN Users u on u.Id = UserId
                                 WHERE Vacations.Id = @Id
                                 """;
        var vacation = await dbConnection.QueryAsync<Vacation, User, Vacation>(sqlQuery, (vac, user) =>
        {
            vac.User = user;
            return vac;
        }, new { Id = id }, splitOn:"UserId");
        return vacation.FirstOrDefault();
    }

    public async Task<IEnumerable<Vacation>> GetAll()
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT Vacations.Id, UserId, StartVacation, EndVacation, Status FROM Vacations
                                 LEFT JOIN Users u on u.Id = UserId
                                 """;
        var vacations = await dbConnection.QueryAsync<Vacation, User, Vacation>(sqlQuery, (vac, user) =>
        {
            vac.User = user;
            return vac;
        }, splitOn:"UserId");
        return vacations;
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
                                 SELECT Vacations.Id, UserId, StartVacation, EndVacation, Status FROM Vacations
                                 LEFT JOIN Users u on u.Id = UserId
                                 WHERE Vacations.UserId = @UserId
                                 """;
        var vacations = await dbConnection.QueryAsync<Vacation, User, Vacation>(sqlQuery, (vac, user) =>
        {
            vac.User = user;
            return vac;
        }, new { UserId = userId }, splitOn:"UserId");
        return vacations;
    }

    public async Task<Vacation> GetLastUserVacation(int userId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT TOP 1 Vacations.Id, UserId, StartVacation, EndVacation, Status FROM Vacations
                                 LEFT JOIN Users u on u.Id = UserId
                                 WHERE UserId = @UserId
                                 ORDER BY StartVacation DESC
                                 """;
        var vacations = await dbConnection.QueryAsync<Vacation, User, Vacation>(sqlQuery, (vac, user) =>
        {
            vac.User = user;
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
}