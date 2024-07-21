using TimeTracker.Constants;

namespace TimeTracker.Models;

public class GenerateReportsPermission : BasePermission
{
    public GenerateReportsPermission(string name) : base(name)
    {
    }

    public override bool CanExecute(User user)
    {
        bool hasPermissionGenerateAllReports = user.Permissions.Any(p => p.Name == Permissions.GenerateAllReports);
        bool hasPermissionGenerateReportsTeam =
            base.CanExecute(user) && user.Permissions.Any(p => p.Name == Permissions.GenerateReports);

        return hasPermissionGenerateReportsTeam ||
               hasPermissionGenerateAllReports;
    }
}