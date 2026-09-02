// Import DTOs
using Marketplace.Application.DTOs.Report;

// Import services
using Marketplace.Application.Services;

// Import enums
using Marketplace.Domain.Enums;

// Import authorization
using Microsoft.AspNetCore.Authorization;

// Import MVC
using Microsoft.AspNetCore.Mvc;

// Import claims
using System.Security.Claims;

namespace Marketplace.Api.Controllers;

// ============================================================
// REPORT CONTROLLER
// ============================================================

[ApiController]
[Route("api/reports")]
public class ReportController : ControllerBase
{
    // =========================================================
    // DEPENDENCIES
    // =========================================================

    private readonly ReportService _reportService;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ReportController(
        ReportService reportService)
    {
        _reportService = reportService;
    }

    // =========================================================
    // CREATE REPORT
    // POST /api/reports
    //
    // Public endpoint.
    // Customers can report listings without logging in.
    // =========================================================

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create(
        [FromBody] CreateReportRequest request)
    {
        if (request == null)
        {
            return BadRequest(new
            {
                message = "Report data is required."
            });
        }

        var userId = GetUserIdOrAnonymous();

        var result = await _reportService.CreateAsync(
            userId,
            request
        );

        return Ok(result);
    }

    // =========================================================
    // CREATE SELLER REPORT
    // POST /api/reports/seller
    //
    // Sellers and SuperAdmins can submit reports/issues.
    // =========================================================

    [HttpPost("seller")]
    [Authorize(Roles = "Seller,SuperAdmin")]
    public async Task<IActionResult> CreateSellerReport(
        [FromBody] CreateReportRequest request)
    {
        if (request == null)
        {
            return BadRequest(new
            {
                message = "Report data is required."
            });
        }

        var userId = GetUserId();

        var result = await _reportService.CreateAsync(
            userId,
            request
        );

        return Ok(result);
    }

    // =========================================================
    // GET PENDING REPORTS
    // GET /api/reports/pending
    //
    // Admin and SuperAdmin only.
    // =========================================================

    [HttpGet("pending")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetPending()
    {
        var result =
            await _reportService.GetPendingAsync();

        return Ok(result);
    }

    // =========================================================
    // RESOLVE REPORT
    // POST /api/reports/{id}/resolve
    //
    // Admin and SuperAdmin only.
    // =========================================================

    [HttpPost("{id}/resolve")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Resolve(
        Guid id,
        [FromBody] ResolveReportRequest request)
    {
        if (request == null)
        {
            return BadRequest(new
            {
                message = "Resolution data is required."
            });
        }

        var result =
            await _reportService.ResolveAsync(
                id,
                request.Status,
                request.AdminNotes
            );

        return Ok(result);
    }

    // =========================================================
    // GET AUTHENTICATED USER ID
    // =========================================================

    private Guid GetUserId()
    {
        var userIdClaim =
            User.FindFirst(
                ClaimTypes.NameIdentifier
            )?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
        {
            throw new UnauthorizedAccessException(
                "User ID was not found in the authentication token."
            );
        }

        if (!Guid.TryParse(
                userIdClaim,
                out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid user ID in authentication token."
            );
        }

        return userId;
    }

    // =========================================================
    // GET USER ID OR ANONYMOUS ID
    // =========================================================

    private Guid GetUserIdOrAnonymous()
    {
        var userIdClaim =
            User.FindFirst(
                ClaimTypes.NameIdentifier
            )?.Value;

        if (!string.IsNullOrWhiteSpace(userIdClaim) &&
            Guid.TryParse(
                userIdClaim,
                out var userId))
        {
            return userId;
        }

        return Guid.NewGuid();
    }
}

// ============================================================
// RESOLVE REPORT REQUEST DTO
// ============================================================

public class ResolveReportRequest
{
    public ReportStatus Status { get; set; }

    public string? AdminNotes { get; set; }
}
