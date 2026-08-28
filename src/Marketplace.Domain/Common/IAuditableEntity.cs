namespace Marketplace.Domain.Common;

public interface IAuditableEntity
{
    Guid CreatedBy { get; set; }
    Guid? UpdatedBy { get; set; }
}