using GraphQL.Types;

namespace TimeTracker.GraphQL.Mutations;

public class AppMutation : ObjectGraphType
{
    public AppMutation(UserMutation userMutation, TeamMutation teamMutation, WorkEntryMutation workEntryMutation, VacationMutation vacationMutation, SickLeaveMutation sickLeaveMutation)
    {
        AddField(userMutation.GetField("createUser"));
        AddField(userMutation.GetField("setUserStatus"));
        AddField(userMutation.GetField("login"));
        AddField(userMutation.GetField("updatePermissions"));
        AddField(userMutation.GetField("editUser"));
        AddField(userMutation.GetField("changePassword"));

        AddField(teamMutation.GetField("createTeam"));
        AddField(teamMutation.GetField("addUserToTeam"));
        AddField(teamMutation.GetField("removeUserFromTeam"));
        
        AddField(workEntryMutation.GetField("createWorkEntry"));

        AddField(vacationMutation.GetField("setVacation"));
        AddField(vacationMutation.GetField("removeVacation"));
        
        AddField(sickLeaveMutation.GetField("setSickLeave"));
        AddField(sickLeaveMutation.GetField("removeSickLeave"));

    }
}