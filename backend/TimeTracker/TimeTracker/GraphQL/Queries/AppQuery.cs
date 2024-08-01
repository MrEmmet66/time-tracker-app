using GraphQL.Types;

namespace TimeTracker.GraphQL.Queries;

public class AppQuery : ObjectGraphType
{
    public AppQuery(UserQuery userQuery, TeamQuery teamQuery)
    {
        AddField(userQuery.GetField("user"));
        AddField(userQuery.GetField("users"));

        AddField(teamQuery.GetField("teams"));
        AddField(teamQuery.GetField("team"));
    }
}