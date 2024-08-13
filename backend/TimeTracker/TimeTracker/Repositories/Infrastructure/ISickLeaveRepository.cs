using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface ISickLeaveRepository : IBaseRepository<SickLeave>
{
    Task<IEnumerable<SickLeave>>GetUserSickLeaves(int userId);
    Task<SickLeave> GetLastUserSickLeave(int userId);
}