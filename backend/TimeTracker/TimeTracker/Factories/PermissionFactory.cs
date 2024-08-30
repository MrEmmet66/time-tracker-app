using TimeTracker.Constants;
using TimeTracker.Models;

namespace TimeTracker.Factories;

public class PermissionFactory
{
    private static readonly Dictionary<string, Func<string, BasePermission>> _permissionCreators = new Dictionary<string, Func<string, BasePermission>>
    {
        // TODO fix the functionality of ApproveVacationPermission, or rather targetVacation
        { Permissions.ApproveVacations, name => new ApproveVacationPermission(name) }, 
        { Permissions.ApproveSickLeavesTeamMembers, name => new ApproveSickLeavesPermission(name) },
        { Permissions.ApproveSickLeavesAllMembers, name => new ApproveSickLeavesPermission(name) },
        { Permissions.ManageTeamMembers, name => new ManageUsersPermission(name) },
        { Permissions.ManageAllMembers, name => new ManageUsersPermission(name) },
        { Permissions.GenerateReports, name => new GenerateReportsPermission(name) },
        { Permissions.GenerateAllReports, name => new GenerateReportsPermission(name) },
        { Permissions.ViewAllTimeEntries, name => new ViewTimePermission(name) },
        { Permissions.ViewTeamTimeEntries, name => new ViewTimePermission(name) },
    };

    public static BasePermission Create(string permissionName)
    {
        if (_permissionCreators.TryGetValue(permissionName, out var creator))
        {
            return creator(permissionName);
        }
        throw new ArgumentException($"Unknown permission: {permissionName}");
    }
}