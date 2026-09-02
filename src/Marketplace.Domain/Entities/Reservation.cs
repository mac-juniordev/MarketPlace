using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Reservation : BaseEntity, IAuditableEntity
{
    public Guid ListingId { get; set; }
    public Guid UserId { get; set; }

    public ReservationStatus Status { get; set; } = ReservationStatus.Active;

    public DateTime ExpiresAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? CancellationReason { get; set; }

    // Buyer contact info
    public string? BuyerName { get; set; }
    public string? BuyerPhone { get; set; }
    public string? BuyerEmail { get; set; }

    public Guid CreatedBy { get; set; }
    public Guid? UpdatedBy { get; set; }

    public Listing Listing { get; set; } = null!;
    public User User { get; set; } = null!;
}
