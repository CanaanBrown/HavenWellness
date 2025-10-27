using Microsoft.EntityFrameworkCore;
using HavenWellness.Models;

namespace HavenWellness.Data;

/// <summary>
/// Entity Framework context for the Haven Wellness platform
/// </summary>
public class WellnessContext : DbContext
{
    public WellnessContext(DbContextOptions<WellnessContext> options) : base(options)
    {
    }

    // DbSets for all entities
    public DbSet<User> Users { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<UserGroup> UserGroups { get; set; }
    public DbSet<GroupMessage> GroupMessages { get; set; }
    public DbSet<PrivateMessage> PrivateMessages { get; set; }
    public DbSet<SymptomEntry> SymptomEntries { get; set; }
    public DbSet<SymptomDetail> SymptomDetails { get; set; }
    public DbSet<Pairing> Pairings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
        });

        // Configure Group entity
        modelBuilder.Entity<Group>(entity =>
        {
            entity.Property(e => e.GroupName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
        });

        // Configure UserGroup join table
        modelBuilder.Entity<UserGroup>(entity =>
        {
            entity.HasIndex(e => new { e.UserId, e.GroupId }).IsUnique();
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.GroupId);
            
            entity.HasOne(ug => ug.User)
                .WithMany(u => u.UserGroups)
                .HasForeignKey(ug => ug.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ug => ug.Group)
                .WithMany(g => g.UserGroups)
                .HasForeignKey(ug => ug.GroupId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure GroupMessage entity
        modelBuilder.Entity<GroupMessage>(entity =>
        {
            entity.Property(e => e.MessageText).IsRequired().HasMaxLength(1000);
            
            entity.HasOne(gm => gm.Group)
                .WithMany(g => g.GroupMessages)
                .HasForeignKey(gm => gm.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(gm => gm.User)
                .WithMany(u => u.GroupMessages)
                .HasForeignKey(gm => gm.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure SymptomEntry entity
        modelBuilder.Entity<SymptomEntry>(entity =>
        {
            // Configure DateOnly to TEXT conversion for SQLite
            entity.Property(e => e.Date)
                .HasConversion(
                    v => v.ToString("yyyy-MM-dd"),
                    v => DateOnly.Parse(v))
                .HasColumnType("TEXT");

            entity.HasOne(se => se.User)
                .WithMany(u => u.SymptomEntries)
                .HasForeignKey(se => se.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure SymptomDetail entity
        modelBuilder.Entity<SymptomDetail>(entity =>
        {
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.PainLevel).IsRequired();

            entity.HasOne(sd => sd.SymptomEntry)
                .WithMany(se => se.SymptomDetails)
                .HasForeignKey(sd => sd.SymptomEntryId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure PrivateMessage entity
        modelBuilder.Entity<PrivateMessage>(entity =>
        {
            entity.Property(e => e.MessageText).IsRequired().HasMaxLength(1000);
            entity.HasIndex(e => e.SenderId);
            entity.HasIndex(e => e.ReceiverId);
            entity.HasIndex(e => new { e.SenderId, e.ReceiverId });

            entity.HasOne(pm => pm.Sender)
                .WithMany()
                .HasForeignKey(pm => pm.SenderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(pm => pm.Receiver)
                .WithMany()
                .HasForeignKey(pm => pm.ReceiverId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Pairing entity
        modelBuilder.Entity<Pairing>(entity =>
        {
            // Only enforce uniqueness for active pairings
            entity.HasIndex(e => new { e.GroupId, e.User1Id, e.IsActive })
                .HasFilter("IsActive = 1")
                .IsUnique();
            entity.HasIndex(e => new { e.GroupId, e.User2Id, e.IsActive })
                .HasFilter("IsActive = 1")
                .IsUnique();
            entity.HasIndex(e => e.GroupId);
            entity.HasIndex(e => e.User1Id);
            entity.HasIndex(e => e.User2Id);
            entity.HasIndex(e => e.IsActive);

            entity.HasOne(p => p.Group)
                .WithMany(g => g.Pairings)
                .HasForeignKey(p => p.GroupId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.User1)
                .WithMany()
                .HasForeignKey(p => p.User1Id)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(p => p.User2)
                .WithMany()
                .HasForeignKey(p => p.User2Id)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Seed data
        SeedData(modelBuilder);
    }

    private void SeedData(ModelBuilder modelBuilder)
    {
        // Seed demo user
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Name = "Demo User",
                Email = "demo@example.com",
                PasswordHash = "hashed_password_demo",
                DateJoined = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        // Seed demo group
        modelBuilder.Entity<Group>().HasData(
            new Group
            {
                Id = 1,
                GroupName = "Chronic Illness Support",
                Description = "A supportive community for students managing chronic health conditions"
            }
        );

        // Seed user-group relationship
        modelBuilder.Entity<UserGroup>().HasData(
            new UserGroup
            {
                Id = 1,
                UserId = 1,
                GroupId = 1
            }
        );

        // Seed group messages
        modelBuilder.Entity<GroupMessage>().HasData(
            new GroupMessage
            {
                Id = 1,
                GroupId = 1,
                UserId = 1,
                MessageText = "Welcome to our support group! Feel free to share your experiences.",
                Timestamp = new DateTime(2025, 1, 15, 10, 0, 0, DateTimeKind.Utc)
            },
            new GroupMessage
            {
                Id = 2,
                GroupId = 1,
                UserId = 1,
                MessageText = "Remember to track your symptoms daily. It really helps identify patterns.",
                Timestamp = new DateTime(2025, 1, 16, 14, 30, 0, DateTimeKind.Utc)
            }
        );

        // Seed symptom entries
        modelBuilder.Entity<SymptomEntry>().HasData(
            new SymptomEntry
            {
                Id = 1,
                UserId = 1,
                Date = new DateOnly(2025, 1, 15)
            },
            new SymptomEntry
            {
                Id = 2,
                UserId = 1,
                Date = new DateOnly(2025, 1, 16)
            }
        );

        // Seed symptom details
        modelBuilder.Entity<SymptomDetail>().HasData(
            new SymptomDetail
            {
                Id = 1,
                SymptomEntryId = 1,
                Name = "Headache",
                PainLevel = 6,
                Notes = "Started in the morning, worsened throughout the day"
            },
            new SymptomDetail
            {
                Id = 2,
                SymptomEntryId = 1,
                Name = "Fatigue",
                PainLevel = 8,
                Notes = "Very tired, had to take multiple breaks"
            },
            new SymptomDetail
            {
                Id = 3,
                SymptomEntryId = 2,
                Name = "Headache",
                PainLevel = 4,
                Notes = "Much better today, mild discomfort"
            },
            new SymptomDetail
            {
                Id = 4,
                SymptomEntryId = 2,
                Name = "Nausea",
                PainLevel = 3,
                Notes = "Slight nausea after lunch"
            }
        );
    }
}
