// Import Report DTOs
using Marketplace.Application.DTOs.Report;
// Import ReportService
using Marketplace.Application.Services;
// Import ReportStatus enum
using Marketplace.Domain.Enums;
// Import Authorize
using Microsoft.AspNetCore.Authorization;
// Import MVC
using Microsoft.AspNetCore.Mvc;
// Import ClaimTypes
using System.Security.Claims;

namespace Marketplace.Api.Controllers;

// API controller
[ApiController]
// URL prefix /api/reports
[Route("api/reports")]
public class ReportController : ControllerBase
{
    // Private field
    private readonly ReportService _reportService;

    // Constructor injection
    public ReportController(ReportService reportService)
    {
        _reportService = reportService;
    }

    // POST /api/reports
    [HttpPost]
    // Require authentication to report
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateReportRequest request)
    {
        // Get user ID
        var userId = GetUserId();

        // Create report
        var result = await _reportService.CreateAsync(userId, request);

        // Return report
        return Ok(result);
    }

    // GET /api/reports/pending
    [HttpGet("pending")]
    // Only admins can see pending reports
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetPending()
    {
        // Fetch pending reports
        var result = await _reportService.GetPendingAsync();

        // Return list
        return Ok(result);
    }

    // POST /api/reports/{id}/resolve
    [HttpPost("{id}/resolve")]
    // Only admins can resolve reports
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Resolve(Guid id, [FromBody] ResolveReportRequest request)
    {
        // Resolve report
        var result = await _reportService.ResolveAsync(id, request.Status, request.AdminNotes);

        // Return updated report
        return Ok(result);
    }

    // Private helper
    private Guid GetUserId()
    {
        // Extract user ID from JWT
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Convert to Guid
        return Guid.Parse(userIdClaim!);
    }
}

// Request DTO for resolving reports
public class ResolveReportRequest
{
    // The new status
    public ReportStatus Status { get; set; }

    // Optional admin notes
    public string? AdminNotes { get; set; }
}