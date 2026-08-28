using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Stores property-specific details for a listing.
public class PropertyDetails : BaseEntity
{
    // ID of the associated listing.
    public Guid ListingId { get; set; }

    // Type of property.
    public string PropertyType { get; set; } = string.Empty;

    // Number of bedrooms.
    public int Bedrooms { get; set; }

    // Number of bathrooms.
    public int Bathrooms { get; set; }

    // Property area in square meters.
    public double AreaSquareMeters { get; set; }

    // Indicates whether the property is for rent.
    public bool IsForRent { get; set; }

    // Indicates whether the property is for sale.
    public bool IsForSale { get; set; }

    // Associated listing.
    public Listing Listing { get; set; } = null!;
}
