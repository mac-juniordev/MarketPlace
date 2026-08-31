// Import data annotations
using System.ComponentModel.DataAnnotations;

namespace Marketplace.Application.DTOs.Review;

// Request DTO for creating a review
public class CreateReviewRequest
{
    // Listing ID is required
    [Required(ErrorMessage = "Listing ID is required")]
    public Guid ListingId { get; set; }

    // Rating must be between 1 and 5
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }

    // Comment is optional
    [MaxLength(1000, ErrorMessage = "Comment cannot exceed 1000 characters")]
    public string? Comment { get; set; }
}