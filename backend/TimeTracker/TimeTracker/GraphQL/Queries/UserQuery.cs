using GraphQL;
using GraphQL.Types;
using TimeTracker.GraphQL.Types;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Queries;

public class UserQuery : ObjectGraphType
{
    public UserQuery(IUserRepository repository)
    {
        Field<ListGraphType<UserType>>("users")
            .ResolveAsync(async _ => await repository.GetAll()
            );

        Field<UserType>(
            "user"
        ).Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" })).ResolveAsync(
            async context =>
            {
                var id = context.GetArgument<int>("id");

                return await repository.GetById(id);
            });
    }
}