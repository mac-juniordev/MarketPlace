// Import data annotations
using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs.Business;

// Request DTO for creating a business
public class CreateBusinessRequest
{
    // Business name is required
    [Required(ErrorMessage = "Business name is required")]
    [MaxLength(100, ErrorMessage = "Business name cannot exceed 100 characters")]
    public string Name { get; set; } = string.Empty;

    // Description is required
    [Required(ErrorMessage = "Description is required")]
    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string Description { get; set; } = string.Empty;

    // Phone is optional
    public string? PhoneNumber { get; set; }

    // Email is optional
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string? Email { get; set; }

    // Address is optional
    public string? Address { get; set; }

    // City is optional
    public string? City { get; set; }
}