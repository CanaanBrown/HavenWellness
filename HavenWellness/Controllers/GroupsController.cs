using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HavenWellness.Data;
using HavenWellness.Models;

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
        var groups = await _context.Groups
            .OrderBy(g => g.Id)
            .Select(g => new {
                g.Id,
                g.GroupName,
                g.Description
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
    /// <param name="group">The group object to create</param>
    /// <returns>The created group with assigned ID</returns>
    /// <response code="201">Group created successfully</response>
    /// <response code="400">Invalid group data</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     POST /api/groups
    ///     {
    ///         "groupName": "Chronic Pain Support Group",
    ///         "description": "A supportive community for people managing chronic pain conditions"
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     {
    ///         "id": 1,
    ///         "groupName": "Chronic Pain Support Group",
    ///         "description": "A supportive community for people managing chronic pain conditions",
    ///         "userGroups": [],
    ///         "groupMessages": []
    ///     }
    /// </remarks>
    [HttpPost]
    public async Task<ActionResult<Group>> CreateGroup(Group group)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Groups.Add(group);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetGroup), new { id = group.Id }, group);
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
