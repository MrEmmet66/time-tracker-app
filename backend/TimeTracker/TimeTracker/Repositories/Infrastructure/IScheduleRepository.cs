using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface IScheduleRepository : IBaseRepository<ScheduleItem>
{
    public Task<IEnumerable<ScheduleItem>> GetAll(int userId, int month);
    public Task<(int Hours, int Minutes)> GetTotalTimeByDate(int userId, DateTimeOffset date);
    public Task<ScheduleItem> Update(ScheduleItem schedule);
    public Task<bool> IsEventOverlap(int userId, DateTimeOffset eventStart, DateTimeOffset eventEnd, int id);
}