using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HavenWellness.Data;
using HavenWellness.Models;
using System.ComponentModel.DataAnnotations;

namespace HavenWellness.Controllers;

/// <summary>
/// Controller for managing groups
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class GroupsController : ControllerBase
{
    private readonly WellnessContext _context;

    public GroupsController(WellnessContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all groups
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetGroups()
    {
        // For now, use a default user ID of 1 since we don't have authentication yet
        // In a real app, you'd get this from the authenticated user's context
        var userId = 1; // TODO: Get from authenticated user context

        var groups = await _context.Groups
            .OrderByDescending(g => g.CreatedDate)
            .Select(g => new {
                g.Id,
                g.GroupName,
                g.Description,
                g.Category,
                g.Tags,
                g.IsPrivate,
                g.CreatedDate,
                memberCount = g.UserGroups.Count,
                isMember = g.UserGroups.Any(ug => ug.UserId == userId),
                userRole = g.UserGroups
                    .Where(ug => ug.UserId == userId)
                    .Select(ug => ug.Role)
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(groups);
    }

    /// <summary>
    /// Get a specific group by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<Group>> GetGroup(int id)
    {
        var group = await _context.Groups.FindAsync(id);

        if (group == null)
        {
            return NotFound();
        }

        return Ok(group);
    }

    /// <summary>
    /// Create a new group
    /// </summary>
    /// <param name="request">The group creation request</param>
    /// <returns>The created group with assigned ID</returns>
    /// <response code="201">Group created successfully</response>
    /// <response code="400">Invalid group data</response>
    [HttpPost]
    public async Task<ActionResult<object>> CreateGroup([FromBody] CreateGroupRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var group = new Group
        {
            GroupName = request.GroupName,
            Description = request.Description,
            Category = request.Category,
            Tags = request.Tags,
            IsPrivate = request.IsPrivate,
            CreatedDate = DateTime.UtcNow
        };

        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        // Add the creator as the group owner
        // For now, we'll use a default user ID of 1 since we don't have authentication yet
        // In a real app, you'd get this from the authenticated user's context
        var creatorUserId = 1; // TODO: Get from authenticated user context

        var userGroup = new UserGroup
        {
            UserId = creatorUserId,
            GroupId = group.Id,
            Role = "Owner",
            JoinedDate = DateTime.UtcNow
        };

        _context.UserGroups.Add(userGroup);
        await _context.SaveChangesAsync();

        var response = new
        {
            group.Id,
            group.GroupName,
            group.Description,
            group.Category,
            group.Tags,
            group.IsPrivate,
            group.CreatedDate,
            memberCount = 1,
            isOwner = true
        };

        return CreatedAtAction(nameof(GetGroup), new { id = group.Id }, response);
    }

    /// <summary>
    /// Update an existing group
    /// </summary>
    /// <param name="id">The ID of the group to update</param>
    /// <param name="group">The updated group data</param>
    /// <returns>No content if successful</returns>
    /// <response code="204">Group updated successfully</response>
    /// <response code="400">Invalid group data or ID mismatch</response>
    /// <response code="404">Group not found</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     PUT /api/groups/1
    ///     {
    ///         "id": 1,
    ///         "groupName": "Updated Chronic Pain Support Group",
    ///         "description": "Updated description for the support group"
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     HTTP 204 No Content
    /// </remarks>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateGroup(int id, Group group)
    {
        if (id != group.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Entry(group).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!GroupExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// Join a group
    /// </summary>
    /// <param name="groupId">The ID of the group to join</param>
    /// <returns>Success message</returns>
    [HttpPost("{groupId}/join")]
    public async Task<ActionResult<object>> JoinGroup(int groupId)
    {
        // Check if group exists
        var group = await _context.Groups.FindAsync(groupId);
        if (group == null)
        {
            return NotFound("Group not found");
        }

        // For now, use a default user ID of 1 since we don't have authentication yet
        // In a real app, you'd get this from the authenticated user's context
        var userId = 1; // TODO: Get from authenticated user context

        // Check if user is already a member
        var existingMembership = await _context.UserGroups
            .FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GroupId == groupId);

        if (existingMembership != null)
        {
            return BadRequest("You are already a member of this group");
        }

        // Add user to group
        var userGroup = new UserGroup
        {
            UserId = userId,
            GroupId = groupId,
            Role = "Member",
            JoinedDate = DateTime.UtcNow
        };

        _context.UserGroups.Add(userGroup);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Successfully joined the group" });
    }

    /// <summary>
    /// Leave a group
    /// </summary>
    /// <param name="groupId">The ID of the group to leave</param>
    /// <returns>Success message</returns>
    [HttpPost("{groupId}/leave")]
    public async Task<ActionResult<object>> LeaveGroup(int groupId)
    {
        // For now, use a default user ID of 1 since we don't have authentication yet
        // In a real app, you'd get this from the authenticated user's context
        var userId = 1; // TODO: Get from authenticated user context

        // Find the user's membership
        var membership = await _context.UserGroups
            .FirstOrDefaultAsync(ug => ug.UserId == userId && ug.GroupId == groupId);

        if (membership == null)
        {
            return NotFound("You are not a member of this group");
        }

        // Check if user is the owner
        if (membership.Role == "Owner")
        {
            return BadRequest("Group owners cannot leave their own group. Transfer ownership or delete the group instead.");
        }

        // Remove user from group
        _context.UserGroups.Remove(membership);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Successfully left the group" });
    }

    /// <summary>
    /// Get group members
    /// </summary>
    /// <param name="groupId">The ID of the group</param>
    /// <returns>List of group members</returns>
    [HttpGet("{groupId}/members")]
    public async Task<ActionResult<IEnumerable<object>>> GetGroupMembers(int groupId)
    {
        var members = await _context.UserGroups
            .Where(ug => ug.GroupId == groupId)
            .Include(ug => ug.User)
            .Select(ug => new
            {
                ug.UserId,
                ug.User.Name,
                ug.User.Email,
                ug.Role,
                ug.JoinedDate
            })
            .ToListAsync();

        return Ok(members);
    }

    /// <summary>
    /// Delete a group
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteGroup(int id)
    {
        var group = await _context.Groups.FindAsync(id);
        if (group == null)
        {
            return NotFound();
        }

        _context.Groups.Remove(group);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool GroupExists(int id)
    {
        return _context.Groups.Any(e => e.Id == id);
    }
}

/// <summary>
/// Request model for creating a new group
/// </summary>
public class CreateGroupRequest
{
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
}
