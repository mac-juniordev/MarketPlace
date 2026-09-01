// Import interfaces
using Marketplace.Application.Interfaces;
// Import entities
using Marketplace.Domain.Entities;
// Import DbContext
using Marketplace.Infrastructure.Data;
// Import EF Core
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Repositories;

// Class: implements IUserRepository using EF Core
public class UserRepository : IUserRepository
{
    // Database context
    private readonly MarketplaceDbContext _context;

    // Constructor injection
    public UserRepository(MarketplaceDbContext context)
    {
        _context = context;
    }

    // Get user by ID
    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users.FindAsync(id);
    }

    // Get user by email
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    // Create new user
    public async Task<User> CreateAsync(User user)
    {
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return user;
    }

    // Update user
    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    // Delete user
    public async Task DeleteAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }
    }

    // Check if email exists
    public async Task<bool> ExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    // Get all role names for a user
    public async Task<IEnumerable<string>> GetUserRolesAsync(Guid userId)
    {
        // Join UserRoles with Roles to get role names
        return await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Join(
                _context.Roles,
                ur => ur.RoleId,
                r => r.Id,
                (ur, r) => r.Name)
            .ToListAsync();
    }
}