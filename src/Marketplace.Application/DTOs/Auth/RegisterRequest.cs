// Import data annotations for validation
using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs.Auth;

// Request DTO for user registration
public class RegisterRequest
{
    // Email is required and must be valid email format
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    // Password is required and must be at least 6 characters
    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public string Password { get; set; } = string.Empty;

    // First name is required
    [Required(ErrorMessage = "First name is required")]
    public string FirstName { get; set; } = string.Empty;

    // Last name is required
    [Required(ErrorMessage = "Last name is required")]
    public string LastName { get; set; } = string.Empty;

    // Phone number is optional
    public string? PhoneNumber { get; set; }
}