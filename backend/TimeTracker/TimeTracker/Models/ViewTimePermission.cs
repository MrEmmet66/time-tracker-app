using TimeTracker.Constants;

namespace TimeTracker.Models;

public class ViewTimePermission : BasePermission
{
    public ViewTimePermission(string name) : base(name)
    {
    }

    public override bool CanExecute(User user)
    {
        bool hasPermissionViewAllTime = user.Permissions.Any(p => p.Name == Permissions.ViewAllTimeEntries);
        bool hasPermissionViewTeamTime =
            base.CanExecute(user) && user.Permissions.Any(p => p.Name == Permissions.ViewTeamTimeEntries);

        return hasPermissionViewAllTime ||
               hasPermissionViewTeamTime;
    }
}