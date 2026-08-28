using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IReviewRepository
{
    Task<Review?> GetByIdAsync(Guid id);
    Task<IEnumerable<Review>> GetByListingIdAsync(Guid listingId);
    Task<IEnumerable<Review>> GetByUserIdAsync(Guid userId);
    Task<Review> CreateAsync(Review review);
    Task UpdateAsync(Review review);
    Task DeleteAsync(Guid id);
}