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
        Field<EntitiesResultType<WorkEntryType>>("workEntries")
            .Arguments(new QueryArguments(new QueryArgument<IntGraphType> { Name = "page" }))
            .ResolveAsync(async context =>
                {
                    var page = context.GetArgument<int?>("page") ?? 1;
                    var (workEntries, totalPages) = await repository.GetAll(page);

                    return new
                    {
                        Entities = workEntries,
                        TotalPages = totalPages
                    };
                }
            ).AuthorizeWithPermissions(Permissions.ManageAllMembers);

        Field<WorkEntryType>(
            "workEntry"
        ).Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "id" })).ResolveAsync(
            async context =>
            {
                try
                {
                    var id = context.GetArgument<int>("id");

                    return await repository.GetById(id);
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
            });

        Field<EntitiesResultType<WorkEntryType>>(
                "workEntriesByUserId"
            ).Arguments(new QueryArguments(new QueryArgument<NonNullGraphType<IdGraphType>> { Name = "userId" },
                new QueryArgument<IntGraphType> { Name = "page" }))
            .ResolveAsync(
                async context =>
                {
                    try
                    {
                        var userId = context.GetArgument<int>("userId");
                        var page = context.GetArgument<int?>("page") ?? 1;
                        var (workEntries, totalPages) = await repository.GetByUserId(userId, page);

                        return new
                        {
                            Entities = workEntries,
                            TotalPages = totalPages
                        };
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex);
                        context.Errors.Add(new ExecutionError("An unexpected error occurred."));
                        return null;
                    }
                });

        Field<ListGraphType<WorkEntryType>>(
                "workEntriesByDate"
            ).Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<DateGraphType>> { Name = "startDate" },
                new QueryArgument<NonNullGraphType<DateGraphType>>{ Name = "endDate"},
                new QueryArgument<IdGraphType> { Name = "userId" }))
            .ResolveAsync(
                async context =>
                {
                    try
                    {
                        var startDate = context.GetArgument<DateTime>("startDate");
                        var endDate = context.GetArgument<DateTime>("endDate");
                        var userId = context.GetArgument<int?>("userId");

                        if (userId.HasValue)
                        {
                            return await repository.GetByDate(startDate, endDate, userId.Value);
                        }

                        return await repository.GetByDate(startDate, endDate);
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