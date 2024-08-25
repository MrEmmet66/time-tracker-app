using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public class ScheduleItemType: ObjectGraphType<ScheduleItem>
{
    public ScheduleItemType()
    {
        Field(x => x.Id, type: typeof(IdGraphType)).Description("Work entry Id.");
        Field(x => x.Title, type: typeof(StringGraphType)).Description("Schedule item title.");
        Field(x => x.Description, type: typeof(StringGraphType)).Description("Schedule item description.");
        Field(x => x.EventStart, type: typeof(DateTimeOffsetGraphType)).Description("Date and time when the event started.");
        Field(x => x.EventEnd, type: typeof(DateTimeOffsetGraphType)).Description("Date and time of the end of the event.");
        Field<UserType>("user").Resolve(context => context.Source.User).Description("Who owns the schedule item.");
    }
}