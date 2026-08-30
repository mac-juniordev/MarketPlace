// Import NotificationService
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
// URL prefix /api/notifications
[Route("api/notifications")]
// Require authentication
[Authorize]
public class NotificationController : ControllerBase
{
    // Private field
    private readonly NotificationService _notificationService;

    // Constructor injection
    public NotificationController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    // GET /api/notifications?unreadOnly=true
    [HttpGet]
    // Get current user's notifications
    public async Task<IActionResult> GetMyNotifications([FromQuery] bool unreadOnly = false)
    {
        // Get user ID
        var userId = GetUserId();

        // Fetch notifications
        var result = await _notificationService.GetByUserIdAsync(userId, unreadOnly);

        // Return list
        return Ok(result);
    }

    // POST /api/notifications/{id}/read
    [HttpPost("{id}/read")]
    // Mark a notification as read
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        // Get user ID
        var userId = GetUserId();

        // Mark as read
        await _notificationService.MarkAsReadAsync(id, userId);

        // Return success
        return Ok(new { message = "Notification marked as read" });
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