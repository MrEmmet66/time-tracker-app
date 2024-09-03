using Dapper;
using TimeTracker.Constants;
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

    public async Task<(IEnumerable<WorkEntry> Entities, int PagesCount)> GetAll(int? page = 1)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT workEntry.*, us.Id AS UserId, us.Email, us.FirstName, us.LastName, us.IsActive, us.Permissions 
                                 FROM WorkEntries workEntry
                                 JOIN Users us ON workEntry.UserId = us.Id
                                 ORDER BY workEntry.StartDateTime DESC
                                 OFFSET @OffsetItems ROWS
                                 FETCH NEXT @FetchItems ROWS ONLY
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
            OffsetItems = Pages.ElementsOnPage * --page,
            FetchItems = Pages.ElementsOnPage
        }, splitOn: "UserId");

        var totalRecords = await GetTotalRecords(null);
        var totalPages = GetPageCount(totalRecords);

        return (workEntryDictionary.Values.ToList(), totalPages);
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

    public async Task<(IEnumerable<WorkEntry> Entities, int TotalPage)> GetByUserId(int userId, int? page = 1)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT * FROM WorkEntries
                                 WHERE UserId=@UserId
                                 ORDER BY StartDateTime DESC
                                 OFFSET @OffsetItems ROWS
                                 FETCH NEXT @FetchItems ROWS ONLY
                                 """;

        var workEntries = await dbConnection.QueryAsync<WorkEntry>(sqlQuery, new
        {
            UserId = userId,
            OffsetItems = Pages.ElementsOnPage * --page,
            FetchItems = Pages.ElementsOnPage
        });
        var totalRecords = await GetTotalRecords(userId);
        var totalPages = GetPageCount(totalRecords);

        return (workEntries, totalPages);
    }

    public async Task<IEnumerable<WorkEntry>> GetByDate(DateTime startDate, DateTime endDate)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT * FROM WorkEntries
                                 WHERE StartDateTime BETWEEN @StartDate AND @EndDate
                                 ORDER BY StartDateTime DESC
                                 """;

        var workEntries = await dbConnection.QueryAsync<WorkEntry>(sqlQuery, new { StartDate = startDate, EndDate = endDate });

        return workEntries;
    }

    public async Task<IEnumerable<WorkEntry>> GetByDate(DateTime startDate, DateTime endDate, int userId)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT * FROM WorkEntries
                                 WHERE StartDateTime BETWEEN @StartDate AND @EndDate AND UserId=@UserId
                                 ORDER BY StartDateTime DESC
                                 """;

        var workEntries = await dbConnection.QueryAsync<WorkEntry>(sqlQuery, new { StartDate = startDate, EndDate = endDate, UserId = userId });

        return workEntries;
    }

    private async Task<int> GetTotalRecords(int? userId)
    {
        var dbConnection = _dataContext.CreateConnection();
        string slqQuery = $"""
                           SELECT COUNT(*) 
                           FROM WorkEntries
                           """ + (userId.HasValue ? " WHERE UserId=@UserId" : "");

        var totalCount = await dbConnection.QueryFirstAsync<int>(slqQuery, new {userId=userId});

        return totalCount;
    }

    private int GetPageCount(int totalRecords)
    {
        return (int)Math.Ceiling(totalRecords / (double)Pages.ElementsOnPage);
    }
}