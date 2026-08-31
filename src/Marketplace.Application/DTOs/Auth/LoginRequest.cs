// Import data annotations
using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs.Auth;

// Request DTO for user login
public class LoginRequest
{
    // Email is required
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    // Password is required
    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
}