using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HavenWellness.Models;

/// <summary>
/// Join table for many-to-many relationship between Users and Groups
/// </summary>
public class UserGroup
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public int GroupId { get; set; }

    [Required]
    [StringLength(20)]
    public string Role { get; set; } = "Member"; // "Owner" or "Member"

    public DateTime JoinedDate { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;

    [ForeignKey(nameof(GroupId))]
    public virtual Group Group { get; set; } = null!;
}
