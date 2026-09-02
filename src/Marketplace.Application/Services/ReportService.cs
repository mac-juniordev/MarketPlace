// Import DTOs
using Marketplace.Application.DTOs.Report;
// Import exceptions
using Marketplace.Application.Exceptions;
// Import interfaces
using Marketplace.Application.Interfaces;
// Import entities
using Marketplace.Domain.Entities;
// Import enums
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Services;

// Service for report operations
public class ReportService
{
    private readonly IReportRepository _reportRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;

    public ReportService(
        IReportRepository reportRepository,
        INotificationRepository notificationRepository,
        IUserRepository userRepository)
    {
        _reportRepository = reportRepository;
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
    }

    // Create a report
    public async Task<ReportDto> CreateAsync(Guid reporterUserId, CreateReportRequest request)
    {
        // At least one target must be specified
        if (request.ReportedListingId == null &&
            request.ReportedBusinessId == null &&
            request.ReportedUserId == null)
            throw new ValidationException("Must report something");

        // Create report entity
        var report = new Report
        {
            ReporterUserId = reporterUserId,
            ReportedListingId = request.ReportedListingId,
            ReportedBusinessId = request.ReportedBusinessId,
            ReportedUserId = request.ReportedUserId,
            Reason = request.Reason.Trim(),
            ReporterName = request.ReporterName?.Trim(),
            ReporterPhone = request.ReporterPhone?.Trim(),
            ReporterEmail = request.ReporterEmail?.Trim(),
            Status = ReportStatus.Pending,
            CreatedBy = reporterUserId
        };

        var created = await _reportRepository.CreateAsync(report);

        // Notify all admins
        var admins = await _userRepository.GetAllAdminsAsync();
        foreach (var admin in admins)
        {
            var notification = new Notification
            {
                UserId = admin.Id,
                Title = "New Report",
                Message = $"A new report was submitted: {request.Reason}",
                Type = NotificationType.ReportResolved,
                IsRead = false
            };
            await _notificationRepository.CreateAsync(notification);
        }

        return MapToDto(created);
    }

    // Get pending reports
    public async Task<IEnumerable<ReportDto>> GetPendingAsync()
    {
        var reports = await _reportRepository.GetPendingAsync();
        return reports.Select(MapToDto);
    }

    // Resolve a report
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

    // Map entity to DTO
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