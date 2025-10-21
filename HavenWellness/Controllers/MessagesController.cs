using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HavenWellness.Data;
using HavenWellness.Models;

namespace HavenWellness.Controllers;

/// <summary>
/// Controller for managing group messages
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
    /// Get all messages with pagination and optional group filter
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<GroupMessage>>> GetMessages(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] int? groupId = null)
    {
        var query = _context.GroupMessages.AsQueryable();

        if (groupId.HasValue)
        {
            query = query.Where(gm => gm.GroupId == groupId.Value);
        }

        var messages = await query
            .OrderByDescending(gm => gm.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => new {
                m.Id,
                m.MessageText,
                m.Timestamp,
                m.GroupId,
                m.UserId
            })
            .ToListAsync();

        return Ok(messages);
    }

    /// <summary>
    /// Get a specific message by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<GroupMessage>> GetMessage(int id)
    {
        var message = await _context.GroupMessages
            .Include(gm => gm.User)
            .Include(gm => gm.Group)
            .FirstOrDefaultAsync(gm => gm.Id == id);

        if (message == null)
        {
            return NotFound();
        }

        return Ok(message);
    }

    /// <summary>
    /// Create a new message
    /// </summary>
    /// <param name="message">The message object to create</param>
    /// <returns>The created message with assigned ID and timestamp</returns>
    /// <response code="201">Message created successfully</response>
    /// <response code="400">Invalid message data or invalid GroupId/UserId</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     POST /api/messages
    ///     {
    ///         "groupId": 1,
    ///         "userId": 1,
    ///         "messageText": "Hello everyone! I'm new to this group and looking forward to connecting with others."
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     {
    ///         "id": 1,
    ///         "groupId": 1,
    ///         "userId": 1,
    ///         "messageText": "Hello everyone! I'm new to this group and looking forward to connecting with others.",
    ///         "timestamp": "2024-01-15T10:30:00Z",
    ///         "group": null,
    ///         "user": null
    ///     }
    /// </remarks>
    [HttpPost]
    public async Task<IActionResult> CreateMessage([FromBody] GroupMessage message)
    {
        if (message == null)
            return BadRequest("Message cannot be null.");

        // Only assign valid fields
        var newMessage = new GroupMessage
        {
            GroupId = message.GroupId,
            UserId = message.UserId,
            MessageText = message.MessageText,
            Timestamp = DateTime.UtcNow
        };

        _context.GroupMessages.Add(newMessage);
        await _context.SaveChangesAsync();

        return Ok(new {
            newMessage.Id,
            newMessage.MessageText,
            newMessage.Timestamp,
            newMessage.GroupId,
            newMessage.UserId
        });
    }

    /// <summary>
    /// Update an existing message
    /// </summary>
    /// <param name="id">The ID of the message to update</param>
    /// <param name="message">The updated message data</param>
    /// <returns>No content if successful</returns>
    /// <response code="204">Message updated successfully</response>
    /// <response code="400">Invalid message data or ID mismatch</response>
    /// <response code="404">Message not found</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     PUT /api/messages/1
    ///     {
    ///         "id": 1,
    ///         "groupId": 1,
    ///         "userId": 1,
    ///         "messageText": "Updated message content with corrections",
    ///         "timestamp": "2024-01-15T10:30:00Z"
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     HTTP 204 No Content
    /// </remarks>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMessage(int id, GroupMessage message)
    {
        if (id != message.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Entry(message).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MessageExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// Delete a message
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var message = await _context.GroupMessages.FindAsync(id);
        if (message == null)
        {
            return NotFound();
        }

        _context.GroupMessages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MessageExists(int id)
    {
        return _context.GroupMessages.Any(e => e.Id == id);
    }
}
