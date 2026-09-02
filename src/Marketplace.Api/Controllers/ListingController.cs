// Import DTOs
using Marketplace.Application.DTOs.Listing;

// Import services
using Marketplace.Application.Services;

// Import entities
using Marketplace.Domain.Entities;

// Import enums
using Marketplace.Domain.Enums;

// Import authorization
using Microsoft.AspNetCore.Authorization;

// Import MVC
using Microsoft.AspNetCore.Mvc;

// Import EF Core
using Microsoft.EntityFrameworkCore;

// Import DbContext
using Marketplace.Infrastructure.Data;

// Import claims
using System.Security.Claims;

namespace Marketplace.Api.Controllers;

// Controller for listing endpoints
[ApiController]
[Route("api/listings")]
public class ListingController : ControllerBase
{
    // =========================================================
    // DEPENDENCIES
    // =========================================================

    private readonly ListingService _listingService;
    private readonly MarketplaceDbContext _context;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public ListingController(
        ListingService listingService,
        MarketplaceDbContext context)
    {
        _listingService = listingService;
        _context = context;
    }

    // =========================================================
    // GET ALL LISTINGS
    // GET /api/listings
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result =
            await _listingService.SearchAsync(
                string.Empty,
                1,
                50
            );

        return Ok(result);
    }

    // =========================================================
    // GET LISTING BY ID
    // GET /api/listings/{id}
    // =========================================================

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result =
            await _listingService.GetByIdAsync(id);

        return Ok(result);
    }

    // =========================================================
    // SEARCH LISTINGS
    // GET /api/listings/search
    // =========================================================

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result =
            await _listingService.SearchAsync(
                query,
                page,
                pageSize
            );

        return Ok(result);
    }

    // =========================================================
    // GET BY CATEGORY
    // GET /api/listings/category/{categoryId}
    // =========================================================

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetByCategory(
        Guid categoryId)
    {
        var result =
            await _listingService.GetByCategoryIdAsync(
                categoryId
            );

        return Ok(result);
    }

    // =========================================================
    // GET BY BUSINESS
    // GET /api/listings/business/{businessId}
    // =========================================================

    [HttpGet("business/{businessId}")]
    public async Task<IActionResult> GetByBusiness(
        Guid businessId)
    {
        var result =
            await _listingService.GetByBusinessIdAsync(
                businessId
            );

        return Ok(result);
    }

    // =========================================================
    // GET FEATURED
    // GET /api/listings/featured?count=10
    // =========================================================

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured(
        [FromQuery] int count = 10)
    {
        var result =
            await _listingService.GetFeaturedAsync(
                count
            );

        return Ok(result);
    }

    // =========================================================
    // GET HOT LISTINGS
    // GET /api/listings/hot?count=8
    // =========================================================

    [HttpGet("hot")]
    public async Task<IActionResult> GetHot(
        [FromQuery] int count = 8)
    {
        if (count < 1)
        {
            count = 8;
        }

        if (count > 50)
        {
            count = 50;
        }

        var hotListings = await _context.Listings
            .AsNoTracking()
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Include(l => l.Images)
            .Where(l =>
                l.IsAvailable &&
                l.Status == ListingStatus.Active
            )
            .OrderByDescending(l =>
                (l.ViewCount * 0.4) +
                (l.ReservationCount * 0.4) +
                (l.ShareCount * 0.2)
            )
            .ThenByDescending(l => l.CreatedAt)
            .Take(count)
            .Select(l => new
            {
                l.Id,
                l.Title,
                l.Description,
                l.Price,
                l.Currency,
                l.Type,
                l.Status,
                l.ViewCount,
                l.ReservationCount,
                l.ShareCount,
                l.IsAvailable,
                l.IsFeatured,
                l.BusinessId,
                l.CategoryId,
                l.CreatedAt,

                BusinessName = l.Business != null
                    ? l.Business.Name
                    : null,

                CategoryName = l.Category != null
                    ? l.Category.Name
                    : null,

                Images = l.Images
                    .Select(i => i.Url)
                    .ToList()
            })
            .ToListAsync();

        return Ok(hotListings);
    }

    // =========================================================
    // GET SELLER STATS
    // GET /api/listings/seller-stats
    // =========================================================

    [HttpGet("seller-stats")]
    [Authorize]
    public async Task<IActionResult> GetSellerStats()
    {
        var userId = GetUserId();

        // Find the seller's business
        var business = await _context.Businesses
            .AsNoTracking()
            .FirstOrDefaultAsync(
                b => b.OwnerId == userId
            );

        // Seller has no business yet
        if (business == null)
        {
            return Ok(new
            {
                totalListings = 0,
                activeListings = 0,
                totalReservations = 0,
                totalViews = 0,
                totalReviews = 0
            });
        }

        // Get seller listings
        var listings = await _context.Listings
            .AsNoTracking()
            .Where(l => l.BusinessId == business.Id)
            .Select(l => new
            {
                l.Id,
                l.IsAvailable,
                l.ViewCount
            })
            .ToListAsync();

        // No listings
        if (listings.Count == 0)
        {
            return Ok(new
            {
                totalListings = 0,
                activeListings = 0,
                totalReservations = 0,
                totalViews = 0,
                totalReviews = 0
            });
        }

        // Listing IDs belonging to this seller
        var listingIds = listings
            .Select(l => l.Id)
            .ToList();

        // Total reservations
        var totalReservations =
            await _context.Reservations
                .AsNoTracking()
                .CountAsync(r =>
                    listingIds.Contains(r.ListingId)
                );

        // Total reviews
        var totalReviews =
            await _context.Reviews
                .AsNoTracking()
                .CountAsync(r =>
                    listingIds.Contains(r.ListingId)
                );

        // Total views
        var totalViews =
            listings.Sum(l => l.ViewCount);

        // Active listings
        var activeListings =
            listings.Count(l => l.IsAvailable);

        return Ok(new
        {
            totalListings = listings.Count,
            activeListings,
            totalReservations,
            totalViews,
            totalReviews
        });
    }

    // =========================================================
    // CREATE LISTING
    // POST /api/listings
    // =========================================================

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(
        [FromBody] CreateListingRequest request)
    {
        var userId = GetUserId();

        var result =
            await _listingService.CreateAsync(
                userId,
                request
            );

        return Ok(result);
    }

    // =========================================================
    // UPDATE LISTING
    // PUT /api/listings/{id}
    // =========================================================

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateListingRequest request)
    {
        var userId = GetUserId();

        var result =
            await _listingService.UpdateAsync(
                id,
                userId,
                request
            );

        return Ok(result);
    }

    // =========================================================
    // DELETE LISTING
    // DELETE /api/listings/{id}
    // =========================================================

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();

        await _listingService.DeleteAsync(
            id,
            userId
        );

        return NoContent();
    }

    // =========================================================
    // GET USER ID FROM JWT
    // =========================================================

    private Guid GetUserId()
    {
        var userIdClaim =
            User.FindFirst(
                ClaimTypes.NameIdentifier
            )?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
        {
            throw new UnauthorizedAccessException(
                "User ID was not found in the authentication token."
            );
        }

        if (!Guid.TryParse(
                userIdClaim,
                out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid user ID in authentication token."
            );
        }

        return userId;
    }


    // GET /api/listings/business/{businessId}/catalogue
