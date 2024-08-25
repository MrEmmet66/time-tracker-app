using GraphQL;
using GraphQL.Types;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Queries;

public class ScheduleQuery : ObjectGraphType
{
    public ScheduleQuery(IScheduleRepository repository)
    {
        Field<ListGraphType<ScheduleItemType>>("schedules").Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" },
                new QueryArgument<IntGraphType> { Name = "month" }
            ))
            .ResolveAsync(async context =>
                {
                    var userId = context.GetArgument<int>("userId");
                    var month = context.GetArgument<int?>("month") ?? DateTime.Now.Month;;

                    return await repository.GetAll(userId, month);
                }
            );

        Field<ScheduleItemType>("schedule")
            .Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" }
            ))
            .ResolveAsync(async context =>
                {
                    var id = context.GetArgument<int>("id");

                    return await repository.GetById(id);
                }
            );

        this.AddAuthorization();
    }
}