namespace Marketplace.Application.DTOs.Review;

public class ReviewDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid UserId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public bool IsVerifiedPurchase { get; set; }
    public DateTime CreatedAt { get; set; }
}