using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface IScheduleRepository : IBaseRepository<ScheduleItem>
{
    public Task<ScheduleItem> GetByUserId(int userId);
    public Task<IEnumerable<ScheduleItem>> GetAll(int userId, int month);
    public Task<ScheduleItem> Update(ScheduleItem schedule);
}