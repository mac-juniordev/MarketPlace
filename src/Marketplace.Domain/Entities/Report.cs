// Import common
using Marketplace.Domain.Common;
// Import enums
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

// Report entity
public class Report : BaseEntity, IAuditableEntity
{
    // User who submitted the report
    public Guid ReporterUserId { get; set; }

    // Optional listing being reported
    public Guid? ReportedListingId { get; set; }

    // Optional business being reported
    public Guid? ReportedBusinessId { get; set; }

    // Optional user being reported
    public Guid? ReportedUserId { get; set; }

    // Reason for the report
    public string Reason { get; set; } = string.Empty;

    // Reporter contact info for anonymous customers
    public string? ReporterName { get; set; }
    public string? ReporterPhone { get; set; }
    public string? ReporterEmail { get; set; }

    // Report status
    public ReportStatus Status { get; set; } = ReportStatus.Pending;

    // Admin notes
    public string? AdminNotes { get; set; }

    // When the report was resolved
    public DateTime? ResolvedAt { get; set; }

    // Audit fields
    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    // Navigation properties
    public User Reporter { get; set; } = null!;
    public Listing? ReportedListing { get; set; }
    public Business? ReportedBusiness { get; set; }
    public User? ReportedUser { get; set; }
}