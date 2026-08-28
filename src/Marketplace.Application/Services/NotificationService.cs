using Marketplace.Application.DTOs.Notification;
using Marketplace.Application.Exceptions;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Services;

public class NotificationService
{
    private readonly INotificationRepository _notificationRepository;

    public NotificationService(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<NotificationDto> CreateAsync(Guid userId, string title, string message, NotificationType type)
    {
        var notification = new Notification
        {
            UserId = userId,
            Title = title,
            Message = message,
            Type = type,
            IsRead = false
        };

        var created = await _notificationRepository.CreateAsync(notification);

        return MapToDto(created);
    }

    public async Task<IEnumerable<NotificationDto>> GetByUserIdAsync(Guid userId, bool unreadOnly = false)
    {
        var notifications = await _notificationRepository.GetByUserIdAsync(userId, unreadOnly);

        return notifications.Select(MapToDto);
    }

    public async Task MarkAsReadAsync(Guid notificationId, Guid userId)
    {
        var notification = await _notificationRepository.GetByIdAsync(notificationId);

        if (notification == null)
            throw new NotFoundException("Notification not found");

        if (notification.UserId != userId)
            throw new UnauthorizedException("Not your notification");

        notification.IsRead = true;
        notification.ReadAt = DateTime.UtcNow;

        await _notificationRepository.UpdateAsync(notification);
    }

    private NotificationDto MapToDto(Notification notification)
    {
        return new NotificationDto
        {
            Id = notification.Id,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
    }
}