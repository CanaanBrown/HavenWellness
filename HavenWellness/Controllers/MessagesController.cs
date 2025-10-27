using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HavenWellness.Data;
using HavenWellness.Models;
using System.ComponentModel.DataAnnotations;

namespace HavenWellness.Controllers;

/// <summary>
/// Controller for managing group messages and chat functionality
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly WellnessContext _context;

    public MessagesController(WellnessContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all messages for a specific group
    /// </summary>
    /// <param name="groupId">The ID of the group</param>
    /// <returns>List of messages for the group</returns>
    [HttpGet("group/{groupId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetGroupMessages(int groupId)
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

        // Check if user is a member of the group
        var isMember = await _context.UserGroups
            .AnyAsync(ug => ug.UserId == userId && ug.GroupId == groupId);

        if (!isMember)
        {
            return Forbid("You must be a member of this group to view messages");
        }

        var messages = await _context.GroupMessages
            .Where(gm => gm.GroupId == groupId)
            .Include(gm => gm.User)
            .OrderBy(gm => gm.Timestamp)
            .Select(gm => new
            {
                gm.Id,
                gm.MessageText,
                gm.Timestamp,
                UserId = gm.UserId,
                UserName = gm.User!.Name,
                UserEmail = gm.User.Email
            })
            .ToListAsync();

        return Ok(messages);
    }

    /// <summary>
    /// Send a message to a group
    /// </summary>
    /// <param name="groupId">The ID of the group</param>
    /// <param name="request">The message request</param>
    /// <returns>The created message</returns>
    [HttpPost("group/{groupId}")]
    public async Task<ActionResult<object>> SendGroupMessage(int groupId, [FromBody] SendMessageRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Check if group exists
        var group = await _context.Groups.FindAsync(groupId);
        if (group == null)
        {
            return NotFound("Group not found");
        }

        // For now, use a default user ID of 1 since we don't have authentication yet
        // In a real app, you'd get this from the authenticated user's context
        var userId = 1; // TODO: Get from authenticated user context

        // Check if user is a member of the group
        var isMember = await _context.UserGroups
            .AnyAsync(ug => ug.UserId == userId && ug.GroupId == groupId);

        if (!isMember)
        {
            return Forbid("You must be a member of this group to send messages");
        }

        var message = new GroupMessage
        {
            GroupId = groupId,
            UserId = userId,
            MessageText = request.MessageText,
            Timestamp = DateTime.UtcNow
        };

        _context.GroupMessages.Add(message);
        await _context.SaveChangesAsync();

        // Get the user information for the response
        var user = await _context.Users.FindAsync(userId);

        var response = new
        {
            message.Id,
            message.MessageText,
            message.Timestamp,
            UserId = message.UserId,
            UserName = user?.Name ?? "Unknown",
            UserEmail = user?.Email ?? "unknown@example.com"
        };

        return CreatedAtAction(nameof(GetGroupMessages), new { groupId }, response);
    }

    /// <summary>
    /// Get all groups that the current user is a member of (for chat list)
    /// </summary>
    /// <returns>List of groups with recent message info</returns>
    [HttpGet("my-groups")]
    public async Task<ActionResult<IEnumerable<object>>> GetMyGroups()
    {
        // For now, use a default user ID of 1 since we don't have authentication yet
        // In a real app, you'd get this from the authenticated user's context
        var userId = 1; // TODO: Get from authenticated user context

        var groups = await _context.UserGroups
            .Where(ug => ug.UserId == userId)
            .Include(ug => ug.Group)
            .ThenInclude(g => g.GroupMessages.OrderByDescending(gm => gm.Timestamp).Take(1))
            .Select(ug => new
            {
                GroupId = ug.GroupId,
                GroupName = ug.Group!.GroupName,
                GroupDescription = ug.Group.Description,
                UserRole = ug.Role,
                MemberCount = ug.Group.UserGroups.Count,
                LastMessage = ug.Group.GroupMessages
                    .OrderByDescending(gm => gm.Timestamp)
                    .Select(gm => new
                    {
                        gm.MessageText,
                        gm.Timestamp,
                        UserName = gm.User!.Name
                    })
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(groups);
    }
}

/// <summary>
/// Request model for sending a message
/// </summary>
public class SendMessageRequest
{
    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public string MessageText { get; set; } = string.Empty;
}