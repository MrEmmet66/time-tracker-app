using System.Security.Authentication;
using GraphQL;
using GraphQL.Types;
using TimeTracker.Extensions;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Repositories.Infrastructure;

namespace TimeTracker.GraphQL.Mutations;

public class WorkEntryMutation : ObjectGraphType
{
    public WorkEntryMutation(IWorkEntryRepository repository)
    {
        Field<WorkEntryType>("createWorkEntry").Arguments(new QueryArguments(
                new QueryArgument<NonNullGraphType<DateTimeGraphType>> { Name = "startDateTime" },
                new QueryArgument<NonNullGraphType<DateTimeGraphType>> { Name = "endDateTime" }
            ))
            .ResolveAsync(async context =>
            {
                var startDateTime = context.GetArgument<DateTime>("startDateTime");
                var endDateTime = context.GetArgument<DateTime>("endDateTime");
                var user = context.UserContext["User"] as User;
                
                if (user == null)
                {
                    throw new AuthenticationException("");
                }
                
                var workEntry = new WorkEntry()
                {
                    StartDateTime = startDateTime,
                    EndDateTime = endDateTime,
                    User = user
                };

                return await repository.Create(workEntry);
            });

        this.AddAuthorization();
    }
}