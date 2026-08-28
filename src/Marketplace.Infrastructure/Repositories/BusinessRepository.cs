using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public class BusinessRepository : IBusinessRepository
{
    private readonly MarketplaceDbContext _context;

    public BusinessRepository(MarketplaceDbContext context)
    {
        _context = context;
    }

    public async Task<Business?> GetByIdAsync(Guid id)
    {
        return await _context.Businesses.FindAsync(id);
    }

    public async Task<IEnumerable<Business>> GetByOwnerIdAsync(Guid ownerId)
    {
        return await _context.Businesses
            .Where(b => b.OwnerId == ownerId)
            .ToListAsync();
    }

    public async Task<Business> CreateAsync(Business business)
    {
        await _context.Businesses.AddAsync(business);
        await _context.SaveChangesAsync();
        return business;
    }

    public async Task UpdateAsync(Business business)
    {
        _context.Businesses.Update(business);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var business = await _context.Businesses.FindAsync(id);
        if (business != null)
        {
            _context.Businesses.Remove(business);
            await _context.SaveChangesAsync();
        }
    }
}