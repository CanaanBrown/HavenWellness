using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HavenWellness.Data;
using HavenWellness.Models;

namespace HavenWellness.Controllers;

/// <summary>
/// Controller for managing symptom entries and details
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SymptomsController : ControllerBase
{
    private readonly WellnessContext _context;

    public SymptomsController(WellnessContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Get all symptom entries with pagination and optional filters
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SymptomEntry>>> GetSymptoms(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20,
        [FromQuery] int? userId = null,
        [FromQuery] string? from = null,
        [FromQuery] string? to = null)
    {
        var query = _context.SymptomEntries
            .Include(se => se.User)
            .Include(se => se.SymptomDetails)
            .AsQueryable();

        if (userId.HasValue)
        {
            query = query.Where(se => se.UserId == userId.Value);
        }

        if (!string.IsNullOrEmpty(from) && DateOnly.TryParse(from, out var fromDate))
        {
            query = query.Where(se => se.Date >= fromDate);
        }

        if (!string.IsNullOrEmpty(to) && DateOnly.TryParse(to, out var toDate))
        {
            query = query.Where(se => se.Date <= toDate);
        }

        var symptoms = await query
            .OrderByDescending(se => se.Date)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(symptoms);
    }

    /// <summary>
    /// Get a specific symptom entry by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<SymptomEntry>> GetSymptom(int id)
    {
        var symptom = await _context.SymptomEntries
            .Include(se => se.User)
            .Include(se => se.SymptomDetails)
            .FirstOrDefaultAsync(se => se.Id == id);

        if (symptom == null)
        {
            return NotFound();
        }

        return Ok(symptom);
    }

    /// <summary>
    /// Create a new symptom entry
    /// </summary>
    /// <param name="symptom">The symptom entry object to create</param>
    /// <returns>The created symptom entry with assigned ID</returns>
    /// <response code="201">Symptom entry created successfully</response>
    /// <response code="400">Invalid symptom data or invalid UserId</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     POST /api/symptoms
    ///     {
    ///         "userId": 1,
    ///         "date": "2024-01-15"
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     {
    ///         "id": 1,
    ///         "userId": 1,
    ///         "date": "2024-01-15",
    ///         "user": null,
    ///         "symptomDetails": []
    ///     }
    /// </remarks>
    [HttpPost]
    public async Task<ActionResult<SymptomEntry>> CreateSymptom(SymptomEntry symptom)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verify user exists
        var userExists = await _context.Users.AnyAsync(u => u.Id == symptom.UserId);
        if (!userExists)
        {
            return BadRequest("Invalid UserId");
        }

        _context.SymptomEntries.Add(symptom);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSymptom), new { id = symptom.Id }, symptom);
    }

    /// <summary>
    /// Update an existing symptom entry
    /// </summary>
    /// <param name="id">The ID of the symptom entry to update</param>
    /// <param name="symptom">The updated symptom entry data</param>
    /// <returns>No content if successful</returns>
    /// <response code="204">Symptom entry updated successfully</response>
    /// <response code="400">Invalid symptom data or ID mismatch</response>
    /// <response code="404">Symptom entry not found</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     PUT /api/symptoms/1
    ///     {
    ///         "id": 1,
    ///         "userId": 1,
    ///         "date": "2024-01-15"
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     HTTP 204 No Content
    /// </remarks>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSymptom(int id, SymptomEntry symptom)
    {
        if (id != symptom.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Entry(symptom).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SymptomExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// Delete a symptom entry
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSymptom(int id)
    {
        var symptom = await _context.SymptomEntries.FindAsync(id);
        if (symptom == null)
        {
            return NotFound();
        }

        _context.SymptomEntries.Remove(symptom);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Get symptom details for a specific symptom entry
    /// </summary>
    [HttpGet("{symptomId}/details")]
    public async Task<ActionResult<IEnumerable<SymptomDetail>>> GetSymptomDetails(int symptomId)
    {
        var details = await _context.SymptomDetails
            .Where(sd => sd.SymptomEntryId == symptomId)
            .ToListAsync();

        return Ok(details);
    }

    /// <summary>
    /// Create a new symptom detail
    /// </summary>
    /// <param name="detail">The symptom detail object to create</param>
    /// <returns>The created symptom detail with assigned ID</returns>
    /// <response code="201">Symptom detail created successfully</response>
    /// <response code="400">Invalid symptom detail data or invalid SymptomEntryId</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     POST /api/symptoms/details
    ///     {
    ///         "symptomEntryId": 1,
    ///         "name": "Headache",
    ///         "painLevel": 7,
    ///         "notes": "Sharp pain in temples, started this morning"
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     {
    ///         "id": 1,
    ///         "symptomEntryId": 1,
    ///         "name": "Headache",
    ///         "painLevel": 7,
    ///         "notes": "Sharp pain in temples, started this morning",
    ///         "symptomEntry": null
    ///     }
    /// </remarks>
    [HttpPost("details")]
    public async Task<ActionResult<SymptomDetail>> CreateSymptomDetail(SymptomDetail detail)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verify symptom entry exists
        var symptomExists = await _context.SymptomEntries.AnyAsync(se => se.Id == detail.SymptomEntryId);
        if (!symptomExists)
        {
            return BadRequest("Invalid SymptomEntryId");
        }

        _context.SymptomDetails.Add(detail);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSymptomDetails), new { symptomId = detail.SymptomEntryId }, detail);
    }

    /// <summary>
    /// Update an existing symptom detail
    /// </summary>
    /// <param name="id">The ID of the symptom detail to update</param>
    /// <param name="detail">The updated symptom detail data</param>
    /// <returns>No content if successful</returns>
    /// <response code="204">Symptom detail updated successfully</response>
    /// <response code="400">Invalid symptom detail data or ID mismatch</response>
    /// <response code="404">Symptom detail not found</response>
    /// <remarks>
    /// Sample request:
    /// 
    ///     PUT /api/symptoms/details/1
    ///     {
    ///         "id": 1,
    ///         "symptomEntryId": 1,
    ///         "name": "Migraine Headache",
    ///         "painLevel": 8,
    ///         "notes": "Updated: Severe migraine with nausea, lasted 4 hours"
    ///     }
    /// 
    /// Sample response:
    /// 
    ///     HTTP 204 No Content
    /// </remarks>
    [HttpPut("details/{id}")]
    public async Task<IActionResult> UpdateSymptomDetail(int id, SymptomDetail detail)
    {
        if (id != detail.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Entry(detail).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!SymptomDetailExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    /// <summary>
    /// Delete a symptom detail
    /// </summary>
    [HttpDelete("details/{id}")]
    public async Task<IActionResult> DeleteSymptomDetail(int id)
    {
        var detail = await _context.SymptomDetails.FindAsync(id);
        if (detail == null)
        {
            return NotFound();
        }

        _context.SymptomDetails.Remove(detail);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool SymptomExists(int id)
    {
        return _context.SymptomEntries.Any(e => e.Id == id);
    }

    private bool SymptomDetailExists(int id)
    {
        return _context.SymptomDetails.Any(e => e.Id == id);
    }
}
