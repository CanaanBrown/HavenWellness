using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HavenWellness.Models;

public class SymptomDetail
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int SymptomEntryId { get; set; }

    [Required, StringLength(100, MinimumLength = 1)]
    public string Name { get; set; } = string.Empty;

    [Required, Range(1,10)]
    public int PainLevel { get; set; }

    [StringLength(500)]
    public string? Notes { get; set; }

    [ForeignKey(nameof(SymptomEntryId))]
    [JsonIgnore]
    public virtual SymptomEntry? SymptomEntry { get; set; }
}
