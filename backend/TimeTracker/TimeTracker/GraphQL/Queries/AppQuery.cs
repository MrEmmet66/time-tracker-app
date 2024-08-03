using GraphQL.Types;

namespace TimeTracker.GraphQL.Queries;

public class AppQuery : ObjectGraphType
{
    public AppQuery(UserQuery userQuery, TeamQuery teamQuery, WorkEntryQuery workEntryQuery)
    {
        AddField(userQuery.GetField("user"));
        AddField(userQuery.GetField("users"));

        AddField(teamQuery.GetField("teams"));
        AddField(teamQuery.GetField("team"));
        
        AddField(workEntryQuery.GetField("workEntries"));
        AddField(workEntryQuery.GetField("workEntry"));
        AddField(workEntryQuery.GetField("workEntriesByUserId"));
        AddField(workEntryQuery.GetField("workEntriesByDate"));

    }
}