using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IReservationRepository
{
    Task<Reservation?> GetByIdAsync(Guid id);
    Task<IEnumerable<Reservation>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Reservation>> GetByListingIdAsync(Guid listingId);
    Task<IEnumerable<Reservation>> GetActiveByListingIdAsync(Guid listingId);
    Task<Reservation> CreateAsync(Reservation reservation);
    Task UpdateAsync(Reservation reservation);
    Task<bool> HasActiveReservationAsync(Guid listingId, Guid userId);
    Task<Reservation> CreateWithLockAsync(Guid userId, Guid listingId);
}