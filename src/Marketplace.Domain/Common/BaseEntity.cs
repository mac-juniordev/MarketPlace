namespace Marketplace.Domain.Common;

public abstract class BaseEntity
{
    public Guid id {get; protected set;} = Guid.NewGuid();
    public DateTime? updatedAt {get; protected set;} = DateTime.UtcNow;
    public DateTime createdAt {get; protected set;} 
}