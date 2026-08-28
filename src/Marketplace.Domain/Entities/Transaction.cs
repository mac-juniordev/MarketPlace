using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

public class Transaction : BaseEntity
{
    public Guid BusinessId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "XAF";
    public string Type { get; set; } = string.Empty;
    public string? Reference { get; set; }
    public string? Description { get; set; }

    public Business Business { get; set; } = null!;
}