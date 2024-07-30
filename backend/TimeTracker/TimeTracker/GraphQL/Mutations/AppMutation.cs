using GraphQL.Types;

namespace TimeTracker.GraphQL.Mutations;

public class AppMutation : ObjectGraphType
{
    public AppMutation(UserMutation userMutation)
    {
        AddField(userMutation.GetField("createUser"));
        AddField(userMutation.GetField("setUserStatus"));
        AddField(userMutation.GetField("login"));
        AddField(userMutation.GetField("updatePermissions"));
    }
}