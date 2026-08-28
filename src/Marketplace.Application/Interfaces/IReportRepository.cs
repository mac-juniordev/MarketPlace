using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IReportRepository
{
    Task<Report?> GetByIdAsync(Guid id);
    Task<IEnumerable<Report>> GetPendingAsync();
    Task<Report> CreateAsync(Report report);
    Task UpdateAsync(Report report);
}