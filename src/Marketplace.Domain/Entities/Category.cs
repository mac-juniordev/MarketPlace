using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Represents a marketplace listing category.
public class Category : BaseEntity
{
    // Category name.
    public string Name { get; set; } = string.Empty;

    // URL-friendly category identifier.
    public string Slug { get; set; } = string.Empty;

    // Optional category description.
    public string? Description { get; set; }

    // Optional category icon URL.
    public string? IconUrl { get; set; }

    // ID of the parent category, if any.
    public Guid? ParentCategoryId { get; set; }

    // Indicates whether the category is active.
    public bool IsActive { get; set; } = true;

    // Parent category.
    public Category? ParentCategory { get; set; }

    // Child categories.
    public ICollection<Category> SubCategories { get; set; } = new List<Category>();

    // Listings in this category.
    public ICollection<Listing> Listings { get; set; } = new List<Listing>();
}
