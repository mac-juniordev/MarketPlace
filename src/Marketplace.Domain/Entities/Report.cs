using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

// Represents a report submitted against marketplace content or users.
public class Report : BaseEntity, IAuditableEntity
{
    // ID of the user submitting the report.
    public Guid ReporterUserId { get; set; }

    // ID of the reported listing, if applicable.
    public Guid? ReportedListingId { get; set; }

    // ID of the reported business, if applicable.
    public Guid? ReportedBusinessId { get; set; }

    // ID of the reported user, if applicable.
    public Guid? ReportedUserId { get; set; }

    // Reason for the report.
    public string Reason { get; set; } = string.Empty;

    // Current report status.
    public ReportStatus Status { get; set; } = ReportStatus.Pending;

    // Optional notes added by an administrator.
    public string? AdminNotes { get; set; }

    // Date and time when the report was resolved.
    public DateTime? ResolvedAt { get; set; }

    // ID of the user who created this record.
    public Guid CreatedBy { get; set; }

    // ID of the user who last updated this record.
    public Guid? UpdatedBy { get; set; }

    // User who submitted the report.
    public User Reporter { get; set; } = null!;

    // Reported listing, if applicable.
    public Listing? ReportedListing { get; set; }

    // Reported business, if applicable.
    public Business? ReportedBusiness { get; set; }

    // Reported user, if applicable.
    public User? ReportedUser { get; set; }
}
