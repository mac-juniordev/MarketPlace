using Marketplace.Domain.Enums;

namespace Marketplace.Application.DTOs.Listing;

public class CreateListingRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public ListingType Type { get; set; }
    public Guid BusinessId { get; set; }
    public Guid CategoryId { get; set; }
    public int AvailableQuantity { get; set; } = 1;
    public bool IsReservable { get; set; } = true;
}