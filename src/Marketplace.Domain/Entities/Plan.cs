using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Plan : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public PlanType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "XAF";
    public int DurationDays { get; set; }
    public int MaxListings { get; set; }
    public int MaxStaff { get; set; }
    public bool IncludesAnalytics { get; set; }
    public bool IncludesPromotion { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
}