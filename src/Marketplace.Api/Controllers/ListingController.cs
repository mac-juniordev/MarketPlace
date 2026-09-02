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
    // Dependencies
    private readonly ListingService _listingService;
    private readonly MarketplaceDbContext _context;

    // Constructor injection
    public ListingController(
        ListingService listingService,
        MarketplaceDbContext context)
    {
        _listingService = listingService;
        _context = context;
    }

    // GET /api/listings
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _listingService.SearchAsync(string.Empty, 1, 50);
        return Ok(result);
    }

    // GET /api/listings/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _listingService.GetByIdAsync(id);
        return Ok(result);
    }

    // GET /api/listings/search?query=shoes&page=1&pageSize=20
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string query, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _listingService.SearchAsync(query, page, pageSize);
        return Ok(result);
    }

    // GET /api/listings/category/{categoryId}
    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetByCategory(Guid categoryId)
    {
        var result = await _listingService.GetByCategoryIdAsync(categoryId);
        return Ok(result);
    }

    // GET /api/listings/business/{businessId}
    [HttpGet("business/{businessId}")]
    public async Task<IActionResult> GetByBusiness(Guid businessId)
    {
        var result = await _listingService.GetByBusinessIdAsync(businessId);
        return Ok(result);
    }

    // GET /api/listings/featured?count=10
    [HttpGet("featured")]
    public async Task<IActionResult> GetFeatured([FromQuery] int count = 10)
    {
        var result = await _listingService.GetFeaturedAsync(count);
        return Ok(result);
    }

    // GET /api/listings/hot?count=8
    // Algorithmic ranking based on views, reservations, and shares
    [HttpGet("hot")]
    public async Task<IActionResult> GetHot([FromQuery] int count = 8)
    {
        // Query listings with hot score calculation
        var hotListings = await _context.Listings
            .Include(l => l.Business)
            .Include(l => l.Category)
            .Include(l => l.Images)
            .Where(l => l.IsAvailable && l.Status == ListingStatus.Active)
            .OrderByDescending(l =>
                (l.ViewCount * 0.4) +
                (l.ReservationCount * 0.4) +
                (l.ShareCount * 0.2))
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
                BusinessName = l.Business.Name,
                CategoryName = l.Category.Name,
                Images = l.Images.Select(i => i.Url).ToList(),
            })
            .ToListAsync();

        return Ok(hotListings);
    }

    // POST /api/listings
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateListingRequest request)
    {
        var userId = GetUserId();
        var result = await _listingService.CreateAsync(userId, request);
        return Ok(result);
    }

    // PUT /api/listings/{id}
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateListingRequest request)
    {
        var userId = GetUserId();
        var result = await _listingService.UpdateAsync(id, userId, request);
        return Ok(result);
    }

    // DELETE /api/listings/{id}
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        await _listingService.DeleteAsync(id, userId);
        return NoContent();
    }

    // Helper: Get user ID from JWT
    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }
}