using Marketplace.Domain.Enums;
using Marketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Api.Jobs;

// Job class: processes expired reservations
public class ReservationExpiryJob
{
    // Database context
    private readonly MarketplaceDbContext _dbContext;

    // Constructor injection
    public ReservationExpiryJob(MarketplaceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // This method runs on a schedule
    public async Task ProcessExpiredReservationsAsync()
    {
        // Find expired reservations
        var expiredReservations = await _dbContext.Reservations
            .Where(r => r.Status == ReservationStatus.Active &&
                        r.ExpiresAt <= DateTime.UtcNow)
            .ToListAsync();

        // Process each expired reservation
        foreach (var reservation in expiredReservations)
        {
            // Mark as expired
            reservation.Status = ReservationStatus.Expired;
            reservation.MarkUpdated();

            // Restore inventory
            var listing = await _dbContext.Listings
                .Include(l => l.ProductDetails)
                .FirstOrDefaultAsync(l => l.Id == reservation.ListingId);

            if (listing != null && listing.ProductDetails != null)
            {
                // Increment quantity
                listing.ProductDetails.AvailableQuantity += 1;

                // Restore availability
                if (listing.Status == ListingStatus.Reserved)
                {
                    listing.Status = ListingStatus.Active;
                    listing.IsAvailable = true;
                }

                listing.MarkUpdated();
            }
        }

        // Save all changes
        await _dbContext.SaveChangesAsync();
    }
}