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
            .Include(l => l.Images)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<IEnumerable<Listing>> GetByBusinessIdAsync(Guid businessId)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Include(l => l.Images)
            .Where(l => l.BusinessId == businessId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Listing>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Include(l => l.Images)
            .Where(l => l.CategoryId == categoryId && l.IsAvailable)
            .ToListAsync();
    }

    public async Task<IEnumerable<Listing>> SearchAsync(string query, int page, int pageSize)
    {
        return await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Include(l => l.Images)
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
            .Include(l => l.Images)
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
    var listing = await _context.Listings
        .Include(l => l.Images)
        .Include(l => l.ProductDetails)
        .Include(l => l.PropertyDetails)
        .Include(l => l.VehicleDetails)
        .Include(l => l.ServiceDetails)
        .Include(l => l.Reservations)
        .Include(l => l.Reviews)
        .Include(l => l.Promotions)
        .FirstOrDefaultAsync(l => l.Id == id);

    if (listing != null)
    {
        // Delete reports that reference this listing
        var reports = await _context.Reports
            .Where(r => r.ReportedListingId == id)
            .ToListAsync();

        if (reports.Count > 0)
            _context.Reports.RemoveRange(reports);

        // Delete related entities
        if (listing.Images != null)
            _context.ListingImages.RemoveRange(listing.Images);

        if (listing.ProductDetails != null)
            _context.ProductDetails.Remove(listing.ProductDetails);

        if (listing.PropertyDetails != null)
            _context.PropertyDetails.Remove(listing.PropertyDetails);

        if (listing.VehicleDetails != null)
            _context.VehicleDetails.Remove(listing.VehicleDetails);

        if (listing.ServiceDetails != null)
            _context.ServiceDetails.Remove(listing.ServiceDetails);

        if (listing.Reservations != null)
            _context.Reservations.RemoveRange(listing.Reservations);

        if (listing.Reviews != null)
            _context.Reviews.RemoveRange(listing.Reviews);

        if (listing.Promotions != null)
            _context.Promotions.RemoveRange(listing.Promotions);

        _context.Listings.Remove(listing);
        await _context.SaveChangesAsync();
    }
}

    public async Task<Listing?> GetByIdWithLockAsync(Guid id)
    {
        return await _context.Listings
            .Include(l => l.ProductDetails)
            .FirstOrDefaultAsync(l => l.Id == id);
    }
}