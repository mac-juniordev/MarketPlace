using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Marketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

public class ReportRepository : IReportRepository
{
    private readonly MarketplaceDbContext _context;

    public ReportRepository(MarketplaceDbContext context)
    {
        _context = context;
    }

    public async Task<Report?> GetByIdAsync(Guid id)
    {
        return await _context.Reports.FindAsync(id);
    }

    public async Task<IEnumerable<Report>> GetPendingAsync()
    {
        return await _context.Reports
            .Where(r => r.Status == ReportStatus.Pending)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
    }

    public async Task<Report> CreateAsync(Report report)
    {
        await _context.Reports.AddAsync(report);
        await _context.SaveChangesAsync();
        return report;
    }

    public async Task UpdateAsync(Report report)
    {
        _context.Reports.Update(report);
        await _context.SaveChangesAsync();
    }
}