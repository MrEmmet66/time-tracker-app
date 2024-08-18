namespace TimeTracker.Repositories.Infrastructure;

public interface IBaseRepository<T>
{
    public Task<T> GetById(int id);
    public Task<(IEnumerable<T> Entities, int PagesCount)> GetAll(int? page);
    public Task<T> Create(T obj);
    public Task<T> DeleteById(int id);
}