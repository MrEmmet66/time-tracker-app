using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface IWorkEntryRepository : IBaseRepository<WorkEntry>
{
    public Task<IEnumerable<WorkEntry>> GetByUserId(int userId);
    public Task<IEnumerable<WorkEntry>> GetByDate(DateTime date);
}