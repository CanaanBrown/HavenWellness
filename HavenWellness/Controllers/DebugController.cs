using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HavenWellness.Data;

namespace HavenWellness.Controllers;

/// <summary>
/// Debug controller for development and testing purposes
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DebugController : ControllerBase
{
    private readonly WellnessContext _context;

    public DebugController(WellnessContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Returns counts of all major tables in the database
    /// </summary>
    /// <returns>JSON object with table counts</returns>
    [HttpGet("seed-info")]
    public async Task<IActionResult> GetSeedInfo()
    {
        var counts = new
        {
            Users = await _context.Users.CountAsync(),
            Groups = await _context.Groups.CountAsync(),
            GroupMessages = await _context.GroupMessages.CountAsync(),
            SymptomEntries = await _context.SymptomEntries.CountAsync(),
            SymptomDetails = await _context.SymptomDetails.CountAsync()
        };

        return Ok(counts);
    }
}
