using GraphQL.Types;

namespace TimeTracker.GraphQL.Queries;

public class AppQuery : ObjectGraphType
{
    public AppQuery(UserQuery userQuery, TeamQuery teamQuery, WorkEntryQuery workEntryQuery,
    VacationQuery vacationQuery, SickLeaveQuery sickLeaveQuery,
        ScheduleQuery scheduleQuery)
    {
        AddField(userQuery.GetField("user"));
        AddField(userQuery.GetField("users"));

        AddField(teamQuery.GetField("teams"));
        AddField(teamQuery.GetField("team"));

        AddField(workEntryQuery.GetField("workEntries"));
        AddField(workEntryQuery.GetField("workEntry"));
        AddField(workEntryQuery.GetField("workEntriesByUserId"));
        AddField(workEntryQuery.GetField("workEntriesByDate"));

        AddField(vacationQuery.GetField("vacations"));
        AddField(vacationQuery.GetField("vacation"));
        AddField(vacationQuery.GetField("userVacations"));
        AddField(vacationQuery.GetField("lastUserVacation"));

        AddField(sickLeaveQuery.GetField("sickLeaves"));
        AddField(sickLeaveQuery.GetField("sickLeave"));
        AddField(sickLeaveQuery.GetField("userSickLeaves"));
        AddField(sickLeaveQuery.GetField("lastUserSickLeave"));

        AddField(scheduleQuery.GetField("schedule"));
        AddField(scheduleQuery.GetField("schedules"));
    }
}