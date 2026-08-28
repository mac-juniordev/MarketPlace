using Marketplace.Domain.Enums;

namespace Marketplace.Application.DTOs.Listing;

public class UpdateListingRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public ListingStatus Status { get; set; }
    public Guid CategoryId { get; set; }
    public bool IsAvailable { get; set; }
}