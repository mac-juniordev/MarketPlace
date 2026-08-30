// Using directive: imports IActionResult, ApiController, Route, HttpPost, FromBody
using Marketplace.Application.DTOs.Auth;
// Using directive: imports AuthService class
using Marketplace.Application.Services;
// Using directive: imports ASP.NET Core MVC attributes and interfaces
using Microsoft.AspNetCore.Mvc;

// Namespace: groups related code together
namespace Marketplace.Api.Controllers;

// Attribute: tells ASP.NET this class is an API controller
// It enables automatic model validation and other API behaviors
[ApiController]
// Attribute: defines the URL prefix for all endpoints in this controller
// All endpoints start with /api/auth
[Route("api/auth")]
// Class declaration: AuthController inherits from ControllerBase
// ControllerBase gives us helper methods like Ok(), NotFound(), etc.
public class AuthController : ControllerBase
{
    // Private field: holds the AuthService instance
    // readonly means it can only be set once in the constructor
    private readonly AuthService _authService;

    // Constructor: ASP.NET calls this when creating the controller
    // ASP.NET automatically passes the AuthService because we registered it in Program.cs
    public AuthController(AuthService authService)
    {
        // Store the passed AuthService in our private field
        // Now we can use _authService in all methods in this class
        _authService = authService;
    }

    // Attribute: defines this method handles POST requests to /api/auth/register
    [HttpPost("register")]
    // Method signature:
    // public - accessible from outside the class
    // async - this method runs asynchronously (does not block)
    // Task<IActionResult> - returns a Task that eventually produces an IActionResult
    // Register - method name
    // [FromBody] - tells ASP.NET to read the JSON body and convert to RegisterRequest
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Call the RegisterAsync method on the auth service
        // await means "wait for this to complete before continuing"
        // The result is an AuthResponse object
        var result = await _authService.RegisterAsync(request);

        // Return HTTP 200 OK with the result as JSON
        // Ok() is a helper method from ControllerBase
        return Ok(result);
    }

    // Attribute: defines this method handles POST requests to /api/auth/login
    [HttpPost("login")]
    // Login endpoint
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // Call LoginAsync on the auth service
        var result = await _authService.LoginAsync(request);

        // Return 200 OK with the result
        return Ok(result);
    }
}