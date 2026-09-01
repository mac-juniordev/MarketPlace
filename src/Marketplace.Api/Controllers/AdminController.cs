using Marketplace.Application.DTOs.Business;
using Marketplace.Application.DTOs.User;
using Marketplace.Application.Exceptions;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;
using Marketplace.Infrastructure.Data;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "SuperAdmin")]
public class AdminController : ControllerBase
{
    private readonly MarketplaceDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IUserRepository _userRepository;
    private readonly IBusinessRepository _businessRepository;

    public AdminController(
        MarketplaceDbContext context,
        IPasswordHasher passwordHasher,
        IUserRepository userRepository,
        IBusinessRepository businessRepository)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _userRepository = userRepository;
        _businessRepository = businessRepository;
    }

    // ============================================================
    // DASHBOARD STATS
    // GET /api/admin/stats
    // ============================================================

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var sellerRole = await _context.Roles
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Name == "Seller");

        var totalSellers = 0;
        var activeSellers = 0;

        if (sellerRole != null)
        {
            var sellerUsers = _context.UserRoles
                .Where(ur => ur.RoleId == sellerRole.Id)
                .Join(
                    _context.Users,
                    ur => ur.UserId,
                    u => u.Id,
                    (_, u) => u
                );

            totalSellers = await sellerUsers.CountAsync();

            activeSellers = await sellerUsers
                .Where(u => u.IsActive)
                .CountAsync();
        }

        var totalListings = await _context.Listings
            .CountAsync();

        var activeListings = await _context.Listings
            .CountAsync(l => l.IsAvailable);

        var activeReservations = await _context.Reservations
            .CountAsync(r =>
                r.Status == ReservationStatus.Active &&
                r.ExpiresAt > DateTime.UtcNow);

        var totalReservations = await _context.Reservations
            .CountAsync();

        var totalBusinesses = await _context.Businesses
            .CountAsync();

        var totalUsers = await _context.Users
            .CountAsync();

        var pendingReports = await _context.Reports
            .CountAsync(r => r.Status == ReportStatus.Pending);

        // ========================================================
        // LISTINGS BY CATEGORY
        // ========================================================

        var listingsByCategory = await _context.Listings
            .AsNoTracking()
            .GroupBy(l => l.Category.Name)
            .Select(g => new
            {
                name = g.Key,
                value = g.Count()
            })
            .OrderByDescending(x => x.value)
            .ToListAsync();

        // ========================================================
        // LISTINGS BY TYPE
        // ========================================================

        var listingsByType = await _context.Listings
            .AsNoTracking()
            .GroupBy(l => l.Type)
            .Select(g => new
            {
                name = g.Key.ToString(),
                value = g.Count()
            })
            .OrderByDescending(x => x.value)
            .ToListAsync();

        // ========================================================
        // SELLERS CREATED PER MONTH
        // ========================================================

        var sellerGrowth = new List<SellerGrowthDto>();

        if (sellerRole != null)
        {
            var startDate = DateTime.UtcNow
                .Date
                .AddMonths(-11);

            sellerGrowth = await _context.UserRoles
                .Where(ur => ur.RoleId == sellerRole.Id)
                .Join(
                    _context.Users,
                    ur => ur.UserId,
                    u => u.Id,
                    (_, u) => u
                )
                .Where(u => u.CreatedAt >= startDate)
                .GroupBy(u => new
                {
                    u.CreatedAt.Year,
                    u.CreatedAt.Month
                })
                .Select(g => new SellerGrowthDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Count = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToListAsync();
        }

        // ========================================================
        // LISTINGS CREATED PER MONTH
        // ========================================================

        var listingGrowth = await _context.Listings
            .AsNoTracking()
            .Where(l => l.CreatedAt >= DateTime.UtcNow.Date.AddMonths(-11))
            .GroupBy(l => new
            {
                l.CreatedAt.Year,
                l.CreatedAt.Month
            })
            .Select(g => new GrowthDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Count = g.Count()
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();

        // ========================================================
        // RESERVATIONS CREATED PER MONTH
        // ========================================================

        var reservationGrowth = await _context.Reservations
            .AsNoTracking()
            .Where(r => r.CreatedAt >= DateTime.UtcNow.Date.AddMonths(-11))
            .GroupBy(r => new
            {
                r.CreatedAt.Year,
                r.CreatedAt.Month
            })
            .Select(g => new GrowthDto
            {
                Year = g.Key.Year,
                Month = g.Key.Month,
                Count = g.Count()
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.Month)
            .ToListAsync();

        // ========================================================
        // RECENT SELLERS
        // ========================================================

        var recentSellers = sellerRole == null
            ? new List<RecentSellerDto>()
            : await _context.UserRoles
                .Where(ur => ur.RoleId == sellerRole.Id)
                .Join(
                    _context.Users,
                    ur => ur.UserId,
                    u => u.Id,
                    (_, u) => u
                )
                .OrderByDescending(u => u.CreatedAt)
                .Take(5)
                .Select(u => new RecentSellerDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    AvatarUrl = u.AvatarUrl,
                    CreatedAt = u.CreatedAt
                })
                .ToListAsync();

        // ========================================================
        // RECENT LISTINGS
        // ========================================================

        var recentListings = await _context.Listings
            .AsNoTracking()
            .OrderByDescending(l => l.CreatedAt)
            .Take(5)
            .Select(l => new RecentListingDto
            {
                Id = l.Id,
                Title = l.Title,
                Price = l.Price,
                CreatedAt = l.CreatedAt,
                BusinessName = l.Business.Name
            })
            .ToListAsync();

        return Ok(new
        {
            totalSellers,
            activeSellers,

            totalListings,
            activeListings,

            activeReservations,
            totalReservations,

            totalBusinesses,
            totalUsers,
            pendingReports,

            listingsByCategory,
            listingsByType,

            sellerGrowth,
            listingGrowth,
            reservationGrowth,

            recentSellers,
            recentListings
        });
    }

    // ============================================================
    // GET SELLERS
    // ============================================================

    [HttpGet("sellers")]
    public async Task<IActionResult> GetSellers()
    {
        var sellerRole = await _context.Roles
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Name == "Seller");

        if (sellerRole == null)
        {
            return Ok(new List<SellerListDto>());
        }

        var sellerUserIds = await _context.UserRoles
            .Where(ur => ur.RoleId == sellerRole.Id)
            .Select(ur => ur.UserId)
            .ToListAsync();

        var users = await _context.Users
            .AsNoTracking()
            .Where(u => sellerUserIds.Contains(u.Id))
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FirstName,
                u.LastName,
                u.PhoneNumber,
                u.AvatarUrl,
                u.IsActive,
                u.CreatedAt
            })
            .ToListAsync();

        var businesses = await _context.Businesses
            .AsNoTracking()
            .Where(b => sellerUserIds.Contains(b.OwnerId))
            .Select(b => new
            {
                b.Id,
                b.Name,
                b.Description,
                b.OwnerId,
                b.LogoUrl,
                b.IsVerified,
                b.IsActive
            })
            .ToListAsync();

        var result = users
            .Select(user =>
            {
                var business = businesses
                    .FirstOrDefault(b => b.OwnerId == user.Id);

                return new SellerListDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    AvatarUrl = user.AvatarUrl,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt,

                    BusinessId = business?.Id,
                    BusinessName = business?.Name,
                    BusinessDescription = business?.Description,
                    LogoUrl = business?.LogoUrl,
                    IsVerified = business?.IsVerified ?? false,
                    BusinessIsActive = business?.IsActive ?? false
                };
            })
            .ToList();

        return Ok(result);
    }

    // ============================================================
    // CREATE SELLER
    // ============================================================

    [HttpPost("sellers")]
    public async Task<IActionResult> CreateSeller(
        [FromBody] CreateSellerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            string.IsNullOrWhiteSpace(request.BusinessName))
        {
            throw new ValidationException(
                "All required fields must be provided."
            );
        }

        var normalizedEmail = request.Email
            .Trim()
            .ToLowerInvariant();

        if (await _userRepository.ExistsAsync(normalizedEmail))
        {
            throw new ValidationException(
                "Email address is already registered."
            );
        }

        var user = new User
        {
            Email = normalizedEmail,

            PasswordHash = _passwordHasher.Hash(
                request.Password
            ),

            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),

            PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber)
                ? null
                : request.PhoneNumber.Trim(),

            AvatarUrl = string.IsNullOrWhiteSpace(request.AvatarUrl)
                ? null
                : request.AvatarUrl.Trim(),

            IsEmailVerified = true,
            IsPhoneVerified = false,
            IsActive = true,

            // IMPORTANT:
            // Do not use Guid.NewGuid() if CreatedBy is a
            // foreign key/reference to an actual user.
            //
            // If your User entity requires CreatedBy, use the
            // authenticated admin's ID instead.
            CreatedBy = GetCurrentAdminId()
        };

        await _userRepository.CreateAsync(user);

        var sellerRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Seller");

        if (sellerRole == null)
        {
            return BadRequest(new
            {
                message = "Seller role has not been configured."
            });
        }

        await _context.UserRoles.AddAsync(new UserRole
        {
            UserId = user.Id,
            RoleId = sellerRole.Id
        });

        await _context.SaveChangesAsync();

        var business = new Business
        {
            Name = request.BusinessName.Trim(),

            Description = string.IsNullOrWhiteSpace(
                request.BusinessDescription)
                ? string.Empty
                : request.BusinessDescription.Trim(),

            OwnerId = user.Id,

            LogoUrl = string.IsNullOrWhiteSpace(request.LogoUrl)
                ? null
                : request.LogoUrl.Trim(),

            IsVerified = false,
            IsActive = true,
            CreatedBy = user.Id
        };

        await _businessRepository.CreateAsync(business);

        return Ok(new SellerListDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt,

            BusinessId = business.Id,
            BusinessName = business.Name,
            BusinessDescription = business.Description,
            LogoUrl = business.LogoUrl,
            IsVerified = business.IsVerified,
            BusinessIsActive = business.IsActive
        });
    }

    // ============================================================
    // SUSPEND / ACTIVATE
    // ============================================================

    [HttpPost("sellers/{id}/suspend")]
    public async Task<IActionResult> SuspendSeller(Guid id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new
            {
                message = "Seller not found."
            });
        }

        user.IsActive = !user.IsActive;
        user.MarkUpdated();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = user.IsActive
                ? "Seller activated."
                : "Seller suspended.",

            isActive = user.IsActive
        });
    }

    // ============================================================
    // DELETE
    // ============================================================

    [HttpDelete("sellers/{id}")]
    public async Task<IActionResult> DeleteSeller(Guid id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new
            {
                message = "Seller not found."
            });
        }

        var sellerRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Seller");

        if (sellerRole != null)
        {
            var userRoles = await _context.UserRoles
                .Where(ur =>
                    ur.UserId == user.Id &&
                    ur.RoleId == sellerRole.Id)
                .ToListAsync();

            _context.UserRoles.RemoveRange(userRoles);
        }

        var businesses = await _context.Businesses
            .Where(b => b.OwnerId == user.Id)
            .ToListAsync();

        _context.Businesses.RemoveRange(businesses);

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Seller deleted."
        });
    }

    // ============================================================
    // CURRENT ADMIN ID
    // ============================================================

    private Guid GetCurrentAdminId()
    {
        var claim =
            User.FindFirst(
                System.Security.Claims.ClaimTypes.NameIdentifier
            )
            ?? User.FindFirst("sub");

        if (claim == null ||
            !Guid.TryParse(claim.Value, out var adminId))
        {
            throw new UnauthorizedAccessException(
                "Unable to determine the current administrator."
            );
        }

        return adminId;
    }
}

// ============================================================
// DTOs
// ============================================================

public class CreateSellerRequest
{
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string BusinessName { get; set; } = string.Empty;

    public string? BusinessDescription { get; set; }

    public string? AvatarUrl { get; set; }

    public string? LogoUrl { get; set; }
}

public class SellerListDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public string? AvatarUrl { get; set; }

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public Guid? BusinessId { get; set; }

    public string? BusinessName { get; set; }

    public string? BusinessDescription { get; set; }

    public string? LogoUrl { get; set; }

    public bool IsVerified { get; set; }

    public bool BusinessIsActive { get; set; }
}

public class RecentSellerDto
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string? AvatarUrl { get; set; }

    public DateTime CreatedAt { get; set; }
}

public class RecentListingDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public DateTime CreatedAt { get; set; }

    public string BusinessName { get; set; } = string.Empty;
}

public class GrowthDto
{
    public int Year { get; set; }

    public int Month { get; set; }

    public int Count { get; set; }
}

public class SellerGrowthDto
{
    public int Year { get; set; }

    public int Month { get; set; }

    public int Count { get; set; }
}
