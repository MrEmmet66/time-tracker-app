using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TimeTracker.Options;

public class AuthOptions
{
    static AuthOptions()
    {
        DotNetEnv.Env.Load();
        KEY = Environment.GetEnvironmentVariable("JWT_SECRET_KEY") ?? throw new InvalidOperationException("JWT_SECRET_KEY not found in environment variables");
    }
    
    private static readonly string KEY;
    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}