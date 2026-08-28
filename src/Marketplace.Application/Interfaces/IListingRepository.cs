using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IListingRepository
{
    Task<Listing?> GetByIdAsync(Guid id);
    Task<IEnumerable<Listing>> GetByBusinessIdAsync(Guid businessId);
    Task<IEnumerable<Listing>> GetByCategoryIdAsync(Guid categoryId);
    Task<IEnumerable<Listing>> SearchAsync(string query, int page, int pageSize);
    Task<IEnumerable<Listing>> GetFeaturedAsync(int count);
    Task<Listing> CreateAsync(Listing listing);
    Task UpdateAsync(Listing listing);
    Task DeleteAsync(Guid id);
}