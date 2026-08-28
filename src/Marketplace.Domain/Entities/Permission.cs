using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Represents a permission that can be assigned to roles.
public class Permission : BaseEntity
{
    // Permission name.
    public string Name { get; set; } = string.Empty;

    // Permission description.
    public string Description { get; set; } = string.Empty;

    // Roles assigned to this permission.
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
