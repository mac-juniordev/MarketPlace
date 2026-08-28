using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

// Represents a user's reservation for a listing.
public class Reservation : BaseEntity, IAuditableEntity
{
    // ID of the reserved listing.
    public Guid ListingId { get; set; }

    // ID of the user making the reservation.
    public Guid UserId { get; set; }

    // Current reservation status.
    public ReservationStatus Status { get; set; } = ReservationStatus.Active;

    // Date and time when the reservation expires.
    public DateTime ExpiresAt { get; set; }

    // Date and time when the reservation was completed.
    public DateTime? CompletedAt { get; set; }

    // Date and time when the reservation was cancelled.
    public DateTime? CancelledAt { get; set; }

    // Reason for cancelling the reservation.
    public string? CancellationReason { get; set; }

    // ID of the user who created this record.
    public Guid CreatedBy { get; set; }

    // ID of the user who last updated this record.
    public Guid? UpdatedBy { get; set; }

    // Associated listing.
    public Listing Listing { get; set; } = null!;

    // User who made the reservation.
    public User User { get; set; } = null!;
}
