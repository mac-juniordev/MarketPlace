using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class Payment : BaseEntity
{
    public Guid BusinessId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "XAF";
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? PaymentProvider { get; set; }
    public string? PaymentReference { get; set; }
    public DateTime? PaidAt { get; set; }

    public Business Business { get; set; } = null!;
}