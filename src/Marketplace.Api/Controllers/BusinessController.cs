// Import Business DTOs
using Marketplace.Application.DTOs.Business;
// Import BusinessService
using Marketplace.Application.Services;
// Import Authorize and AllowAnonymous attributes
using Microsoft.AspNetCore.Authorization;
// Import MVC
using Microsoft.AspNetCore.Mvc;
// Import ClaimTypes
using System.Security.Claims;

namespace Marketplace.Api.Controllers;

// API controller
[ApiController]
// URL prefix /api/businesses
[Route("api/businesses")]
// Require authentication for all endpoints
[Authorize]
public class BusinessController : ControllerBase
{
    // Private field for BusinessService
    private readonly BusinessService _businessService;

    // Constructor injection
    public BusinessController(BusinessService businessService)
    {
        _businessService = businessService;
    }

    // POST /api/businesses
    [HttpPost]
    // Create a new business
    public async Task<IActionResult> Create([FromBody] CreateBusinessRequest request)
    {
        // Get the current user ID
        var userId = GetUserId();

        // Create business using the service
        var result = await _businessService.CreateAsync(userId, request);

        // Return created business
        return Ok(result);
    }

    // GET /api/businesses/{id}
    [HttpGet("{id}")]
    // Allow anyone to view a business without logging in
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        // Fetch business from service
        var result = await _businessService.GetByIdAsync(id);

        // Return business
        return Ok(result);
    }

    // GET /api/businesses/my
    [HttpGet("my")]
    // Get all businesses owned by the current user
    public async Task<IActionResult> GetMyBusinesses()
    {
        // Get current user ID
        var userId = GetUserId();

        // Fetch user's businesses
        var result = await _businessService.GetByOwnerIdAsync(userId);

        // Return list
        return Ok(result);
    }

    // PUT /api/businesses/{id}
    [HttpPut("{id}")]
    // Update a business
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBusinessRequest request)
    {
        // Get current user ID
        var userId = GetUserId();

        // Update business
        var result = await _businessService.UpdateAsync(id, userId, request);

        // Return updated business
        return Ok(result);
    }

    // Private helper to get user ID from JWT
    private Guid GetUserId()
    {
        // Extract user ID from JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Convert to Guid
        return Guid.Parse(userIdClaim!);
    }
}