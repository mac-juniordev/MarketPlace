using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Represents a user's review of a listing.
public class Review : BaseEntity, IAuditableEntity
{
    // ID of the reviewed listing.
    public Guid ListingId { get; set; }

    // ID of the reviewing user.
    public Guid UserId { get; set; }

    // Rating given to the listing.
    public int Rating { get; set; }

    // Optional review comment.
    public string? Comment { get; set; }

    // Indicates whether the review is from a verified purchase.
    public bool IsVerifiedPurchase { get; set; }

    // ID of the user who created this record.
    public Guid CreatedBy { get; set; }

    // ID of the user who last updated this record.
    public Guid? UpdatedBy { get; set; }

    // Associated listing.
    public Listing Listing { get; set; } = null!;

    // User who submitted the review.
    public User User { get; set; } = null!;
}
