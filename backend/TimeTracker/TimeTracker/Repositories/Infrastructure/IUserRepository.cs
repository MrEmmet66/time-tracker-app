using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface IUserRepository : IBaseRepository<User>
{
    public Task<User> Login(string email, string password);
    public Task<User> GetByEmail(string email);
}