using Dapper;
using TimeTracker.Constants;
using TimeTracker.Data;
using TimeTracker.Dtos;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;
using TimeTracker.Utils;

namespace TimeTracker.Repositories.Implementations;

public class TeamRepository : ITeamRepository
{
    private readonly DataContext _dataContext;

    public TeamRepository(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    public async Task<Team> GetById(int id)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT team.*, us.Id, us.FirstName, us.LastName, us.Email, us.Permissions
                                 FROM Teams team
                                 LEFT JOIN TeamUser tu ON team.Id = tu.TeamId AND tu.IsActive=1
                                 LEFT JOIN Users us ON tu.UserId = us.Id
                                 WHERE team.Id=@Id
                                 """;

        var permissionUtils = new PermissionUtils();
        var teamDictionary = new Dictionary<int, Team>();
        await dbConnection.QueryAsync<Team, UserDto, Team>(sqlQuery, (team, userDto) =>
            {
                if (!teamDictionary.TryGetValue(team.Id, out var currentTeam))
                {
                    currentTeam = team;
                    teamDictionary.Add(currentTeam.Id, currentTeam);
                }

                if (userDto != null)
                {
                    var user = new User()
                    {
                        Id = userDto.Id,
                        Email = userDto.Email,
                        FirstName = userDto.FirstName,
                        LastName = userDto.LastName,
                        IsActive = userDto.IsActive,
                        Permissions = permissionUtils.DeserializePermissions(userDto.Permissions)
                    };
                    currentTeam.Members.Add(user);
                }

                return currentTeam;
            }, new { Id = id },
            splitOn: "Id");

        var team = teamDictionary.Values.FirstOrDefault();

        if (team == null)
        {
            throw new KeyNotFoundException("Team not found.");
        }

        return team;
    }

    public async Task<(IEnumerable<Team> Entities, int PagesCount)> GetAll(int? page = 1)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT team.*, us.Id, us.FirstName, us.LastName, us.Email, us.Permissions
                                 FROM Teams team
                                 LEFT JOIN TeamUser tu ON team.Id = tu.TeamId AND tu.IsActive=1
                                 LEFT JOIN Users us ON tu.UserId = us.Id
                                 ORDER BY team.Id
                                 OFFSET @OffsetItems ROWS
                                 FETCH NEXT @FetchItems ROWS ONLY
                                 """;

        var permissionUtils = new PermissionUtils();
        var teamsDictionary = new Dictionary<int, Team>();
        await dbConnection.QueryAsync<Team, UserDto, Team>(sqlQuery, (team, userDto) =>
        {
            if (!teamsDictionary.TryGetValue(team.Id, out var currentTeam))
            {
                currentTeam = team;
                teamsDictionary.Add(currentTeam.Id, currentTeam);
            }

            if (userDto != null)
            {
                var user = new User()
                {
                    Id = userDto.Id,
                    Email = userDto.Email,
                    FirstName = userDto.FirstName,
                    LastName = userDto.LastName,
                    IsActive = userDto.IsActive,
                    Permissions = permissionUtils.DeserializePermissions(userDto.Permissions)
                };
                currentTeam.Members.Add(user);
            }

            return currentTeam;
        }, new
        {
            OffsetItems = Pages.ElementsOnPage * --page,
            FetchItems = Pages.ElementsOnPage
        }, splitOn: "Id");
        var totalPages = await GetPageCount();

        return (teamsDictionary.Values.ToList(), totalPages);
    }

    public async Task<Team> Create(Team obj)
    {
        var isExistTeamName = await IsExistTeamName(obj.Name);

        if (isExistTeamName)
        {
            throw new ArgumentException("A team with this name already exists");
        }

        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 INSERT INTO Teams (Name)
                                 OUTPUT INSERTED.Id
                                 VALUES (@Name) 
                                 """;

        var teamId = await dbConnection.ExecuteScalarAsync<int>(sqlQuery, new
        {
            Name = obj.Name
        });
        var team = await GetById(teamId);

        return team;
    }

    public Task<Team> DeleteById(int id)
    {
        throw new NotImplementedException();
    }

    public async Task<Team> AddUserToTeam(Team team, User user)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 INSERT INTO TeamUser (UserId, TeamId)
                                 VALUES (@UserId, @TeamId)
                                 """;

        await dbConnection.ExecuteAsync(sqlQuery, new
        {
            UserId = user.Id,
            TeamId = team.Id
        });

        return team;
    }

    public async Task<Team> RemoveUserFromTeam(Team team, User user)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 UPDATE TeamUser
                                 SET IsActive=0
                                 WHERE TeamId=@TeamId AND UserId=@UserId
                                 """;

        await dbConnection.ExecuteAsync(sqlQuery, new
        {
            UserId = user.Id,
            TeamId = team.Id
        });

        return team;
    }

    private async Task<bool> IsExistTeamName(string teamName)
    {
        var dbConnection = _dataContext.CreateConnection();
        const string sqlQuery = $"""
                                 SELECT * FROM Teams
                                 WHERE Name=@Name
                                 """;
        var team = await dbConnection.QueryFirstOrDefaultAsync<Team>(sqlQuery, new { Name = teamName });

        return team != null;
    }
    
    private async Task<int> GetTotalReconds()
    {
        var dbConnection = _dataContext.CreateConnection();
        const string slqQuery = $"""
                                 SELECT COUNT(*) FROM Teams
                                 """;

        var totalCount = await dbConnection.QueryFirstAsync<int>(slqQuery);

        return totalCount;
    }
    
    private async Task<int> GetPageCount()
    {
        var totalRecords = await GetTotalReconds();
        int totalPages = (int)Math.Ceiling(totalRecords / (double)Pages.ElementsOnPage);

        return totalPages;
    }
}