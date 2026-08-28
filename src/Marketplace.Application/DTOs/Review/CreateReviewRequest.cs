namespace Marketplace.Application.DTOs.Review;

public class CreateReviewRequest
{
    public Guid ListingId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
}