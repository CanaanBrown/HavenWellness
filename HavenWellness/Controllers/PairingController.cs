using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HavenWellness.Data;
using HavenWellness.Models;
using System.ComponentModel.DataAnnotations;

namespace HavenWellness.Controllers;

/// <summary>
/// Controller for managing user pairings within groups
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PairingController : ControllerBase
{
    private readonly WellnessContext _context;

    public PairingController(WellnessContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all pairings for the current user
    /// </summary>
    [HttpGet("my-pairings")]
    public async Task<ActionResult<IEnumerable<object>>> GetMyPairings([FromQuery] int? userId = null)
    {
        // Get user ID from query parameter or default to 1 for backward compatibility
        var currentUserId = userId ?? 1;

        var pairings = await _context.Pairings
            .Where(p => p.User1Id == currentUserId || p.User2Id == currentUserId)
            .Where(p => p.IsActive)
            .Include(p => p.Group)
            .Include(p => p.User1)
            .Include(p => p.User2)
            .Select(p => new
            {
                p.Id,
                p.GroupId,
                GroupName = p.Group!.GroupName,
                PartnerId = p.User1Id == currentUserId ? p.User2Id : p.User1Id,
                PartnerName = p.User1Id == currentUserId ? p.User2!.Name : p.User1!.Name,
                PartnerEmail = p.User1Id == currentUserId ? p.User2!.Email : p.User1!.Email,
                p.CreatedDate
            })
            .ToListAsync();

        return Ok(pairings);
    }

    /// <summary>
    /// Get available users for pairing in a specific group
    /// </summary>
    [HttpGet("available/{groupId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetAvailableUsers(int groupId, [FromQuery] int? userId = null)
    {
        // Get user ID from query parameter or default to 1 for backward compatibility
        var currentUserId = userId ?? 1;

        // Check if user is a member of the group
        var isMember = await _context.UserGroups
            .AnyAsync(ug => ug.UserId == currentUserId && ug.GroupId == groupId);

        if (!isMember)
        {
            return Forbid("You are not a member of this group.");
        }

        // Get all users in the group except the current user
        var availableUsers = await _context.UserGroups
            .Where(ug => ug.GroupId == groupId && ug.UserId != currentUserId)
            .Include(ug => ug.User)
            .Select(ug => new
            {
                ug.UserId,
                ug.User!.Name,
                ug.User.Email,
                ug.JoinedDate
            })
            .ToListAsync();

        // Filter out users who are already paired with the current user in this group
        var existingPairings = await _context.Pairings
            .Where(p => p.GroupId == groupId && p.IsActive && (p.User1Id == currentUserId || p.User2Id == currentUserId))
            .Select(p => p.User1Id == currentUserId ? p.User2Id : p.User1Id)
            .ToListAsync();

        var filteredUsers = availableUsers
            .Where(u => !existingPairings.Contains(u.UserId))
            .ToList();

        return Ok(filteredUsers);
    }

    /// <summary>
    /// Create a new pairing between two users in a group
    /// </summary>
    [HttpPost("create")]
    public async Task<ActionResult<object>> CreatePairing([FromBody] CreatePairingRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Get user ID from request body or default to 1 for backward compatibility
        var userId = request.UserId ?? 1;

        // Check if user is a member of the group
        var isMember = await _context.UserGroups
            .AnyAsync(ug => ug.UserId == userId && ug.GroupId == request.GroupId);

        if (!isMember)
        {
            return Forbid("You are not a member of this group.");
        }

        // Check if user is trying to pair with themselves
        if (userId == request.TargetUserId)
        {
            return BadRequest("You cannot pair with yourself.");
        }

        // Check if target user is a member of the group
        var targetIsMember = await _context.UserGroups
            .AnyAsync(ug => ug.UserId == request.TargetUserId && ug.GroupId == request.GroupId);

        if (!targetIsMember)
        {
            return BadRequest("Target user is not a member of this group.");
        }

        // Check if the current user already has a pairing in this group
        var userExistingPairing = await _context.Pairings
            .FirstOrDefaultAsync(p => p.GroupId == request.GroupId && p.IsActive && 
                (p.User1Id == userId || p.User2Id == userId));

        if (userExistingPairing != null)
        {
            return BadRequest("You already have a pairing in this group. You can only have one pairing per group.");
        }

        // Check if the target user already has a pairing in this group
        var targetExistingPairing = await _context.Pairings
            .FirstOrDefaultAsync(p => p.GroupId == request.GroupId && p.IsActive && 
                (p.User1Id == request.TargetUserId || p.User2Id == request.TargetUserId));

        if (targetExistingPairing != null)
        {
            return BadRequest("The selected user already has a pairing in this group.");
        }

        // Create the pairing
        var pairing = new Pairing
        {
            GroupId = request.GroupId,
            User1Id = userId,
            User2Id = request.TargetUserId,
            CreatedDate = DateTime.UtcNow,
            IsActive = true
        };

        _context.Pairings.Add(pairing);
        await _context.SaveChangesAsync();

        // Get the created pairing with related data
        var createdPairing = await _context.Pairings
            .Where(p => p.Id == pairing.Id)
            .Include(p => p.Group)
            .Include(p => p.User1)
            .Include(p => p.User2)
            .Select(p => new
            {
                p.Id,
                p.GroupId,
                GroupName = p.Group!.GroupName,
                PartnerId = p.User2Id,
                PartnerName = p.User2!.Name,
                PartnerEmail = p.User2.Email,
                p.CreatedDate
            })
            .FirstAsync();

        return CreatedAtAction(nameof(GetMyPairings), new { id = createdPairing.Id }, createdPairing);
    }

    /// <summary>
    /// Remove a pairing
    /// </summary>
    [HttpDelete("{pairingId}")]
    public async Task<ActionResult> RemovePairing(int pairingId, [FromQuery] int? userId = null)
    {
        // Get user ID from query parameter or default to 1 for backward compatibility
        var currentUserId = userId ?? 1;

        var pairing = await _context.Pairings
            .FirstOrDefaultAsync(p => p.Id == pairingId && p.IsActive && 
                (p.User1Id == currentUserId || p.User2Id == currentUserId));

        if (pairing == null)
        {
            return NotFound("Pairing not found or you don't have permission to remove it.");
        }

        pairing.IsActive = false;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

/// <summary>
/// Request model for creating a pairing
/// </summary>
public class CreatePairingRequest
{
    [Required]
    public int GroupId { get; set; }

    [Required]
    public int TargetUserId { get; set; }
    
    public int? UserId { get; set; }
}
