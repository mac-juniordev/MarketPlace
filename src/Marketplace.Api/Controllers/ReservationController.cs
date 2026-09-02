using Marketplace.Application.DTOs.Reservation;
using Marketplace.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Marketplace.Api.Controllers;

[ApiController]
[Route("api/reservations")]
[Authorize]
public class ReservationController : ControllerBase
{
    private readonly ReservationService _reservationService;

    public ReservationController(ReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    // POST /api/reservations
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateReservationRequest request)
    {
        var userId = GetUserId();

        var result = await _reservationService.CreateAsync(
            userId,
            request
        );

        return Ok(result);
    }

    // GET /api/reservations/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _reservationService.GetByIdAsync(id);

        return Ok(result);
    }

    // GET /api/reservations/my
    [HttpGet("my")]
    public async Task<IActionResult> GetMyReservations()
    {
        var userId = GetUserId();

        var result = await _reservationService.GetByUserIdAsync(userId);

        return Ok(result);
    }

    // GET /api/reservations/listing/{listingId}
    [HttpGet("listing/{listingId}")]
    public async Task<IActionResult> GetByListing(Guid listingId)
    {
        var result = await _reservationService.GetByListingIdAsync(listingId);

        return Ok(result);
    }

    // POST /api/reservations/{id}/cancel
    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> Cancel(Guid id)
    {
        var userId = GetUserId();

        await _reservationService.CancelAsync(id, userId);

        return Ok(new { message = "Reservation cancelled" });
    }

    // POST /api/reservations/{id}/expire
    [HttpPost("{id}/expire")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Expire(Guid id)
    {
        await _reservationService.ExpireAsync(id);

        return Ok(new { message = "Reservation expired" });
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
        {
            throw new UnauthorizedAccessException("User ID not found.");
        }

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID.");
        }

        return userId;
    }
}
