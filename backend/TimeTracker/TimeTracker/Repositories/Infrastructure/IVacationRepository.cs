using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface IVacationRepository : IBaseRepository<Vacation>
{
    Task<IEnumerable<Vacation>> GetUserVacations(int userId);
    Task<Vacation> GetLastUserVacation(int userId);
    
}