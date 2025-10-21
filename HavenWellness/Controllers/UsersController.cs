using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HavenWellness.Data;
using HavenWellness.Models;

namespace HavenWellness.Controllers;

/// <summary>
/// Controller for managing users
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly WellnessContext _context;

    public UsersController(WellnessContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all users with pagination
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20)
    {
        var users = await _context.Users
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(users);
    }

    /// <summary>
    /// Get a specific user by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    /// <param name="user">The user object to create</param>
    /// <returns>The created user with assigned ID and DateJoined</returns>
    /// <response code="201">User created successfully</response>
    /// <response code="400">Invalid user data</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     POST /api/users
    ///     {
    ///         "name": "John Doe",
    ///         "email": "john.doe@example.com",
    ///         "passwordHash": "hashed_password_string"
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     {
    ///         "id": 1,
    ///         "name": "John Doe",
    ///         "email": "john.doe@example.com",
    ///         "passwordHash": "hashed_password_string",
    ///         "dateJoined": "2024-01-15T10:30:00Z",
    ///         "symptomEntries": [],
    ///         "userGroups": [],
    ///         "groupMessages": []
    ///     }
    /// </remarks>
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(User user)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    /// <param name="id">The ID of the user to update</param>
    /// <param name="user">The updated user data</param>
    /// <returns>No content if successful</returns>
    /// <response code="204">User updated successfully</response>
    /// <response code="400">Invalid user data or ID mismatch</response>
    /// <response code="404">User not found</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     PUT /api/users/1
    ///     {
    ///         "id": 1,
    ///         "name": "John Smith",
    ///         "email": "john.smith@example.com",
    ///         "passwordHash": "updated_hashed_password",
    ///         "dateJoined": "2024-01-15T10:30:00Z"
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     HTTP 204 No Content
    /// </remarks>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User user)
    {
        if (id != user.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Entry(user).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// Delete a user
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool UserExists(int id)
    {
        return _context.Users.Any(e => e.Id == id);
    }
}
