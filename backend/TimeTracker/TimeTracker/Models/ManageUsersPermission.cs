using TimeTracker.Constants;

namespace TimeTracker.Models;

public class ManageUsersPermission : BasePermission
{
    public ManageUsersPermission(string name) : base(name)
    {
    }

    public override bool CanExecute(User user)
    {
        bool hasPermissionManageAllMembers = user.Permissions.Any(p => p.Name == Permissions.ManageAllMembers);
        bool hasPermissionManageTeamMembers =
            base.CanExecute(user) && user.Permissions.Any(p => p.Name == Permissions.ManageTeamMembers);

        return hasPermissionManageAllMembers ||
               hasPermissionManageTeamMembers;
    }
}