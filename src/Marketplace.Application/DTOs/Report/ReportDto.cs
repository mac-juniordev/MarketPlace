// Import enums
using Marketplace.Domain.Enums;

namespace Marketplace.Application.DTOs.Report;

// DTO for report data
public class ReportDto
{
    public Guid Id { get; set; }
    public Guid ReporterUserId { get; set; }
    public Guid? ReportedListingId { get; set; }
    public Guid? ReportedBusinessId { get; set; }
    public Guid? ReportedUserId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string? ReporterName { get; set; }
    public string? ReporterPhone { get; set; }
    public string? ReporterEmail { get; set; }
    public ReportStatus Status { get; set; }
    public string? AdminNotes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
}