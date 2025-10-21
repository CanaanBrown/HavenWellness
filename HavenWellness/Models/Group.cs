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

    // Navigation properties
    public virtual ICollection<UserGroup> UserGroups { get; set; } = new List<UserGroup>();
    public virtual ICollection<GroupMessage> GroupMessages { get; set; } = new List<GroupMessage>();
}
