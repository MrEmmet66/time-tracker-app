namespace TimeTracker.Models;

public class SickLeave
{
    public int Id { get; set; }
    public User User { get; set; }
    public DateTime StartSickLeave { get; set; }
    public DateTime EndSickLeave { get; set; }
    public string Reason { get; set; }
    public string Status { get; set; }
}