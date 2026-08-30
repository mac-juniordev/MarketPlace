// Import Listing DTOs
using Marketplace.Application.DTOs.Listing;
// Import ListingService
using Marketplace.Application.Services;
// Import Authorize
using Microsoft.AspNetCore.Authorization;
// Import MVC
using Microsoft.AspNetCore.Mvc;
// Import ClaimTypes
using System.Security.Claims;

namespace Marketplace.Api.Controllers;

// API controller
[ApiController]
// URL prefix /api/listings
[Route("api/listings")]
// No [Authorize] means public by default
public class ListingController : ControllerBase
{
    // Private field for ListingService
    private readonly ListingService _listingService;

    // Constructor injection
    public ListingController(ListingService listingService)
    {
        _listingService = listingService;
    }

    // GET /api/listings
    [HttpGet]
    // Get all listings (first 50)
    public async Task<IActionResult> GetAll()
    {
        // Fetch listings with empty query (all)
        var result = await _listingService.SearchAsync(string.Empty, 1, 50);

        // Return list
        return Ok(result);
    }

    // GET /api/listings/{id}
    [HttpGet("{id}")]
    // Get one listing by ID
    public async Task<IActionResult> GetById(Guid id)
    {
        // Fetch listing
        var result = await _listingService.GetByIdAsync(id);

        // Return listing
        return Ok(result);
    }

    // GET /api/listings/search?query=shoes&page=1&pageSize=20
    [HttpGet("search")]
    // Search listings
    // [FromQuery] reads parameters from the URL query string
    public async Task<IActionResult> Search([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        // Call search
        var result = await _listingService.SearchAsync(query, page, pageSize);

        // Return results
        return Ok(result);
    }

    // GET /api/listings/category/{categoryId}
    [HttpGet("category/{categoryId}")]
    // Get listings by category
    public async Task<IActionResult> GetByCategory(Guid categoryId)
    {
        // Fetch listings for category
        var result = await _listingService.GetByCategoryIdAsync(categoryId);

        // Return list
        return Ok(result);
    }

    // GET /api/listings/business/{businessId}
    [HttpGet("business/{businessId}")]
    // Get listings by business
    public async Task<IActionResult> GetByBusiness(Guid businessId)
    {
        // Fetch listings for business
        var result = await _listingService.GetByBusinessIdAsync(businessId);

        // Return list
        return Ok(result);
    }

    // GET /api/listings/featured?count=10
    [HttpGet("featured")]
    // Get featured listings
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 10)
    {
        // Fetch featured
        var result = await _listingService.GetFeaturedAsync(count);

        // Return list
        return Ok(result);
    }

    // POST /api/listings
    [HttpPost]
    // Require authentication to create
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateListingRequest request)
    {
        // Get current user ID
        var userId = GetUserId();

        // Create listing
        var result = await _listingService.CreateAsync(userId, request);

        // Return created listing
        return Ok(result);
    }

    // PUT /api/listings/{id}
    [HttpPut("{id}")]
    // Require authentication to update
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateListingRequest request)
    {
        // Get current user ID
        var userId = GetUserId();

        // Update listing
        var result = await _listingService.UpdateAsync(id, userId, request);

        // Return updated listing
        return Ok(result);
    }

    // DELETE /api/listings/{id}
    [HttpDelete("{id}")]
    // Require authentication to delete
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        // Get current user ID
        var userId = GetUserId();

        // Delete listing
        await _listingService.DeleteAsync(id, userId);

        // Return 204 No Content (success, nothing to return)
        return NoContent();
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