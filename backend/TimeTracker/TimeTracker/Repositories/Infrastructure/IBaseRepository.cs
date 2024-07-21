namespace TimeTracker.Repositories.Infrastructure;

public interface IBaseRepository<T>
{
    public Task<T> GetById(int id);
    public Task<IEnumerable<T>> GetAll();
    public Task<T> Create(T obj);
    public Task<T> DeleteById();
}