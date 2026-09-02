using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs.Reservation;

public class CreateReservationRequest
{
    [Required(ErrorMessage = "Listing ID is required")]
    public Guid ListingId { get; set; }

    public string? BuyerName { get; set; }
    public string? BuyerPhone { get; set; }
    public string? BuyerEmail { get; set; }
}