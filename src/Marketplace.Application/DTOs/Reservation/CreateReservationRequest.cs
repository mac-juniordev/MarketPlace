// Import data annotations
using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs.Reservation;

// Request DTO for creating a reservation
public class CreateReservationRequest
{
    // Listing ID is required
    [Required(ErrorMessage = "Listing ID is required")]
    public Guid ListingId { get; set; }
}