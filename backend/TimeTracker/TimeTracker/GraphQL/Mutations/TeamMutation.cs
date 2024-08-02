using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Mutations;

public class TeamMutation : ObjectGraphType
{
    public TeamMutation(ITeamRepository repository, IUserRepository userRepository)
    {
        Field<TeamType>("createTeam").Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<StringGraphType>> { Name = "name" }
            ))
            .ResolveAsync(async context =>
            {
                var teamName = context.GetArgument<string>("name");

                var team = new Team()
                {
                    Name = teamName,
                };

                return await repository.Create(team);
            }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<TeamType>("addUserToTeam").Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "teamId" },
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" }
            ))
            .ResolveAsync(async context =>
            {
                var teamId = context.GetArgument<int>("teamId");
                var userId = context.GetArgument<int>("userId");
                var team = await repository.GetById(teamId);
                var user = await userRepository.GetById(userId);

                return await repository.AddUserToTeam(team, user);
            }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<TeamType>("removeUserFromTeam").Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "teamId" },
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" }
            ))
            .ResolveAsync(async context =>
            {
                var teamId = context.GetArgument<int>("teamId");
                var userId = context.GetArgument<int>("userId");
                var team = await repository.GetById(teamId);
                var user = await userRepository.GetById(userId);

                return await repository.RemoveUserFromTeam(team, user);
            }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        this.AddAuthorization();
    }
}