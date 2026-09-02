// Import validation
using System.ComponentModel.DataAnnotations;
// Import enums
using Marketplace.Domain.Enums;

namespace Marketplace.Application.DTOs.Listing;

// Request DTO for creating a listing
public class CreateListingRequest
{
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required")]
    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Type is required")]
    public ListingType Type { get; set; }

    [Required(ErrorMessage = "Business ID is required")]
    public Guid BusinessId { get; set; }

    [Required(ErrorMessage = "Category ID is required")]
    public Guid CategoryId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int AvailableQuantity { get; set; } = 1;

    public bool IsReservable { get; set; } = true;

    public List<string>? Images { get; set; }

    // Location fields
    public string? City { get; set; }
    public string? Quarter { get; set; }
    public string? Address { get; set; }
    public bool HasFixedLocation { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
}