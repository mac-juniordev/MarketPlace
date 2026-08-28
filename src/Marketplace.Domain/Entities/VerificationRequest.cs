using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

public class VerificationRequest : BaseEntity
{
    public Guid BusinessId { get; set; }
    public VerificationRequestStatus Status { get; set; } = VerificationRequestStatus.Pending;
    public string? DocumentsUrl { get; set; }
    public string? Notes { get; set; }
    public decimal AmountPaid { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public Guid? ReviewedBy { get; set; }

    public Business Business { get; set; } = null!;
}