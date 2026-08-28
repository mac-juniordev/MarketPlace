using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Represents a business listed on the marketplace.
public class Business : BaseEntity, IAuditableEntity
{
    // Business name.
    public string Name { get; set; } = string.Empty;

    // Business description.
    public string Description { get; set; } = string.Empty;

    // Optional business logo URL.
    public string? LogoUrl { get; set; }

    // Optional business website.
    public string? WebsiteUrl { get; set; }

    // Optional business phone number.
    public string? PhoneNumber { get; set; }

    // Optional business email.
    public string? Email { get; set; }

    // Business address.
    public string? Address { get; set; }

    // Business city.
    public string? City { get; set; }

    // Business country, defaulting to Cameroon.
    public string? Country { get; set; } = "Cameroon";

    // Geographic latitude.
    public double? Latitude { get; set; }

    // Geographic longitude.
    public double? Longitude { get; set; }

    // Indicates whether the business is verified.
    public bool IsVerified { get; set; }

    // Indicates whether the business is active.
    public bool IsActive { get; set; } = true;

    // ID of the business owner.
    public Guid OwnerId { get; set; }

    // ID of the user who created this record.
    public Guid CreatedBy { get; set; }

    // ID of the user who last updated this record.
    public Guid? UpdatedBy { get; set; }

    // Business owner.
    public User Owner { get; set; } = null!;

    // Listings belonging to the business.
    public ICollection<Listing> Listings { get; set; } = new List<Listing>();

    // Staff members of the business.
    public ICollection<BusinessStaff> Staff { get; set; } = new List<BusinessStaff>();
}