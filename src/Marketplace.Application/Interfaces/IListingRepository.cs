// Import listing entity from Domain
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

// Interface: defines contract for listing data access
public interface IListingRepository
{
    // Get a listing by ID
    Task<Listing?> GetByIdAsync(Guid id);

    // Get all listings for a business
    Task<IEnumerable<Listing>> GetByBusinessIdAsync(Guid businessId);

    // Get all listings in a category
    Task<IEnumerable<Listing>> GetByCategoryIdAsync(Guid categoryId);

    // Search listings with pagination
    Task<IEnumerable<Listing>> SearchAsync(string query, int page, int pageSize);

    // Get featured listings
    Task<IEnumerable<Listing>> GetFeaturedAsync(int count);

    // Create a new listing
    Task<Listing> CreateAsync(Listing listing);

    // Update an existing listing
    Task UpdateAsync(Listing listing);

    // Delete a listing
    Task DeleteAsync(Guid id);

    // Get a listing by ID and lock the row for concurrency
    Task<Listing?> GetByIdWithLockAsync(Guid id);
}