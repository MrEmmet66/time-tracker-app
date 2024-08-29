using TimeTracker.Repositories.Infrastructure;
using TimeTracker.Utils;

namespace TimeTracker.Middlewares;

public class AuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IJwtUtils _jwtUtils;

    public AuthMiddleware(RequestDelegate next, IJwtUtils jwtUtils)
    {
        _next = next;
        _jwtUtils = jwtUtils;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var userId = _jwtUtils.ValidateToken(token);
        if (userId != null)
        {
            var userRepository = context.RequestServices.GetRequiredService<IUserRepository>();
            var user = await userRepository.GetById(userId.Value);
            context.Items["User"] = user;
        }

        await _next(context);
    }
}