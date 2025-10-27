using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HavenWellness.Models;

/// <summary>
/// Represents a pairing between two users in a specific group
/// </summary>
public class Pairing
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int GroupId { get; set; }

    [Required]
    public int User1Id { get; set; }

    [Required]
    public int User2Id { get; set; }

    [Required]
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;

    // Navigation properties
    [ForeignKey(nameof(GroupId))]
    public virtual Group? Group { get; set; }

    [ForeignKey(nameof(User1Id))]
    public virtual User? User1 { get; set; }

    [ForeignKey(nameof(User2Id))]
    public virtual User? User2 { get; set; }
}
