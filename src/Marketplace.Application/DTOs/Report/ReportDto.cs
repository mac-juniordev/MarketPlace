using Marketplace.Domain.Enums;

namespace Marketplace.Application.DTOs.Report;

public class ReportDto
{
    public Guid Id { get; set; }
    public Guid ReporterUserId { get; set; }
    public string Reason { get; set; } = string.Empty;
    public ReportStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
}