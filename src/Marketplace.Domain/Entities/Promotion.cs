using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Promotion : BaseEntity
{
    public Guid ListingId { get; set; }
    public Guid BusinessId { get; set; }
    public PromotionStatus Status { get; set; } = PromotionStatus.Active;
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
    public decimal AmountPaid { get; set; }

    public Listing Listing { get; set; } = null!;
    public Business Business { get; set; } = null!;
}