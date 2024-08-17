using Dapper;
using TimeTracker.Constants;
using TimeTracker.Data;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.Repositories.Implementations;

public class SickLeaveRepository : ISickLeaveRepository
{
    private readonly DataContext _dataContext;

    public SickLeaveRepository(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    public async Task<SickLeave> GetById(int id)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT SickLeave.Id, StartSickLeave, EndSickLeave, Reason, Status, UserId FROM SickLeave
                                 LEFT JOIN Users u on u.Id = UserId
                                 WHERE SickLeave.Id = @Id
                                 """;
        var sickLeaves = await dbConnection.QueryAsync<SickLeave, User, SickLeave>(sqlQuery, (sickLeave, user) =>
        {
            sickLeave.User = user;
            return sickLeave;
        }, new { Id = id }, splitOn:"UserId");
        SickLeave sickLeave = sickLeaves.FirstOrDefault();
        
        if(sickLeave is null)
            throw new KeyNotFoundException("SickLeave not found.");
        
        return sickLeave;
    }

    public async Task<IEnumerable<SickLeave>> GetAll()
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT SickLeave.Id, StartSickLeave, EndSickLeave, Reason, Status, UserId FROM SickLeave
                                 LEFT JOIN Users u on u.Id = UserId
                                 """;
        return await dbConnection.QueryAsync<SickLeave, User, SickLeave>(sqlQuery, (sickLeave, user) =>
        {
            sickLeave.User = user;
            return sickLeave;
        }, splitOn:"UserId");
    }

    public async Task<SickLeave> Create(SickLeave obj)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                    INSERT INTO SickLeave (UserId, StartSickLeave, EndSickLeave, Reason, Status)
                                    OUTPUT INSERTED.Id
                                    VALUES (@UserId, @StartSickLeave, @EndSickLeave, @Reason, @Status)
                                 """;
        int id = await dbConnection.ExecuteScalarAsync<int>(sqlQuery, new 
            { UserId = obj.User.Id, StartSickLeave = obj.StartSickLeave, EndSickLeave = obj.EndSickLeave, Reason = obj.Reason, Status = obj.Status });
        return await GetById(id);
    }

    public async Task<SickLeave> DeleteById(int id)
    {
        SickLeave sickLeave = await GetById(id);
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 DELETE FROM SickLeave
                                 WHERE Id = @Id
                                 """;
        await dbConnection.ExecuteAsync(sqlQuery, new { Id = id });
        return sickLeave;
    }

    public async Task<IEnumerable<SickLeave>> GetUserSickLeaves(int userId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT SickLeave.Id, StartSickLeave, EndSickLeave, Reason, Status, UserId FROM SickLeave
                                 LEFT JOIN Users u on u.Id = UserId
                                 WHERE SickLeave.UserId = @UserId
                                 """;
        return await dbConnection.QueryAsync<SickLeave, User, SickLeave>(sqlQuery, (sickLeave, user) =>
        {
            sickLeave.User = user;
            return sickLeave;
        }, splitOn:"UserId");
    }

    public async Task<SickLeave> GetLastUserSickLeave(int userId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT TOP 1 SickLeave.Id, StartSickLeave, EndSickLeave, Reason, Status, UserId FROM SickLeave
                                 LEFT JOIN Users u on u.Id = UserId
                                 WHERE SickLeave.UserId = @UserId
                                 ORDER BY StartSickLeave DESC
                                 """;
        var sickLeaves = await dbConnection.QueryAsync<SickLeave, User, SickLeave>(sqlQuery, ((sickLeave, user) =>
        {
            sickLeave.User = user;
            return sickLeave;
        }), new { UserId = userId }, splitOn:"UserId");
        return sickLeaves.FirstOrDefault();
    }

    public async Task<SickLeave> ApproveSickLeave(int sickLeaveId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE SickLeave
                                 SET Status = @Status
                                 WHERE Id = @Id
                                 """;
        
        await dbConnection.ExecuteAsync(sqlQuery, new { Id = sickLeaveId, Status = ApplicationStatuses.Approved });
        return await GetById(sickLeaveId);
    }

    public async Task<SickLeave> RejectSickLeave(int sickLeaveId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE SickLeave
                                 SET Status = @Status
                                 WHERE Id = @Id
                                 """;
        
        await dbConnection.ExecuteAsync(sqlQuery, new { Id = sickLeaveId, Status = ApplicationStatuses.Rejected });
        return await GetById(sickLeaveId);
    }

    public async Task<SickLeave> CancelSickLeave(int sickLeaveId)
    {
        using var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE SickLeave
                                 SET Status = @Status
                                 WHERE Id = @Id
                                 """;
        
        await dbConnection.ExecuteAsync(sqlQuery, new { Id = sickLeaveId, Status = ApplicationStatuses.Cancelled });
        return await GetById(sickLeaveId);
    }
}