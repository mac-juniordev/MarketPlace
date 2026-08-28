using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Stores vehicle-specific details for a listing.
public class VehicleDetails : BaseEntity
{
    // ID of the associated listing.
    public Guid ListingId { get; set; }

    // Vehicle manufacturer.
    public string Make { get; set; } = string.Empty;

    // Vehicle model.
    public string Model { get; set; } = string.Empty;

    // Vehicle manufacturing year.
    public int Year { get; set; }

    // Vehicle mileage.
    public int Mileage { get; set; }

    // Vehicle transmission type.
    public string? Transmission { get; set; }

    // Vehicle fuel type.
    public string? FuelType { get; set; }

    // Vehicle condition.
    public string? Condition { get; set; }

    // Associated listing.
    public Listing Listing { get; set; } = null!;
}
