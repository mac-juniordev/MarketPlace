// Import enums
using Marketplace.Domain.Enums;

namespace Marketplace.Application.DTOs.Listing;

// DTO for listing data
public class ListingDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "XAF";
    public ListingType Type { get; set; }
    public ListingStatus Status { get; set; }
    public int ViewCount { get; set; }
    public int ReservationCount { get; set; }
    public int ShareCount { get; set; }
    public bool IsAvailable { get; set; }
    public bool IsFeatured { get; set; }
    public Guid BusinessId { get; set; }
    public Guid CategoryId { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string BusinessDescription { get; set; } = string.Empty;
    public string? BusinessPhone { get; set; }
    public string? BusinessEmail { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new List<string>();
    public string? City { get; set; }
    public string? Quarter { get; set; }
    public string? Address { get; set; }
    public bool HasFixedLocation { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public DateTime CreatedAt { get; set; }
}