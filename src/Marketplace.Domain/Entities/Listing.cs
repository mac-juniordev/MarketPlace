// Import common
using Marketplace.Domain.Common;
// Import enums
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

// Listing entity
public class Listing : BaseEntity, IAuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Currency { get; set; } = "XAF";
    public ListingType Type { get; set; }
    public ListingStatus Status { get; set; } = ListingStatus.Active;
    public int ViewCount { get; set; }
    public int ShareCount { get; set; }
    public int ReservationCount { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsAvailable { get; set; } = true;
    public Guid BusinessId { get; set; }
    public Guid CategoryId { get; set; }

    // Location fields
    public string? City { get; set; }
    public string? Quarter { get; set; }
    public string? Address { get; set; }
    public bool HasFixedLocation { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public Business Business { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public ICollection<ListingImage> Images { get; set; } = new List<ListingImage>();
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<Promotion> Promotions { get; set; } = new List<Promotion>();
    public ProductDetails? ProductDetails { get; set; }
    public PropertyDetails? PropertyDetails { get; set; }
    public VehicleDetails? VehicleDetails { get; set; }
    public ServiceDetails? ServiceDetails { get; set; }
}