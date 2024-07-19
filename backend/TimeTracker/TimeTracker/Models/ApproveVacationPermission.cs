namespace TimeTracker.Models;

public class ApproveVacationPermission : BasePermission
{
    public ApproveVacationPermission(string name, Vacation targetVacation) : base(name)
    {
        TargetVacation = targetVacation;
    }
    
    public Vacation TargetVacation { get; set; }
    
    public override bool CanExecute(User user)
    {
        return base.CanExecute(user) && user.Team == TargetVacation.User.Team;
    }
}
