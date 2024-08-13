using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface IVacationRepository : IBaseRepository<Vacation>
{
    Task<IEnumerable<Vacation>> GetUserVacations(int userId);
    Task<Vacation> GetLastUserVacation(int userId);
    Task<Vacation> ApproveVacation(int vacationId);
    Task<Vacation> RejectVacation(int vacationId);
    Task<Vacation> CancelVacation(int vacationId);
    
}