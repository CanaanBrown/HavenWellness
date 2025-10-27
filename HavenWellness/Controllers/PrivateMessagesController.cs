using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HavenWellness.Data;
using HavenWellness.Models;
using System.ComponentModel.DataAnnotations;

namespace HavenWellness.Controllers;

/// <summary>
/// Controller for managing private messages between paired users
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PrivateMessagesController : ControllerBase
{
    private readonly WellnessContext _context;

    public PrivateMessagesController(WellnessContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all private conversations for the current user
    /// </summary>
    [HttpGet("conversations")]
    public async Task<ActionResult<IEnumerable<object>>> GetConversations([FromQuery] int? userId = null)
    {
        // Get user ID from query parameter or default to 1 for backward compatibility
        var currentUserId = userId ?? 1;

        // Get all pairings for the current user
        var pairings = await _context.Pairings
            .Where(p => p.IsActive && (p.User1Id == currentUserId || p.User2Id == currentUserId))
            .Include(p => p.User1)
            .Include(p => p.User2)
            .Include(p => p.Group)
            .ToListAsync();

        var conversations = new List<object>();

        foreach (var pairing in pairings)
        {
            var partnerId = pairing.User1Id == currentUserId ? pairing.User2Id : pairing.User1Id;
            var partner = pairing.User1Id == currentUserId ? pairing.User2 : pairing.User1;

            // Get the last message in this conversation
            var lastMessage = await _context.PrivateMessages
                .Where(pm => (pm.SenderId == currentUserId && pm.ReceiverId == partnerId) ||
                            (pm.SenderId == partnerId && pm.ReceiverId == currentUserId))
                .OrderByDescending(pm => pm.Timestamp)
                .FirstOrDefaultAsync();

            // Count unread messages
            var unreadCount = await _context.PrivateMessages
                .CountAsync(pm => pm.SenderId == partnerId && pm.ReceiverId == currentUserId && !pm.IsRead);

            conversations.Add(new
            {
                PartnerId = partnerId,
                PartnerName = partner!.Name,
                PartnerEmail = partner.Email,
                GroupId = pairing.GroupId,
                GroupName = pairing.Group!.GroupName,
                LastMessage = lastMessage != null ? new
                {
                    lastMessage.MessageText,
                    lastMessage.Timestamp,
                    lastMessage.SenderId,
                    IsFromCurrentUser = lastMessage.SenderId == currentUserId
                } : null,
                UnreadCount = unreadCount
            });
        }

        return Ok(conversations);
    }

    /// <summary>
    /// Get messages between the current user and a specific partner
    /// </summary>
    [HttpGet("conversation/{partnerId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetConversation(int partnerId, [FromQuery] int? userId = null)
    {
        // Get user ID from query parameter or default to 1 for backward compatibility
        var currentUserId = userId ?? 1;

        // Verify that users are paired
        var pairing = await _context.Pairings
            .FirstOrDefaultAsync(p => p.IsActive && 
                ((p.User1Id == currentUserId && p.User2Id == partnerId) ||
                 (p.User1Id == partnerId && p.User2Id == currentUserId)));

        if (pairing == null)
        {
            return Forbid("You can only message users you are paired with.");
        }

        // Get messages between the two users
        var messages = await _context.PrivateMessages
            .Where(pm => (pm.SenderId == currentUserId && pm.ReceiverId == partnerId) ||
                        (pm.SenderId == partnerId && pm.ReceiverId == currentUserId))
            .Include(pm => pm.Sender)
            .Include(pm => pm.Receiver)
            .OrderBy(pm => pm.Timestamp)
            .Select(pm => new
            {
                pm.Id,
                pm.MessageText,
                pm.Timestamp,
                pm.IsRead,
                SenderId = pm.SenderId,
                SenderName = pm.Sender!.Name,
                ReceiverId = pm.ReceiverId,
                ReceiverName = pm.Receiver!.Name,
                IsFromCurrentUser = pm.SenderId == currentUserId
            })
            .ToListAsync();

        // Mark messages as read
        var unreadMessages = await _context.PrivateMessages
            .Where(pm => pm.SenderId == partnerId && pm.ReceiverId == currentUserId && !pm.IsRead)
            .ToListAsync();

        foreach (var message in unreadMessages)
        {
            message.IsRead = true;
        }

        await _context.SaveChangesAsync();

        return Ok(messages);
    }

    /// <summary>
    /// Send a private message to a paired user
    /// </summary>
    [HttpPost("send")]
    public async Task<ActionResult<object>> SendMessage([FromBody] SendPrivateMessageRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Get user ID from request body or default to 1 for backward compatibility
        var senderId = request.SenderId ?? 1;

        // Verify that users are paired
        var pairing = await _context.Pairings
            .FirstOrDefaultAsync(p => p.IsActive && 
                ((p.User1Id == senderId && p.User2Id == request.ReceiverId) ||
                 (p.User1Id == request.ReceiverId && p.User2Id == senderId)));

        if (pairing == null)
        {
            return Forbid("You can only message users you are paired with.");
        }

        var message = new PrivateMessage
        {
            SenderId = senderId,
            ReceiverId = request.ReceiverId,
            MessageText = request.MessageText,
            Timestamp = DateTime.UtcNow,
            IsRead = false
        };

        _context.PrivateMessages.Add(message);
        await _context.SaveChangesAsync();

        // Get the created message with related data
        var createdMessage = await _context.PrivateMessages
            .Where(pm => pm.Id == message.Id)
            .Include(pm => pm.Sender)
            .Include(pm => pm.Receiver)
            .Select(pm => new
            {
                pm.Id,
                pm.MessageText,
                pm.Timestamp,
                pm.IsRead,
                SenderId = pm.SenderId,
                SenderName = pm.Sender!.Name,
                ReceiverId = pm.ReceiverId,
                ReceiverName = pm.Receiver!.Name,
                IsFromCurrentUser = pm.SenderId == senderId
            })
            .FirstAsync();

        return CreatedAtAction(nameof(GetConversation), new { partnerId = request.ReceiverId }, createdMessage);
    }

    /// <summary>
    /// Mark a message as read
    /// </summary>
    [HttpPut("{messageId}/read")]
    public async Task<ActionResult> MarkAsRead(int messageId, [FromQuery] int? userId = null)
    {
        // Get user ID from query parameter or default to 1 for backward compatibility
        var currentUserId = userId ?? 1;

        var message = await _context.PrivateMessages
            .FirstOrDefaultAsync(pm => pm.Id == messageId && pm.ReceiverId == currentUserId);

        if (message == null)
        {
            return NotFound("Message not found or you don't have permission to mark it as read.");
        }

        message.IsRead = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

/// <summary>
/// Request model for sending a private message
/// </summary>
public class SendPrivateMessageRequest
{
    [Required]
    public int ReceiverId { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public string MessageText { get; set; } = string.Empty;
    
    public int? SenderId { get; set; }
}
