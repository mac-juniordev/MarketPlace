using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Subscription : BaseEntity
{
    public Guid BusinessId { get; set; }
    public Guid PlanId { get; set; }
    public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Pending;
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }

    public Business Business { get; set; } = null!;
    public Plan Plan { get; set; } = null!;
}