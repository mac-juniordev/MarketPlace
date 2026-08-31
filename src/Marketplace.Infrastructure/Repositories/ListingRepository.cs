// Import interfaces from Application
using Marketplace.Application.Interfaces;
// Import entities from Domain
using Marketplace.Domain.Entities;
// Import enums
using Marketplace.Domain.Enums;
// Import DbContext
using Marketplace.Infrastructure.Data;
// Import EF Core
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

// Class: implements IListingRepository using EF Core
public class ListingRepository : IListingRepository
{
    // Private field: holds database context
    private readonly MarketplaceDbContext _context;

    // Constructor: receives database context via dependency injection
    public ListingRepository(MarketplaceDbContext context)
    {
        _context = context;
    }

    // Get listing by ID with related data
    public async Task<Listing?> GetByIdAsync(Guid id)
    {
        return await _context.Listings
            .Include(l => l.Business)        // Load business details
            .Include(l => l.Category)       // Load category details
            .Include(l => l.ProductDetails) // Load product details
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    // Get all listings for a business
    public async Task<IEnumerable<Listing>> GetByBusinessIdAsync(Guid businessId)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Where(l => l.BusinessId == businessId)
            .ToListAsync();
    }

    // Get all listings in a category
    public async Task<IEnumerable<Listing>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Where(l => l.CategoryId == categoryId && l.IsAvailable)
            .ToListAsync();
    }

    // Search listings with filters
    public async Task<IEnumerable<Listing>> SearchAsync(string query, int page, int pageSize)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Where(l => l.IsAvailable && (
                l.Title.Contains(query) ||
                l.Description.Contains(query) ||
                l.Business.Name.Contains(query)
            ))
            .Skip((page - 1) * pageSize)  // Skip previous pages
            .Take(pageSize)               // Take current page
            .ToListAsync();
    }

    // Get featured listings based on views
    public async Task<IEnumerable<Listing>> GetFeaturedAsync(int count)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Where(l => l.IsAvailable && l.Status == ListingStatus.Active)
            .OrderByDescending(l => l.ViewCount)      // Most views first
            .ThenByDescending(l => l.CreatedAt)       // Then newest
            .Take(count)
            .ToListAsync();
    }

    // Create new listing
    public async Task<Listing> CreateAsync(Listing listing)
    {
        await _context.Listings.AddAsync(listing);
        await _context.SaveChangesAsync();
        return listing;
    }

    // Update existing listing
    public async Task UpdateAsync(Listing listing)
    {
        _context.Listings.Update(listing);
        await _context.SaveChangesAsync();
    }

    // Delete listing
    public async Task DeleteAsync(Guid id)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing != null)
        {
            _context.Listings.Remove(listing);
            await _context.SaveChangesAsync();
        }
    }

    // Get listing by ID with lock
    // This is used for concurrency control
    public async Task<Listing?> GetByIdWithLockAsync(Guid id)
    {
        return await _context.Listings
            .Include(l => l.ProductDetails)
            .FirstOrDefaultAsync(l => l.Id == id);
    }
}