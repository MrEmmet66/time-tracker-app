using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public class SickLeaveType : ObjectGraphType<SickLeave>
{
    public SickLeaveType()
    {
        Field(x => x.Id, type:typeof(IdGraphType)).Description("ID of Sick Leave Entry");
        Field(x => x.StartSickLeave, type:typeof(DateTimeGraphType)).Description("Start of Sick Leave");
        Field(x => x.EndSickLeave, type:typeof(DateTimeGraphType)).Description("End of Sick Leave");
        Field(x => x.Reason).Description("Reason of Sick Leave");
        Field<UserType>("user").Resolve(context => context.Source.User).Description("User who is on the sick leave");
    }
    
}