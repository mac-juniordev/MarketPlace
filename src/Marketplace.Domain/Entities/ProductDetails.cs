using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Stores product-specific details for a listing.
public class ProductDetails : BaseEntity
{
    // ID of the associated listing.
    public Guid ListingId { get; set; }

    // Product brand.
    public string? Brand { get; set; }

    // Product model.
    public string? Model { get; set; }

    // Product condition.
    public string? Condition { get; set; }

    // Number of units available.
    public int AvailableQuantity { get; set; } = 1;

    // Indicates whether the product can be reserved.
    public bool IsReservable { get; set; } = true;

    // Associated listing.
    public Listing Listing { get; set; } = null!;
}
