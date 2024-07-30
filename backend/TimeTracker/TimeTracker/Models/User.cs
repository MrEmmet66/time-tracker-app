namespace TimeTracker.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PasswordHash { get; set; }
    public bool IsActive { get; set; }
    public List<BasePermission> Permissions { get; set; }
    public Team Team { get; set; }
}