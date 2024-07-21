namespace TimeTracker.Repositories.Infrastructure;

public interface IUserRepository<T> : IBaseRepository<T>
{
    public Task<T> Login(string email, string password);
}