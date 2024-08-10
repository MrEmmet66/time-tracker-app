using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public class WorkEntryType: ObjectGraphType<WorkEntry>
{
    public WorkEntryType()
    {
        Field(x => x.Id, type: typeof(IdGraphType)).Description("Work entry Id.");
        Field(x => x.StartDateTime, type: typeof(DateTimeGraphType)).Description("Date and time when the work entry started.");
        Field(x => x.EndDateTime, type: typeof(DateTimeGraphType)).Description("Date and time of the end of the work entry.");
        Field<UserType>("user").Resolve(context => context.Source.User).Description("Who owns the work entry.");
    }
}