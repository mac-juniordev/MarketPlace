// Import DTOs
using Marketplace.Application.DTOs.Business;
using Marketplace.Application.DTOs.User;
// Import exceptions
using Marketplace.Application.Exceptions;
// Import interfaces
using Marketplace.Application.Interfaces;
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

namespace Marketplace.Api.Controllers;

// API controller for admin operations
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
            activeSellers = await sellerUsers.Where(u => u.IsActive).CountAsync();
        }

        var totalListings = await _context.Listings.CountAsync();
        var activeListings = await _context.Listings.CountAsync(l => l.IsAvailable);
        var activeReservations = await _context.Reservations
            .CountAsync(r => r.Status == ReservationStatus.Active && r.ExpiresAt > DateTime.UtcNow);
        var totalReservations = await _context.Reservations.CountAsync();
        var totalBusinesses = await _context.Businesses.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var pendingReports = await _context.Reports.CountAsync(r => r.Status == ReportStatus.Pending);

        var listingsByCategory = await _context.Listings
            .AsNoTracking()
            .GroupBy(l => l.Category.Name)
            .Select(g => new { name = g.Key, value = g.Count() })
            .OrderByDescending(x => x.value)
            .ToListAsync();

        var listingsByType = await _context.Listings
            .AsNoTracking()
            .GroupBy(l => l.Type)
            .Select(g => new { name = g.Key.ToString(), value = g.Count() })
            .OrderByDescending(x => x.value)
            .ToListAsync();

        var recentSellers = new List<object>();

        if (sellerRole != null)
        {
            recentSellers = await _context.UserRoles
                .Where(ur => ur.RoleId == sellerRole.Id)
                .Join(_context.Users, ur => ur.UserId, u => u.Id, (_, u) => u)
                .OrderByDescending(u => u.CreatedAt)
                .Take(5)
                .Select(u => (object)new { u.Id, u.Email, u.FirstName, u.LastName, u.CreatedAt })
                .ToListAsync();
        }

        var recentListings = await _context.Listings
            .AsNoTracking()
            .OrderByDescending(l => l.CreatedAt)
            .Take(5)
            .Select(l => new { l.Id, l.Title, l.Price, l.CreatedAt, BusinessName = l.Business.Name })
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
            return Ok(new List<SellerListDto>());

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

        var result = users.Select(user =>
        {
            var business = businesses.FirstOrDefault(b => b.OwnerId == user.Id);

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
        }).ToList();

        return Ok(result);
    }

    // ============================================================
    // CREATE SELLER
    // ============================================================

    [HttpPost("sellers")]
    public async Task<IActionResult> CreateSeller([FromBody] CreateSellerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password) ||
            string.IsNullOrWhiteSpace(request.FirstName) ||
            string.IsNullOrWhiteSpace(request.LastName) ||
            string.IsNullOrWhiteSpace(request.BusinessName))
        {
            throw new ValidationException("All required fields must be provided.");
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        if (await _userRepository.ExistsAsync(normalizedEmail))
            throw new ValidationException("Email address is already registered.");

        var user = new User
        {
            Email = normalizedEmail,
            PasswordHash = _passwordHasher.Hash(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            PhoneNumber = string.IsNullOrWhiteSpace(request.PhoneNumber) ? null : request.PhoneNumber.Trim(),
            AvatarUrl = string.IsNullOrWhiteSpace(request.AvatarUrl) ? null : request.AvatarUrl.Trim(),
            IsEmailVerified = true,
            IsPhoneVerified = false,
            IsActive = true,
            CreatedBy = GetCurrentAdminId()
        };

        await _userRepository.CreateAsync(user);

        var sellerRole = await _context.Roles
            .FirstOrDefaultAsync(r => r.Name == "Seller");

        if (sellerRole == null)
            return BadRequest(new { message = "Seller role has not been configured." });

        await _context.UserRoles.AddAsync(new UserRole
        {
            UserId = user.Id,
            RoleId = sellerRole.Id
        });

        await _context.SaveChangesAsync();

        var business = new Business
        {
            Name = request.BusinessName.Trim(),
            Description = string.IsNullOrWhiteSpace(request.BusinessDescription)
                ? string.Empty
                : request.BusinessDescription.Trim(),
            OwnerId = user.Id,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            LogoUrl = string.IsNullOrWhiteSpace(request.LogoUrl) ? null : request.LogoUrl.Trim(),
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
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "Seller not found." });

        user.IsActive = !user.IsActive;
        user.MarkUpdated();

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = user.IsActive ? "Seller activated." : "Seller suspended.",
            isActive = user.IsActive
        });
    }

    // ============================================================
    // DELETE
    // ============================================================

    [HttpDelete("sellers/{id}")]
    public async Task<IActionResult> DeleteSeller(Guid id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "Seller not found." });

        // Find businesses owned by this seller
        var businesses = await _context.Businesses
            .Where(b => b.OwnerId == user.Id)
            .ToListAsync();

        foreach (var business in businesses)
        {
            // Find listings for this business
            var listings = await _context.Listings
                .Where(l => l.BusinessId == business.Id)
                .ToListAsync();

            foreach (var listing in listings)
            {
                var images = await _context.ListingImages
                    .Where(i => i.ListingId == listing.Id)
                    .ToListAsync();
                _context.ListingImages.RemoveRange(images);

                var productDetails = await _context.ProductDetails
                    .Where(p => p.ListingId == listing.Id)
                    .ToListAsync();
                _context.ProductDetails.RemoveRange(productDetails);

                var propertyDetails = await _context.PropertyDetails
                    .Where(p => p.ListingId == listing.Id)
                    .ToListAsync();
                _context.PropertyDetails.RemoveRange(propertyDetails);

                var vehicleDetails = await _context.VehicleDetails
                    .Where(v => v.ListingId == listing.Id)
                    .ToListAsync();
                _context.VehicleDetails.RemoveRange(vehicleDetails);

                var serviceDetails = await _context.ServiceDetails
                    .Where(s => s.ListingId == listing.Id)
                    .ToListAsync();
                _context.ServiceDetails.RemoveRange(serviceDetails);

                var reservations = await _context.Reservations
                    .Where(r => r.ListingId == listing.Id)
                    .ToListAsync();
                _context.Reservations.RemoveRange(reservations);

                var reviews = await _context.Reviews
                    .Where(r => r.ListingId == listing.Id)
                    .ToListAsync();
                _context.Reviews.RemoveRange(reviews);

                var reports = await _context.Reports
                    .Where(r => r.ReportedListingId == listing.Id)
                    .ToListAsync();
                _context.Reports.RemoveRange(reports);

                var promotions = await _context.Promotions
                    .Where(p => p.ListingId == listing.Id)
                    .ToListAsync();
                _context.Promotions.RemoveRange(promotions);

                _context.Listings.Remove(listing);
            }

            var businessReports = await _context.Reports
                .Where(r => r.ReportedBusinessId == business.Id)
                .ToListAsync();
            _context.Reports.RemoveRange(businessReports);

            var staff = await _context.BusinessStaff
                .Where(s => s.BusinessId == business.Id)
                .ToListAsync();
            _context.BusinessStaff.RemoveRange(staff);

            var subscriptions = await _context.Subscriptions
                .Where(s => s.BusinessId == business.Id)
                .ToListAsync();
            _context.Subscriptions.RemoveRange(subscriptions);

            var payments = await _context.Payments
                .Where(p => p.BusinessId == business.Id)
                .ToListAsync();
            _context.Payments.RemoveRange(payments);

            var transactions = await _context.Transactions
                .Where(t => t.BusinessId == business.Id)
                .ToListAsync();
            _context.Transactions.RemoveRange(transactions);

            var verificationRequests = await _context.VerificationRequests
                .Where(v => v.BusinessId == business.Id)
                .ToListAsync();
            _context.VerificationRequests.RemoveRange(verificationRequests);

            _context.Businesses.Remove(business);
        }

        var userReports = await _context.Reports
            .Where(r => r.ReportedUserId == user.Id || r.ReporterUserId == user.Id)
            .ToListAsync();
        _context.Reports.RemoveRange(userReports);

        var userRoles = await _context.UserRoles
            .Where(ur => ur.UserId == user.Id)
            .ToListAsync();
        _context.UserRoles.RemoveRange(userRoles);

        var notifications = await _context.Notifications
            .Where(n => n.UserId == user.Id)
            .ToListAsync();
        _context.Notifications.RemoveRange(notifications);

        var auditLogs = await _context.AuditLogs
            .Where(a => a.ActorUserId == user.Id)
            .ToListAsync();
        _context.AuditLogs.RemoveRange(auditLogs);

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        return Ok(new { message = "Seller deleted." });
    }

    // ============================================================
    // CURRENT ADMIN ID
    // ============================================================

    private Guid GetCurrentAdminId()
    {
        var claim =
            User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
            ?? User.FindFirst("sub");

        if (claim == null || !Guid.TryParse(claim.Value, out var adminId))
            throw new UnauthorizedAccessException("Unable to determine the current administrator.");

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