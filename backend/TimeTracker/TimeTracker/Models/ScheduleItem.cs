namespace TimeTracker.Models;

public class ScheduleItem
{
    public int Id { get; set; }
    public User User { get; set; }
    public DateTimeOffset EventStart { get; set; }
    public DateTimeOffset EventEnd { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
}