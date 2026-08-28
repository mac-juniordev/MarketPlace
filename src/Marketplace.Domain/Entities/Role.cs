using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Represents a role assigned to users.
public class Role : BaseEntity
{
    // Role name.
    public string Name { get; set; } = string.Empty;

    // Role description.
    public string Description { get; set; } = string.Empty;

    // Users assigned to this role.
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    // Permissions assigned to this role.
    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();

    public ICollection<User> Users { get; set; } = new List<User>();
    public ICollection<Permission> Permissions { get; set; } = new List<Permission>();
}
