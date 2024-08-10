using Dapper;
using TimeTracker.Data;
using TimeTracker.Dtos;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;
using TimeTracker.Utils;

namespace TimeTracker.Repositories.Implementations;

public class WorkEntryRepository : IWorkEntryRepository
{
    private readonly DataContext _dataContext;

    public WorkEntryRepository(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<WorkEntry> GetById(int id)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT workEntry.*, us.Id AS UserId, us.Email, us.FirstName, us.LastName, us.IsActive, us.Permissions 
                                 FROM WorkEntries workEntry
                                 JOIN Users us ON workEntry.UserId = us.Id         
                                 WHERE workEntry.Id=@Id
                                 """;

        var permissionUtils = new PermissionUtils();
        var workEntryDictionary = new Dictionary<int, WorkEntry>();
        await dbConnection.QueryAsync<WorkEntry, UserDto, WorkEntry>(sqlQuery, (workEntry, user) =>
        {
            if (!workEntryDictionary.TryGetValue(workEntry.Id, out var currentWorkEntry))
            {
                currentWorkEntry = workEntry;
                currentWorkEntry.User = new User()
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    IsActive = user.IsActive,
                    Permissions = permissionUtils.DeserializePermissions(user.Permissions)
                };
                workEntryDictionary.Add(currentWorkEntry.Id, currentWorkEntry);
            }

            return currentWorkEntry;
        }, new
        {
            Id = id
        }, splitOn: "UserId");

        var workEntry = workEntryDictionary.Values.FirstOrDefault();

        if (workEntry == null)
        {
            throw new KeyNotFoundException("Work entry no found");
        }

        return workEntry;
    }

    public async Task<IEnumerable<WorkEntry>> GetAll()
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT workEntry.*, us.Id AS UserId, us.Email, us.FirstName, us.LastName, us.IsActive, us.Permissions 
                                 FROM WorkEntries workEntry
                                 JOIN Users us ON workEntry.UserId = us.Id         
                                 """;

        var permissionUtils = new PermissionUtils();
        var workEntryDictionary = new Dictionary<int, WorkEntry>();
        await dbConnection.QueryAsync<WorkEntry, UserDto, WorkEntry>(sqlQuery, (workEntry, user) =>
        {
            if (!workEntryDictionary.TryGetValue(workEntry.Id, out var currentWorkEntry))
            {
                currentWorkEntry = workEntry;
                currentWorkEntry.User = new User()
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    IsActive = user.IsActive,
                    Permissions = permissionUtils.DeserializePermissions(user.Permissions)
                };
                workEntryDictionary.Add(currentWorkEntry.Id, currentWorkEntry);
            }

            return currentWorkEntry;
        }, splitOn: "UserId");

        return workEntryDictionary.Values.ToList();
    }

    public async Task<WorkEntry> Create(WorkEntry obj)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 INSERT INTO WorkEntries (StartDateTime, EndDateTime, UserId)
                                 OUTPUT INSERTED.Id
                                 VALUES (@StartDateTime, @EndDateTime, @UserId)
                                 """;
        
        var workEntryId = await dbConnection.ExecuteAsync(sqlQuery, new
        {
            StartDateTime = obj.StartDateTime,
            EndDateTime = obj.EndDateTime,
            UserId = obj.User.Id
        });

        return await GetById(workEntryId);
    }

    public Task<WorkEntry> DeleteById(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<WorkEntry>> GetByUserId(int userId)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT * FROM WorkEntries
                                 WHERE UserId=@UserId
                                 """;

        var workEntries = await dbConnection.QueryAsync<WorkEntry>(sqlQuery, new { UserId = userId });

        return workEntries;
    }

    public async Task<IEnumerable<WorkEntry>> GetByDate(DateTime date)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT * FROM WorkEntries
                                 WHERE CAST(StartDateTime AS DATE)=CAST(@Date AS DATE)
                                 """;

        var workEntries = await dbConnection.QueryAsync<WorkEntry>(sqlQuery, new { Date = date });

        return workEntries;
    }
}