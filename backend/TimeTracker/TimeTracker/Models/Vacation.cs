namespace TimeTracker.Models;

public class Vacation
{
    public int Id { get; set; }
    public User User { get; set; }
    public DateTime StartVacation { get; set; }
    public DateTime EndVacation { get; set; }
}