using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface IWorkEntryRepository : IBaseRepository<WorkEntry>
{
    public Task<(IEnumerable<WorkEntry> Entities, int TotalPage)> GetByUserId(int userId, int? page);
    public Task<IEnumerable<WorkEntry>> GetByDate(DateTime date);
    Task<IEnumerable<WorkEntry>> GetByDate(DateTime date, int userId);
}