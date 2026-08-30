// Import Reservation DTOs
using Marketplace.Application.DTOs.Reservation;
// Import ReservationService
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
// URL prefix /api/reservations
[Route("api/reservations")]
// Require authentication for all endpoints
[Authorize]
public class ReservationController : ControllerBase
{
    // Private field for ReservationService
    private readonly ReservationService _reservationService;

    // Constructor injection
    public ReservationController(ReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    // POST /api/reservations
    [HttpPost]
    // Create a reservation
    public async Task<IActionResult> Create([FromBody] CreateReservationRequest request)
    {
        // Get current user ID
        var userId = GetUserId();

        // Create reservation
        var result = await _reservationService.CreateAsync(userId, request);

        // Return reservation
        return Ok(result);
    }

    // GET /api/reservations/{id}
    [HttpGet("{id}")]
    // Get one reservation
    public async Task<IActionResult> GetById(Guid id)
    {
        // Fetch reservation
        var result = await _reservationService.GetByIdAsync(id);

        // Return reservation
        return Ok(result);
    }

    // GET /api/reservations/my
    [HttpGet("my")]
    // Get current user's reservations
    public async Task<IActionResult> GetMyReservations()
    {
        // Get user ID
        var userId = GetUserId();

        // Fetch user's reservations
        var result = await _reservationService.GetByUserIdAsync(userId);

        // Return list
        return Ok(result);
    }

    // GET /api/reservations/listing/{listingId}
    [HttpGet("listing/{listingId}")]
    // Get reservations for a listing
    public async Task<IActionResult> GetByListing(Guid listingId)
    {
        // Fetch reservations
        var result = await _reservationService.GetByListingIdAsync(listingId);

        // Return list
        return Ok(result);
    }

    // POST /api/reservations/{id}/cancel
    [HttpPost("{id}/cancel")]
    // Cancel a reservation
    public async Task<IActionResult> Cancel(Guid id)
    {
        // Get user ID
        var userId = GetUserId();

        // Cancel reservation
        await _reservationService.CancelAsync(id, userId);

        // Return success message
        return Ok(new { message = "Reservation cancelled" });
    }

    // POST /api/reservations/{id}/expire
    [HttpPost("{id}/expire")]
    // Only admins can force expire
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Expire(Guid id)
    {
        // Expire reservation
        await _reservationService.ExpireAsync(id);

        // Return success
        return Ok(new { message = "Reservation expired" });
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