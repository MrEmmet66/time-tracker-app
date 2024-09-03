using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface IWorkEntryRepository : IBaseRepository<WorkEntry>
{
    public Task<(IEnumerable<WorkEntry> Entities, int TotalPage)> GetByUserId(int userId, int? page);
    public Task<IEnumerable<WorkEntry>> GetByDate(DateTime startDate, DateTime endDate);
    Task<IEnumerable<WorkEntry>> GetByDate(DateTime startDate, DateTime endDate, int userId);
}