// Import data annotations
using System.ComponentModel.DataAnnotations;
// Import enums
using Marketplace.Domain.Enums;

namespace Marketplace.Application.DTOs.Listing;

// Request DTO for creating a listing
public class CreateListingRequest
{
    // Title is required
    [Required(ErrorMessage = "Title is required")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
    public string Title { get; set; } = string.Empty;

    // Description is required
    [Required(ErrorMessage = "Description is required")]
    [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string Description { get; set; } = string.Empty;

    // Price must be greater than 0
    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
    public decimal Price { get; set; }

    // Type is required
    [Required(ErrorMessage = "Type is required")]
    public ListingType Type { get; set; }

    // Business ID is required
    [Required(ErrorMessage = "Business ID is required")]
    public Guid BusinessId { get; set; }

    // Category ID is required
    [Required(ErrorMessage = "Category ID is required")]
    public Guid CategoryId { get; set; }

    // Quantity must be at least 1
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
    public int AvailableQuantity { get; set; } = 1;

    // Whether the product can be reserved
    public bool IsReservable { get; set; } = true;
}