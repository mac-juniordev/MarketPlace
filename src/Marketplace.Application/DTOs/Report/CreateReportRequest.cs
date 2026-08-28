namespace Marketplace.Application.DTOs.Report;

public class CreateReportRequest
{
    public Guid? ReportedListingId { get; set; }
    public Guid? ReportedBusinessId { get; set; }
    public Guid? ReportedUserId { get; set; }
    public string Reason { get; set; } = string.Empty;
}