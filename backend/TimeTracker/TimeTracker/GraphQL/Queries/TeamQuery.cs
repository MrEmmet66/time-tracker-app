using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Queries;

public class TeamQuery : ObjectGraphType
{
    public TeamQuery(ITeamRepository repository)
    {
        Field<ListGraphType<TeamType>>("teams")
            .ResolveAsync(async _ => await repository.GetAll()
            ).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<TeamType>(
            "team"
        ).Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" })).ResolveAsync(
            async context =>
            {
                var id = context.GetArgument<int>("id");

                return await repository.GetById(id);
            });

        this.AddAuthorization();
    }
}