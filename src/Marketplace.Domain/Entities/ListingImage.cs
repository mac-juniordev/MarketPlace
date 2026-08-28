using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Represents an image attached to a listing.
public class ListingImage : BaseEntity
{
    // ID of the associated listing.
    public Guid ListingId { get; set; }

    // Image URL.
    public string Url { get; set; } = string.Empty;

    // Optional image caption.
    public string? Caption { get; set; }

    // Image display order.
    public int DisplayOrder { get; set; }

    // Indicates whether this is the main image.
    public bool IsMain { get; set; }

    // Associated listing.
    public Listing Listing { get; set; } = null!;
}
