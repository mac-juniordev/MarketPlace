// Import DTOs
using Marketplace.Application.DTOs.Listing;
// Import exceptions
using Marketplace.Application.Exceptions;
// Import interfaces
using Marketplace.Application.Interfaces;
// Import entities
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Services;

// Service for listing operations
public class ListingService
{
    private readonly IListingRepository _listingRepository;
    private readonly IBusinessRepository _businessRepository;
    private readonly ICategoryRepository _categoryRepository;

    public ListingService(
        IListingRepository listingRepository,
        IBusinessRepository businessRepository,
        ICategoryRepository categoryRepository)
    {
        _listingRepository = listingRepository;
        _businessRepository = businessRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<ListingDto> CreateAsync(Guid userId, CreateListingRequest request)
    {
        var business = await _businessRepository.GetByIdAsync(request.BusinessId);

        if (business == null)
            throw new NotFoundException("Business not found");

        if (business.OwnerId != userId)
            throw new UnauthorizedException("Not the business owner");

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);

        if (category == null)
            throw new NotFoundException("Category not found");

        var listing = new Listing
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Price = request.Price,
            Type = request.Type,
            BusinessId = request.BusinessId,
            CategoryId = request.CategoryId,
            IsAvailable = true,
            CreatedBy = userId,
            City = request.City,
            Quarter = request.Quarter,
            Address = request.Address,
            HasFixedLocation = request.HasFixedLocation,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
        };

        if (request.Type == Domain.Enums.ListingType.Product)
        {
            listing.ProductDetails = new ProductDetails
            {
                AvailableQuantity = request.AvailableQuantity,
                IsReservable = request.IsReservable,
                ListingId = listing.Id
            };
        }

        if (request.Images != null && request.Images.Count > 0)
        {
            listing.Images = request.Images.Select(url => new ListingImage
            {
                Url = url,
                ListingId = listing.Id,
            }).ToList();
        }

        var created = await _listingRepository.CreateAsync(listing);

        return MapToDto(created);
    }

    public async Task<ListingDto> GetByIdAsync(Guid id)
    {
        var listing = await _listingRepository.GetByIdAsync(id);

        if (listing == null)
            throw new NotFoundException("Listing not found");

        return MapToDto(listing);
    }

    public async Task<IEnumerable<ListingDto>> GetByBusinessIdAsync(Guid businessId)
    {
        var listings = await _listingRepository.GetByBusinessIdAsync(businessId);
        return listings.Select(MapToDto);
    }

    public async Task<IEnumerable<ListingDto>> GetByCategoryIdAsync(Guid categoryId)
    {
        var listings = await _listingRepository.GetByCategoryIdAsync(categoryId);
        return listings.Select(MapToDto);
    }

    public async Task<IEnumerable<ListingDto>> SearchAsync(string query, int page = 1, int pageSize = 20)
    {
        var listings = await _listingRepository.SearchAsync(query, page, pageSize);
        return listings.Select(MapToDto);
    }

    public async Task<IEnumerable<ListingDto>> GetFeaturedAsync(int count = 10)
    {
        var listings = await _listingRepository.GetFeaturedAsync(count);
        return listings.Select(MapToDto);
    }

    public async Task<ListingDto> UpdateAsync(Guid listingId, Guid userId, UpdateListingRequest request)
    {
        var listing = await _listingRepository.GetByIdAsync(listingId);

        if (listing == null)
            throw new NotFoundException("Listing not found");

        var business = await _businessRepository.GetByIdAsync(listing.BusinessId);

        if (business == null || business.OwnerId != userId)
            throw new UnauthorizedException("Not the business owner");

        var category = await _categoryRepository.GetByIdAsync(request.CategoryId);

        if (category == null)
            throw new NotFoundException("Category not found");

        listing.Title = request.Title.Trim();
        listing.Description = request.Description.Trim();
        listing.Price = request.Price;
        listing.Status = request.Status;
        listing.CategoryId = request.CategoryId;
        listing.IsAvailable = request.IsAvailable;
        listing.UpdatedBy = userId;
        listing.MarkUpdated();

        await _listingRepository.UpdateAsync(listing);

        return MapToDto(listing);
    }

    public async Task DeleteAsync(Guid listingId, Guid userId)
    {
        var listing = await _listingRepository.GetByIdAsync(listingId);

        if (listing == null)
            throw new NotFoundException("Listing not found");

        var business = await _businessRepository.GetByIdAsync(listing.BusinessId);

        if (business == null || business.OwnerId != userId)
            throw new UnauthorizedException("Not the business owner");

        await _listingRepository.DeleteAsync(listingId);
    }

    private ListingDto MapToDto(Listing listing)
    {
        return new ListingDto
        {
            Id = listing.Id,
            Title = listing.Title,
            Description = listing.Description,
            Price = listing.Price,
            Currency = listing.Currency ?? "XAF",
            Type = listing.Type,
            Status = listing.Status,
            ViewCount = listing.ViewCount,
            ReservationCount = listing.ReservationCount,
            ShareCount = listing.ShareCount,
            IsAvailable = listing.IsAvailable,
            IsFeatured = listing.IsFeatured,
            BusinessId = listing.BusinessId,
            CategoryId = listing.CategoryId,
            BusinessName = listing.Business?.Name ?? string.Empty,
            CategoryName = listing.Category?.Name ?? string.Empty,
            Images = listing.Images?.Select(i => i.Url).ToList() ?? new List<string>(),
            City = listing.City,
            Quarter = listing.Quarter,
            Address = listing.Address,
            HasFixedLocation = listing.HasFixedLocation,
            Latitude = listing.Latitude,
            Longitude = listing.Longitude,
            CreatedAt = listing.CreatedAt
        };
    }
}