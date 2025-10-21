using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HavenWellness.Models;

/// <summary>
/// Represents a user in the wellness platform
/// </summary>
public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(255, MinimumLength = 1)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(255, MinimumLength = 1)]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime DateJoined { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual ICollection<SymptomEntry> SymptomEntries { get; set; } = new List<SymptomEntry>();
    public virtual ICollection<UserGroup> UserGroups { get; set; } = new List<UserGroup>();
    public virtual ICollection<GroupMessage> GroupMessages { get; set; } = new List<GroupMessage>();
}
