namespace Marketplace.Domain.Common;

// Base class for all entities
public abstract class BaseEntity
{
    // Constructor: generates a new ID by default
    protected BaseEntity()
    {
        Id = Guid.NewGuid();
    }

    // Constructor: allows setting ID explicitly (for tests)
    protected BaseEntity(Guid id)
    {
        Id = id;
    }

    // Unique identifier for the entity
    public Guid Id { get; protected set; }

    // When the entity was created
    public DateTime CreatedAt { get; protected set; } = DateTime.UtcNow;

    // When the entity was last updated
    public DateTime? UpdatedAt { get; protected set; }

    // Mark the entity as updated
    public void MarkUpdated()
    {
        UpdatedAt = DateTime.UtcNow;
    }
}