namespace TimeTracker.Models;

public abstract class BasePermission
{
    public BasePermission(string name)
    {
        Name = name;
    }
    
    public string Name { get; set; }

    public virtual bool CanExecute(User user)
    {
        return user.Permissions.Any(p => p.Name == Name);
    }
}