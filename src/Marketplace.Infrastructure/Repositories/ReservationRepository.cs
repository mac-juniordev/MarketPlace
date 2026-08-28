using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Marketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public class ReservationRepository : IReservationRepository
{
    private readonly MarketplaceDbContext _context;

    public ReservationRepository(MarketplaceDbContext context)
    {
        _context = context;
    }

    public async Task<Reservation?> GetByIdAsync(Guid id)
    {
        return await _context.Reservations
            .Include(r => r.Listing)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<Reservation>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Reservations
            .Include(r => r.Listing)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reservation>> GetByListingIdAsync(Guid listingId)
    {
        return await _context.Reservations
            .Where(r => r.ListingId == listingId)
            .ToListAsync();
    }

    public async Task<IEnumerable<Reservation>> GetActiveByListingIdAsync(Guid listingId)
    {
        return await _context.Reservations
            .Where(r => r.ListingId == listingId && 
                        r.Status == ReservationStatus.Active &&
                        r.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();
    }

    public async Task<Reservation> CreateAsync(Reservation reservation)
    {
        await _context.Reservations.AddAsync(reservation);
        await _context.SaveChangesAsync();
        return reservation;
    }

    public async Task UpdateAsync(Reservation reservation)
    {
        _context.Reservations.Update(reservation);
        await _context.SaveChangesAsync();
    }
}