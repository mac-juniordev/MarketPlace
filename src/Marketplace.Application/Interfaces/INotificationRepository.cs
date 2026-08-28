using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface INotificationRepository
{
    Task<Notification?> GetByIdAsync(Guid id);
    Task<IEnumerable<Notification>> GetByUserIdAsync(Guid userId, bool unreadOnly = false);
    Task<Notification> CreateAsync(Notification notification);
    Task UpdateAsync(Notification notification);
    Task MarkAsReadAsync(Guid id);
}