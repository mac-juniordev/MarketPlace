namespace Marketplace.Domain.Enums;

public enum NotificationType
{
    ReservationCreated = 1,
    ReservationExpired = 2,
    ReservationCancelled = 3,
    ListingSold = 4,
    NewReview = 5,
    ReportResolved = 6,
    AccountSuspended = 7,
    BusinessVerified = 8
}