using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface ISickLeaveRepository : IBaseRepository<SickLeave>
{
    Task<IEnumerable<SickLeave>>GetUserSickLeaves(int userId);
    Task<SickLeave> GetLastUserSickLeave(int userId);
    Task<IEnumerable<SickLeave>> GetSickLeavesByPage(int page, int pageSize = 20);
    Task<SickLeave> ApproveSickLeave(int sickLeaveId);
    Task<SickLeave> RejectSickLeave(int sickLeaveId);
    Task<SickLeave> CancelSickLeave(int sickLeaveId);
}