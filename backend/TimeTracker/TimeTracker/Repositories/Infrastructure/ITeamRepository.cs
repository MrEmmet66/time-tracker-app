using TimeTracker.Models;

namespace TimeTracker.Repositories.Infrastructure;

public interface ITeamRepository : IBaseRepository<Team>
{
    public Task<Team> AddUserToTeam(Team team, User user);
    public Task<Team> RemoveUserFromTeam(Team team, User user);
}