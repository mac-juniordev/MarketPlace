using Marketplace.Domain.Common;
using Marketplace.Domain.Enums;

namespace Marketplace.Domain.Entities;

// Represents a notification sent to a user.
public class Notification : BaseEntity
{
    // ID of the receiving user.
    public Guid UserId { get; set; }

    // Notification title.
    public string Title { get; set; } = string.Empty;

    // Notification message.
    public string Message { get; set; } = string.Empty;

    // Type of notification.
    public NotificationType Type { get; set; }

    // Indicates whether the notification has been read.
    public bool IsRead { get; set; }

    // Date and time when the notification was read.
    public DateTime? ReadAt { get; set; }

    // User receiving the notification.
    public User User { get; set; } = null!;
}
