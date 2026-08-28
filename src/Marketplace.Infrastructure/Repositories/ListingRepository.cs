using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Marketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public class ListingRepository : IListingRepository
{
    private readonly MarketplaceDbContext _context;

    public ListingRepository(MarketplaceDbContext context)
    {
        _context = context;
    }

    public async Task<Listing?> GetByIdAsync(Guid id)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Include(l => l.ProductDetails)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<IEnumerable<Listing>> GetByBusinessIdAsync(Guid businessId)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Where(l => l.BusinessId == businessId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Listing>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Where(l => l.CategoryId == categoryId && l.IsAvailable)
            .ToListAsync();
    }

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
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Listing>> GetFeaturedAsync(int count)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Where(l => l.IsAvailable && l.Status == ListingStatus.Active)
            .OrderByDescending(l => l.ViewCount)
            .ThenByDescending(l => l.CreatedAt)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Listing> CreateAsync(Listing listing)
    {
        await _context.Listings.AddAsync(listing);
        await _context.SaveChangesAsync();
        return listing;
    }

    public async Task UpdateAsync(Listing listing)
    {
        _context.Listings.Update(listing);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing != null)
        {
            _context.Listings.Remove(listing);
            await _context.SaveChangesAsync();
        }
    }
}