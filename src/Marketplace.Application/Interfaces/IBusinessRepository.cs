using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IBusinessRepository
{
    Task<Business?> GetByIdAsync(Guid id);
    Task<IEnumerable<Business>> GetByOwnerIdAsync(Guid ownerId);
    Task<Business> CreateAsync(Business business);
    Task UpdateAsync(Business business);
    Task DeleteAsync(Guid id);
}