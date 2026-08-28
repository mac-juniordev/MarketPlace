using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Links a user to a specific role.
public class UserRole : BaseEntity
{
    // ID of the associated user.
    public Guid UserId { get; set; }

    // ID of the associated role.
    public Guid RoleId { get; set; }

    // Associated user.
    public User User { get; set; } = null!;

    // Associated role.
    public Role Role { get; set; } = null!;
}
