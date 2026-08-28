using Marketplace.Application.DTOs.Report;
using Marketplace.Application.Exceptions;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Services;

public class ReportService
{
    private readonly IReportRepository _reportRepository;

    public ReportService(IReportRepository reportRepository)
    {
        _reportRepository = reportRepository;
    }

    public async Task<ReportDto> CreateAsync(Guid reporterUserId, CreateReportRequest request)
    {
        // At least one target must be specified
        if (request.ReportedListingId == null && 
            request.ReportedBusinessId == null && 
            request.ReportedUserId == null)
            throw new ValidationException("Must report something");

        var report = new Report
        {
            ReporterUserId = reporterUserId,
            ReportedListingId = request.ReportedListingId,
            ReportedBusinessId = request.ReportedBusinessId,
            ReportedUserId = request.ReportedUserId,
            Reason = request.Reason.Trim(),
            Status = ReportStatus.Pending,
            CreatedBy = reporterUserId
        };

        var created = await _reportRepository.CreateAsync(report);

        return MapToDto(created);
    }

    public async Task<IEnumerable<ReportDto>> GetPendingAsync()
    {
        var reports = await _reportRepository.GetPendingAsync();

        return reports.Select(MapToDto);
    }

    public async Task<ReportDto> ResolveAsync(Guid reportId, ReportStatus status, string? adminNotes)
    {
        var report = await _reportRepository.GetByIdAsync(reportId);

        if (report == null)
            throw new NotFoundException("Report not found");

        report.Status = status;
        report.AdminNotes = adminNotes;
        report.ResolvedAt = DateTime.UtcNow;
        report.MarkUpdated();

        await _reportRepository.UpdateAsync(report);

        return MapToDto(report);
    }

    private ReportDto MapToDto(Report report)
    {
        return new ReportDto
        {
            Id = report.Id,
            ReporterUserId = report.ReporterUserId,
            Reason = report.Reason,
            Status = report.Status,
            CreatedAt = report.CreatedAt
        };
    }
}