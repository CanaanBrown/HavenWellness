using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HavenWellness.Models;

public class SymptomEntry
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [ForeignKey(nameof(UserId))]
    [JsonIgnore]
    public virtual User? User { get; set; }

    // ✅ Do NOT JsonIgnore this — we want it in responses
    public virtual ICollection<SymptomDetail> SymptomDetails { get; set; } = new List<SymptomDetail>();
}
