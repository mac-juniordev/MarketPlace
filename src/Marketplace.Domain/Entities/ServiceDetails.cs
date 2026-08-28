using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Stores service-specific details for a listing.
public class ServiceDetails : BaseEntity
{
    // ID of the associated listing.
    public Guid ListingId { get; set; }

    // Type of service offered.
    public string ServiceType { get; set; } = string.Empty;

    // Indicates whether the service is available online.
    public bool IsAvailableOnline { get; set; }

    // Indicates whether the service is available in person.
    public bool IsAvailableInPerson { get; set; }

    // Service availability hours.
    public string? AvailabilityHours { get; set; }

    // Associated listing.
    public Listing Listing { get; set; } = null!;
}
