using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

// Represents an item, property, vehicle, or service listed on the marketplace.
public class Listing : BaseEntity, IAuditableEntity
{
    // Listing title.
    public string Title { get; set; } = string.Empty;

    // Listing description.
    public string Description { get; set; } = string.Empty;

    // Listing price.
    public decimal Price { get; set; }

    // Currency used for the price.
    public string? Currency { get; set; } = "XAF";

    // Type of listing.
    public ListingType Type { get; set; }

    // Current listing status.
    public ListingStatus Status { get; set; } = ListingStatus.Active;

    // Number of listing views.
    public int ViewCount { get; set; }

    // Number of times the listing was shared.
    public int ShareCount { get; set; }

    // Number of reservations made.
    public int ReservationCount { get; set; }

    // Indicates whether the listing is featured.
    public bool IsFeatured { get; set; }

    // Indicates whether the listing is currently available.
    public bool IsAvailable { get; set; } = true;

    // ID of the owning business.
    public Guid BusinessId { get; set; }

    // ID of the listing category.
    public Guid CategoryId { get; set; }

    // ID of the user who created this record.
    public Guid CreatedBy { get; set; }

    // ID of the user who last updated this record.
    public Guid? UpdatedBy { get; set; }

    // Associated business.
    public Business Business { get; set; } = null!;

    // Associated category.
    public Category Category { get; set; } = null!;

    // Images attached to the listing.
    public ICollection<ListingImage> Images { get; set; } = new List<ListingImage>();

    // Reservations for the listing.
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    // Reviews for the listing.
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    // Product-specific details.
    public ProductDetails? ProductDetails { get; set; }

    // Property-specific details.
    public PropertyDetails? PropertyDetails { get; set; }

    // Vehicle-specific details.
    public VehicleDetails? VehicleDetails { get; set; }

    // Service-specific details.
    public ServiceDetails? ServiceDetails { get; set; }
}
