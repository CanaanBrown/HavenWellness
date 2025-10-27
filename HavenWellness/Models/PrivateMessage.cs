using System.ComponentModel.DataAnnotations;

namespace HavenWellness.Models;

/// <summary>
/// Represents a private message between two paired users
/// </summary>
public class PrivateMessage
{
    public int Id { get; set; }
    
    [Required]
    public int SenderId { get; set; }
    
    [Required]
    public int ReceiverId { get; set; }
    
    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public string MessageText { get; set; } = string.Empty;
    
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    public bool IsRead { get; set; } = false;
    
    // Navigation properties
    public virtual User Sender { get; set; } = null!;
    public virtual User Receiver { get; set; } = null!;
}
