using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Queries;

public class UserQuery : ObjectGraphType
{
    public UserQuery(IUserRepository repository)
    {
        Field<EntitiesResultType<UserType>>("users")
            .Arguments(new QueryArguments(new QueryArgument<IntGraphType> { Name = "page" }))
            .ResolveAsync(async context =>
                {
                    var page = context.GetArgument<int?>("page") ?? 1;
                    var (users, totalPages) = await repository.GetAll(page);

                    return new
                    {
                        Entities = users,
                        TotalPages = totalPages
                    };
                }
            ).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<UserType>(
            "user"
        ).Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" })).ResolveAsync(
            async context =>
            {
                try
                {
                    var id = context.GetArgument<int>("id");

                    return await repository.GetById(id);
                }
                catch (KeyNotFoundException ex)
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
            });

        this.AddAuthorization();
    }
}