using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Represents a staff member assigned to a business.
public class BusinessStaff : BaseEntity, IAuditableEntity
{
    // ID of the associated business.
    public Guid BusinessId { get; set; }

    // ID of the assigned user.
    public Guid UserId { get; set; }

    // Staff role within the business.
    public string Role { get; set; } = "Staff";

    // Indicates whether the staff member is active.
    public bool IsActive { get; set; } = true;

    // ID of the user who created this record.
    public Guid CreatedBy { get; set; }

    // ID of the user who last updated this record.
    public Guid? UpdatedBy { get; set; }

    // Associated business.
    public Business Business { get; set; } = null!;

    // Associated user.
    public User User { get; set; } = null!;
}
