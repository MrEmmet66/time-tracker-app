using TimeTracker.Models;

namespace TimeTracker.Utils;

public interface IJwtUtils
{
    public string GenerateToken(User user);
    public int? ValidateToken(string token);
}