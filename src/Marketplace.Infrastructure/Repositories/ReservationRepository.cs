// Import interfaces
using Marketplace.Application.Interfaces;
// Import entities
using Marketplace.Domain.Entities;
// Import enums
using Marketplace.Domain.Enums;
// Import DbContext
using Marketplace.Infrastructure.Data;
// Import EF Core
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

// Class: implements IReservationRepository
public class ReservationRepository : IReservationRepository
{
    // Database context
    private readonly MarketplaceDbContext _context;

    // Constructor injection
    public ReservationRepository(MarketplaceDbContext context)
    {
        _context = context;
    }

    // Get reservation by ID with related data
    public async Task<Reservation?> GetByIdAsync(Guid id)
    {
        return await _context.Reservations
            .Include(r => r.Listing)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    // Get all reservations for a user
    public async Task<IEnumerable<Reservation>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Reservations
            .Include(r => r.Listing)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    // Get all reservations for a listing
    public async Task<IEnumerable<Reservation>> GetByListingIdAsync(Guid listingId)
    {
        return await _context.Reservations
            .Where(r => r.ListingId == listingId)
            .ToListAsync();
    }

    // Get active reservations for a listing
    public async Task<IEnumerable<Reservation>> GetActiveByListingIdAsync(Guid listingId)
    {
        return await _context.Reservations
            .Where(r => r.ListingId == listingId &&
                        r.Status == ReservationStatus.Active &&
                        r.ExpiresAt > DateTime.UtcNow)
            .ToListAsync();
    }

    // Create new reservation
    public async Task<Reservation> CreateAsync(Reservation reservation)
    {
        await _context.Reservations.AddAsync(reservation);
        await _context.SaveChangesAsync();
        return reservation;
    }

    // Update reservation
    public async Task UpdateAsync(Reservation reservation)
    {
        _context.Reservations.Update(reservation);
        await _context.SaveChangesAsync();
    }

    // Check if user has active reservation for a listing
    public async Task<bool> HasActiveReservationAsync(Guid listingId, Guid userId)
    {
        return await _context.Reservations.AnyAsync(r =>
            r.ListingId == listingId &&
            r.UserId == userId &&
            r.Status == ReservationStatus.Active &&
            r.ExpiresAt > DateTime.UtcNow);
    }

    // Create reservation with concurrency control
    // This is where the transaction and row locking happens
    public async Task<Reservation> CreateWithLockAsync(Guid userId, Guid listingId)
    {
        // Start a database transaction
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // Lock the listing row using FOR UPDATE
            // This blocks other transactions from modifying this row
            // until we commit or rollback
            await _context.Database.ExecuteSqlRawAsync(
                "SELECT 1 FROM \"Listings\" WHERE \"Id\" = {0} FOR UPDATE",
                listingId);

            // Now read the listing with product details
            // We read AFTER locking to ensure we get current data
            var listing = await _context.Listings
                .Include(l => l.ProductDetails)
                .FirstOrDefaultAsync(l => l.Id == listingId);

            // If listing not found, throw
            if (listing == null)
                throw new InvalidOperationException("Listing not found");

            // Check if listing is available
            if (!listing.IsAvailable)
                throw new InvalidOperationException("Listing is not available");

            // Check if listing is a product
            if (listing.Type != ListingType.Product)
                throw new InvalidOperationException("Only products can be reserved");

            // Check if product details exist
            if (listing.ProductDetails == null)
                throw new InvalidOperationException("Product details not found");

            // Check if reservable
            if (!listing.ProductDetails.IsReservable)
                throw new InvalidOperationException("This product cannot be reserved");

            // Check available quantity
            if (listing.ProductDetails.AvailableQuantity < 1)
                throw new InvalidOperationException("Out of stock");

            // Check if user already has active reservation
            var hasActive = await HasActiveReservationAsync(listing.Id, userId);

            if (hasActive)
                throw new InvalidOperationException("You already have an active reservation for this item");

            // Decrement quantity
            listing.ProductDetails.AvailableQuantity -= 1;

            // If quantity is 0, mark as reserved
            if (listing.ProductDetails.AvailableQuantity == 0)
            {
                listing.Status = ListingStatus.Reserved;
                listing.IsAvailable = false;
            }

            // Increment reservation count
            listing.ReservationCount += 1;

            // Create reservation
            var reservation = new Reservation
            {
                ListingId = listing.Id,
                UserId = userId,
                Status = ReservationStatus.Active,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                CreatedBy = userId
            };

            // Save reservation
            await _context.Reservations.AddAsync(reservation);
            await _context.SaveChangesAsync();

            // Commit transaction
            await transaction.CommitAsync();

            // Return reservation
            return reservation;
        }
        catch
        {
            // Rollback all changes if anything fails
            await transaction.RollbackAsync();
            throw;
        }
    }
}