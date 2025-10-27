using System.ComponentModel.DataAnnotations;

namespace HavenWellness.Models;

/// <summary>
/// Represents a support group for users with chronic illnesses
/// </summary>
public class Group
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string GroupName { get; set; } = string.Empty;

    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [StringLength(50)]
    public string? Category { get; set; }

    [StringLength(1000)]
    public string? Tags { get; set; }

    public bool IsPrivate { get; set; } = false;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<UserGroup> UserGroups { get; set; } = new List<UserGroup>();
    public virtual ICollection<GroupMessage> GroupMessages { get; set; } = new List<GroupMessage>();
    public virtual ICollection<Pairing> Pairings { get; set; } = new List<Pairing>();
}
