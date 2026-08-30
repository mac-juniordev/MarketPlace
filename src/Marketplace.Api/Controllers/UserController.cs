// Import User DTOs
using Marketplace.Application.DTOs.User;
// Import UserService
using Marketplace.Application.Services;
// Import Authorize attribute for authentication
using Microsoft.AspNetCore.Authorization;
// Import ASP.NET Core MVC
using Microsoft.AspNetCore.Mvc;
// Import ClaimTypes for reading JWT claims
using System.Security.Claims;

namespace Marketplace.Api.Controllers;

// API controller attribute
[ApiController]
// URL prefix /api/users
[Route("api/users")]
// Attribute: all endpoints in this controller require a valid JWT token
// If no valid token, ASP.NET returns 401 Unauthorized automatically
[Authorize]
public class UserController : ControllerBase
{
    // Private field for UserService
    private readonly UserService _userService;

    // Constructor: receives UserService from dependency injection
    public UserController(UserService userService)
    {
        // Store the service
        _userService = userService;
    }

    // GET /api/users/me
    [HttpGet("me")]
    // Returns the current logged-in user's profile
    public async Task<IActionResult> GetCurrentUser()
    {
        // Get the user ID from the JWT token
        var userId = GetUserId();

        // Fetch user from database using the service
        var user = await _userService.GetByIdAsync(userId);

        // Return 200 OK with user data
        return Ok(user);
    }

    // PUT /api/users/me
    [HttpPut("me")]
    // Updates the current user's profile
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        // Get user ID from token
        var userId = GetUserId();

        // Call service to update profile
        var user = await _userService.UpdateProfileAsync(userId, request);

        // Return updated user
        return Ok(user);
    }

    // Private helper method
    // Returns the current user's ID from the JWT token
    private Guid GetUserId()
    {
        // Find the claim that contains the user ID
        // ClaimTypes.NameIdentifier is a standard claim type for user ID
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        // Convert the string claim to a Guid and return
        return Guid.Parse(userIdClaim!);
    }
}