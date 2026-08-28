using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Links a role to a specific permission.
public class RolePermission : BaseEntity
{
    // ID of the associated role.
    public Guid RoleId { get; set; }

    // ID of the associated permission.
    public Guid PermissionId { get; set; }

    // Associated role.
    public Role Role { get; set; } = null!;

    // Associated permission.
    public Permission Permission { get; set; } = null!;
}
