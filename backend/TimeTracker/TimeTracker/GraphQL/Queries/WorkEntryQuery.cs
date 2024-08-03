using GraphQL;
using GraphQL.Types;
using TimeTracker.Constants;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Queries;

public class WorkEntryQuery : ObjectGraphType
{
    public WorkEntryQuery(IWorkEntryRepository repository)
    {
        Field<ListGraphType<WorkEntryType>>("workEntries")
            .ResolveAsync(async _ => await repository.GetAll()
            ).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<WorkEntryType>(
            "workEntry"
        ).Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" })).ResolveAsync(
            async context =>
            {
                var id = context.GetArgument<int>("id");

                return await repository.GetById(id);
            });

        Field<ListGraphType<WorkEntryType>>(
                "workEntriesByUserId"
            ).Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" }))
            .ResolveAsync(
                async context =>
                {
                    var userId = context.GetArgument<int>("userId");

                    return await repository.GetByUserId(userId);
                });

        Field<ListGraphType<WorkEntryType>>(
                "workEntriesByDate"
            ).Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<DateGraphType>> { Name = "date" }))
            .ResolveAsync(
                async context =>
                {
                    var date = context.GetArgument<DateTime>("date");

                    return await repository.GetByDate(date);
                });

        this.AddAuthorization();
    }
}