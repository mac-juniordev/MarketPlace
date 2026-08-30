// Import Review DTOs
using Marketplace.Application.DTOs.Review;
// Import ReviewService
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
// URL prefix /api/reviews
[Route("api/reviews")]
public class ReviewController : ControllerBase
{
    // Private field for ReviewService
    private readonly ReviewService _reviewService;

    // Constructor injection
    public ReviewController(ReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    // GET /api/reviews/listing/{listingId}
    [HttpGet("listing/{listingId}")]
    // Get reviews for a listing (public)
    public async Task<IActionResult> GetByListing(Guid listingId)
    {
        // Fetch reviews
        var result = await _reviewService.GetByListingIdAsync(listingId);

        // Return list
        return Ok(result);
    }

    // GET /api/reviews/user/{userId}
    [HttpGet("user/{userId}")]
    // Get reviews by a user (public)
    public async Task<IActionResult> GetByUser(Guid userId)
    {
        // Fetch reviews
        var result = await _reviewService.GetByUserIdAsync(userId);

        // Return list
        return Ok(result);
    }

    // POST /api/reviews
    [HttpPost]
    // Require authentication to create review
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateReviewRequest request)
    {
        // Get user ID
        var userId = GetUserId();

        // Create review
        var result = await _reviewService.CreateAsync(userId, request);

        // Return review
        return Ok(result);
    }

    // DELETE /api/reviews/{id}
    [HttpDelete("{id}")]
    // Require authentication to delete
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        // Get user ID
        var userId = GetUserId();

        // Delete review
        await _reviewService.DeleteAsync(id, userId);

        // Return 204
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