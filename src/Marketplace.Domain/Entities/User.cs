using Marketplace.Domain.Common;

namespace Marketplace.Domain.Entities;

// Represents a marketplace user.
public class User : BaseEntity, IAuditableEntity
{
    // User's email address.
    public string Email { get; set; } = string.Empty;

    // Securely hashed user password.
    public string PasswordHash { get; set; } = string.Empty;

    // User's first name.
    public string FirstName { get; set; } = string.Empty;

    // User's last name.
    public string LastName { get; set; } = string.Empty;

    // Optional phone number.
    public string? PhoneNumber { get; set; }

    // Optional profile avatar URL.
    public string? AvatarUrl { get; set; }

    // Indicates whether the phone is verified.
    public bool IsPhoneVerified { get; set; }

    // Indicates whether the email is verified.
    public bool IsEmailVerified { get; set; }

    // Indicates whether the account is active.
    public bool IsActive { get; set; } = true;

    // Records the user's last login time.
    public DateTime? LastLoginAt { get; set; }

    // ID of the user who created this record.
    public Guid CreatedBy { get; set; }

    // ID of the user who last updated this record.
    public Guid? UpdatedBy { get; set; }

    // Roles assigned to the user.
    public ICollection<UserRole> Roles { get; set; } = new List<UserRole>();

    // Businesses owned or managed by the user.
    public ICollection<Business> Businesses { get; set; } = new List<Business>();

    // Reservations made by the user.
    public ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();

    // Reviews submitted by the user.
    public ICollection<Review> Reviews { get; set; } = new List<Review>();

    // Notifications received by the user.
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
