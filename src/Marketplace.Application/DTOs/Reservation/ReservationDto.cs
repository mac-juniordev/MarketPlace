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

    // Buyer contact information
    public string? BuyerName { get; set; }
    public string? BuyerPhone { get; set; }
    public string? BuyerEmail { get; set; }

    // Listing information
    public string? ListingTitle { get; set; }
}
