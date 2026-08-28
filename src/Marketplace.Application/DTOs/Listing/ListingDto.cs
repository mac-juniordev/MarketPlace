using Marketplace.Domain.Enums;

namespace Marketplace.Application.DTOs.Listing;

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
    public bool IsAvailable { get; set; }
    public Guid BusinessId { get; set; }
    public Guid CategoryId { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}