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
                try
                {
                    var teamName = context.GetArgument<string>("name");

                    var team = new Team()
                    {
                        Name = teamName,
                    };

                    return await repository.Create(team);
                }
                catch (ArgumentException ex)
                {
                    context.Errors.Add(new ExecutionError(ex.Message));
                    return null;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                    return null;
                }
            }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<TeamType>("addUserToTeam").Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "teamId" },
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" }
            ))
            .ResolveAsync(async context =>
            {
                try
                {
                    var teamId = context.GetArgument<int>("teamId");
                    var userId = context.GetArgument<int>("userId");
                    var team = await repository.GetById(teamId);
                    var user = await userRepository.GetById(userId);

                    return await repository.AddUserToTeam(team, user);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                    return null;
                }
            }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<TeamType>("removeUserFromTeam").Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "teamId" },
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" }
            ))
            .ResolveAsync(async context =>
            {
                try
                {
                    var teamId = context.GetArgument<int>("teamId");
                    var userId = context.GetArgument<int>("userId");
                    var team = await repository.GetById(teamId);
                    var user = await userRepository.GetById(userId);

                    return await repository.RemoveUserFromTeam(team, user);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                    return null;
                }
            }).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        this.AddAuthorization();
    }
}