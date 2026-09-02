// Import validation
using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs.Report;

// Request DTO for creating a report
public class CreateReportRequest
{
    // Optional listing ID being reported
    public Guid? ReportedListingId { get; set; }

    // Optional business ID being reported
    public Guid? ReportedBusinessId { get; set; }

    // Optional user ID being reported
    public Guid? ReportedUserId { get; set; }

    // Reason is required
    [Required(ErrorMessage = "Reason is required")]
    [MaxLength(500, ErrorMessage = "Reason cannot exceed 500 characters")]
    public string Reason { get; set; } = string.Empty;

    // Reporter contact info for anonymous customers
    public string? ReporterName { get; set; }
    public string? ReporterPhone { get; set; }
    public string? ReporterEmail { get; set; }
}