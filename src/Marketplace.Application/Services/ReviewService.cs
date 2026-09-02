using Marketplace.Application.DTOs.Review;
using Marketplace.Application.Exceptions;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Services;

public class ReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IListingRepository _listingRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IUserRepository _userRepository;

    public ReviewService(
        IReviewRepository reviewRepository,
        IListingRepository listingRepository,
        INotificationRepository notificationRepository,
        IUserRepository userRepository)
    {
        _reviewRepository = reviewRepository;
        _listingRepository = listingRepository;
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
    }

    public async Task<ReviewDto> CreateAsync(Guid userId, CreateReviewRequest request)
    {
        if (request.Rating < 1 || request.Rating > 5)
            throw new ValidationException("Rating must be between 1 and 5");

        var listing = await _listingRepository.GetByIdAsync(request.ListingId);

        if (listing == null)
            throw new NotFoundException("Listing not found");

        var review = new Review
        {
            ListingId = request.ListingId,
            UserId = userId,
            Rating = request.Rating,
            Comment = request.Comment?.Trim(),
            IsVerifiedPurchase = false,
            CreatedBy = userId
        };

        var created = await _reviewRepository.CreateAsync(review);

        // Notify the business owner
        var ownerNotification = new Notification
        {
            UserId = listing.Business.OwnerId,
            Title = "New Review",
            Message = $"Your listing \"{listing.Title}\" received a {request.Rating}-star review.",
            Type = NotificationType.NewReview,
            IsRead = false
        };
        await _notificationRepository.CreateAsync(ownerNotification);

        // Notify all admins
        var admins = await _userRepository.GetAllAdminsAsync();
        foreach (var admin in admins)
        {
            var adminNotification = new Notification
            {
                UserId = admin.Id,
                Title = "New Review",
                Message = $"Listing \"{listing.Title}\" received a {request.Rating}-star review from a customer.",
                Type = NotificationType.NewReview,
                IsRead = false
            };
            await _notificationRepository.CreateAsync(adminNotification);
        }

        return MapToDto(created);
    }

    public async Task<IEnumerable<ReviewDto>> GetByListingIdAsync(Guid listingId)
    {
        var reviews = await _reviewRepository.GetByListingIdAsync(listingId);
        return reviews.Select(MapToDto);
    }

    public async Task<IEnumerable<ReviewDto>> GetByUserIdAsync(Guid userId)
    {
        var reviews = await _reviewRepository.GetByUserIdAsync(userId);
        return reviews.Select(MapToDto);
    }

    public async Task DeleteAsync(Guid reviewId, Guid userId)
    {
        var review = await _reviewRepository.GetByIdAsync(reviewId);

        if (review == null)
            throw new NotFoundException("Review not found");

        if (review.UserId != userId)
            throw new UnauthorizedException("Not your review");

        await _reviewRepository.DeleteAsync(reviewId);
    }

    private ReviewDto MapToDto(Review review)
    {
        return new ReviewDto
        {
            Id = review.Id,
            ListingId = review.ListingId,
            UserId = review.UserId,
            Rating = review.Rating,
            Comment = review.Comment,
            IsVerifiedPurchase = review.IsVerifiedPurchase,
            CreatedAt = review.CreatedAt
        };
    }
}