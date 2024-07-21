using GraphQL.Types;

namespace TimeTracker.GraphQL.Queries;

public class AppQuery : ObjectGraphType
{
    public AppQuery(UserQuery userQuery)
    {
        AddField(userQuery.GetField("user"));
        AddField(userQuery.GetField("users"));
    }
}