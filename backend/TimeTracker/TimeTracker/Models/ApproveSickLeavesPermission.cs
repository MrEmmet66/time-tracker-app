using TimeTracker.Constants;

namespace TimeTracker.Models;

public class ApproveSickLeavesPermission : BasePermission
{
    public ApproveSickLeavesPermission(string name) : base(name)
    {
    }

    public override bool CanExecute(User user)
    {
        bool hasPermissionApproveAllMembers =
            user.Permissions.Any(p => p.Name == Permissions.ApproveSickLeavesAllMembers);
        bool hasPermissionApproveTeamMembers =
            base.CanExecute(user) && user.Permissions.Any(p => p.Name == Permissions.ApproveSickLeavesTeamMembers);

        return hasPermissionApproveAllMembers ||
               hasPermissionApproveTeamMembers;
    }
}