[HttpGet("business/{businessId}/catalogue")]
public async Task<IActionResult> GetBusinessCatalogue(Guid businessId)
{
    var business = await _context.Businesses
        .AsNoTracking()
        .FirstOrDefaultAsync(b => b.Id == businessId);

    if (business == null)
        return NotFound(new { message = "Business not found" });

    var listings = await _context.Listings
        .AsNoTracking()
        .Include(l => l.Category)
        .Include(l => l.Images)
        .Where(l => l.BusinessId == businessId && l.IsAvailable)
        .OrderByDescending(l => l.CreatedAt)
        .Select(l => new
        {
            l.Id,
            l.Title,
            l.Description,
            l.Price,
            l.Currency,
            l.Type,
            l.ViewCount,
            l.IsAvailable,
            l.CategoryId,
            l.CreatedAt,
            CategoryName = l.Category.Name,
            Images = l.Images.Select(i => i.Url).ToList(),
            City = l.City,
            Quarter = l.Quarter,
            HasFixedLocation = l.HasFixedLocation,
        })
        .ToListAsync();

    return Ok(new
    {
        business = new
        {
            business.Id,
            business.Name,
            business.Description,
            business.LogoUrl,
            business.PhoneNumber,
            business.Email,
            business.City,
            business.Country,
            business.IsVerified,
            business.CreatedAt,
        },
        listings
    });
}
}
