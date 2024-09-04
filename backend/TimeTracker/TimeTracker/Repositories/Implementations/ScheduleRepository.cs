using Dapper;
using TimeTracker.Data;
using TimeTracker.Dtos;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;
using TimeTracker.Utils;

namespace TimeTracker.Repositories.Implementations;

public class ScheduleRepository : IScheduleRepository
{
    private readonly DataContext _dataContext;

    public ScheduleRepository(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<ScheduleItem> GetById(int id)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT schedule.*, us.*
                                 FROM Schedules schedule
                                 LEFT JOIN Users us ON schedule.UserId=us.Id
                                 WHERE schedule.Id=@Id
                                 """;

        var permissionUtils = new PermissionUtils();
        var schedulesDictionary = new Dictionary<int, ScheduleItem>();
        await dbConnection.QueryAsync<ScheduleItem, UserDto, ScheduleItem>(sqlQuery, (scheduleItem, userDto) =>
            {
                if (!schedulesDictionary.TryGetValue(scheduleItem.Id, out var currentScheduleItem))
                {
                    currentScheduleItem = scheduleItem;
                    currentScheduleItem.User = new User()
                    {
                        Id = userDto.Id,
                        FirstName = userDto.FirstName,
                        LastName = userDto.LastName,
                        Email = userDto.Email,
                        IsActive = userDto.IsActive,
                        Permissions = permissionUtils.DeserializePermissions(userDto.Permissions)
                    };
                    schedulesDictionary.Add(currentScheduleItem.Id, currentScheduleItem);
                }

                return currentScheduleItem;
            }, new { Id = id },
            splitOn: "UserId");

        var scheduleItem = schedulesDictionary.Values.FirstOrDefault();

        if (scheduleItem == null)
        {
            throw new KeyNotFoundException("Schedules item no found");
        }

        return scheduleItem;
    }

    public async Task<IEnumerable<ScheduleItem>> GetAll(int userId, int month)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT schedule.*, us.*
                                 FROM Schedules schedule
                                 LEFT JOIN Users us ON schedule.UserId = us.Id
                                 WHERE schedule.UserId = @UserId
                                 AND MONTH(schedule.EventStart) = @Month
                                 """;

        var permissionUtils = new PermissionUtils();
        var schedulesDictionary = new Dictionary<int, ScheduleItem>();
        await dbConnection.QueryAsync<ScheduleItem, UserDto, ScheduleItem>(sqlQuery, (scheduleItem, userDto) =>
            {
                if (!schedulesDictionary.TryGetValue(scheduleItem.Id, out var currentScheduleItem))
                {
                    currentScheduleItem = scheduleItem;
                    currentScheduleItem.User = new User()
                    {
                        Id = userDto.Id,
                        FirstName = userDto.FirstName,
                        LastName = userDto.LastName,
                        Email = userDto.Email,
                        IsActive = userDto.IsActive,
                        Permissions = permissionUtils.DeserializePermissions(userDto.Permissions)
                    };
                    schedulesDictionary.Add(currentScheduleItem.Id, currentScheduleItem);
                }

                return currentScheduleItem;
            }, new { UserId = userId, Month = month },
            splitOn: "UserId");

        return schedulesDictionary.Values.ToList();
    }

    public async Task<ScheduleItem> Update(ScheduleItem schedule)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE Schedules 
                                 SET Title=@Title, Description=@Description, EventStart=@EventStart, EventEnd=@EventEnd
                                 WHERE Id=@Id
                                 """;

        await dbConnection.ExecuteAsync(sqlQuery, schedule);

        return await GetById(schedule.Id);
    }

    public async Task<ScheduleItem> Create(ScheduleItem obj)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 INSERT INTO Schedules (Title, Description, EventStart, EventEnd, UserId)
                                 OUTPUT INSERTED.Id
                                 VALUES (@Title, @Description, @EventStart, @EventEnd, @UserId)
                                 """;
        var scheduleItemId = await dbConnection.ExecuteScalarAsync<int>(sqlQuery, new
        {
            Title = obj.Title,
            Description = obj.Description,
            EventStart = obj.EventStart,
            EventEnd = obj.EventEnd,
            UserId = obj.User.Id
        });

        return await GetById(scheduleItemId);
    }

    public async Task<ScheduleItem> DeleteById(int id)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 DELETE FROM Schedules
                                 WHERE Id=@Id
                                 """;

        var schedulesItem = await GetById(id);
        await dbConnection.ExecuteAsync(sqlQuery, new { Id = id });

        return schedulesItem;
    }

    public async Task<(int Hours, int Minutes)> GetTotalTimeByDate(int userId, DateTimeOffset date)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT SUM(DATEDIFF(MINUTE, EventStart, EventEnd)) AS TotalMinutes
                                 FROM Schedules
                                 WHERE UserId=@UserId AND CONVERT(DATE, EventStart) = @Date
                                 """;

        var totalMinutes =
            await dbConnection.ExecuteScalarAsync<int>(sqlQuery, new { UserId = userId, Date = date.Date });
        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;

        return (hours, minutes);
    }

    public async Task<bool> IsEventOverlap(int userId, DateTimeOffset eventStart, DateTimeOffset eventEnd, int id)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT COUNT(1)
                                 FROM Schedules
                                 WHERE UserId = @UserId
                                 AND Id != @Id
                                 AND (
                                     (EventStart < @EventEnd AND EventEnd > @EventStart)
                                     OR (EventStart >= @EventStart AND EventStart < @EventEnd)
                                     OR (EventEnd > @EventStart AND EventEnd <= @EventEnd)
                                     OR (EventStart <= @EventStart AND EventEnd >= @EventEnd)
                                 )
                                 """;
        
        var count = await dbConnection.ExecuteScalarAsync<int>(
            sqlQuery,
            new { Id = id, UserId = userId, EventStart = eventStart, EventEnd = eventEnd });

        return count > 0;
    }

    public Task<(IEnumerable<ScheduleItem> Entities, int PagesCount)> GetAll(int? page)
    {
        throw new NotImplementedException();
    }
}