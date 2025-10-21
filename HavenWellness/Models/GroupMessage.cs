namespace HavenWellness.Models;

public class GroupMessage
{
    public int Id { get; set; }
    public int GroupId { get; set; }
    public int UserId { get; set; }
    public string MessageText { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public virtual User? User { get; set; }
    public virtual Group? Group { get; set; }
}
