using Marketplace.Domain.Enums;

namespace Marketplace.Application.DTOs.Reservation;

public class ReservationDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid UserId { get; set; }
    public ReservationStatus Status { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
}