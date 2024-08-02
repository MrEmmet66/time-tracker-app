using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface IUserRepository : IBaseRepository<User>
{
    public Task<LoginResult> Login(string email, string password);
    public Task<User> GetByEmail(string email);
    public Task<User> UpdatePermissions(int userId, string[] permissions);
    public Task<User> SetUserStatus(int userId, bool isActive);
}