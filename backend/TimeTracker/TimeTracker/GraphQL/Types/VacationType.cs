using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public class VacationType : ObjectGraphType<Vacation>
{
    public VacationType()
    {
        Field(x => x.Id, type:typeof(IdGraphType)).Description("ID of Vacation Entry");
        Field(x => x.StartVacation, type:typeof(DateTimeGraphType)).Description("Start of Vacation");
        Field(x => x.EndVacation, type:typeof(DateTimeGraphType)).Description("End of Vacation");
        Field(x => x.Status).Description("Status of Vacation");
        Field<UserType>("user").Resolve(context => context.Source.User).Description("User who is on the vacation");
    }
}