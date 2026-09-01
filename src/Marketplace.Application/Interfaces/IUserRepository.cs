// Import User entity
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

// Interface: defines contract for user data access
public interface IUserRepository
{
    // Get user by ID
    Task<User?> GetByIdAsync(Guid id);

    // Get user by email
    Task<User?> GetByEmailAsync(string email);

    // Create a new user
    Task<User> CreateAsync(User user);

    // Update user
    Task UpdateAsync(User user);

    // Delete user
    Task DeleteAsync(Guid id);

    // Check if email exists
    Task<bool> ExistsAsync(string email);

    // Get all role names for a user
    Task<IEnumerable<string>> GetUserRolesAsync(Guid userId);
}