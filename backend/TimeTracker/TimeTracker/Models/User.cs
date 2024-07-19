namespace TimeTracker.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public List<BasePermission> Permissions { get; set; }
    public string Team { get; set; }
}