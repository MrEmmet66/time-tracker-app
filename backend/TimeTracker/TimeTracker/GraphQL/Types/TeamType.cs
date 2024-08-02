using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public class TeamType : ObjectGraphType<Team>
{
    public TeamType()
    {
        Field(x => x.Id, type: typeof(IdGraphType)).Description("Team Id.");
        Field(x => x.Name, type: typeof(StringGraphType)).Description("Team name.");
        Field<ListGraphType<UserType>>("members").Resolve(context => context.Source.Members);
    }
}