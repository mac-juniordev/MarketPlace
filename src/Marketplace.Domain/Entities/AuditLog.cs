using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Records user actions performed within the system.
public class AuditLog : BaseEntity
{
    // ID of the user who performed the action.
    public Guid ActorUserId { get; set; }

    // Action that was performed.
    public string Action { get; set; } = string.Empty;

    // Type of entity affected by the action.
    public string TargetEntity { get; set; } = string.Empty;

    // ID of the affected entity, if applicable.
    public Guid? TargetEntityId { get; set; }

    // Optional reason for the action.
    public string? Reason { get; set; }

    // Optional additional action metadata.
    public string? Metadata { get; set; }

    // User who performed the action.
    public User Actor { get; set; } = null!;
}
