// Import entities from Domain
using Marketplace.Domain.Entities;
// Import DbContext
using Marketplace.Infrastructure.Data;
// Import EF Core
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Seed;

// Static class: seeds initial data into the database
public static class DatabaseSeeder
{
    // Seed the database with initial data
    public static async Task SeedAsync(MarketplaceDbContext context)
    {
        // Check if database is relational (PostgreSQL)
        // InMemory databases do not support migrations
        if (context.Database.IsRelational())
        {
            // Apply pending migrations
            await context.Database.MigrateAsync();
        }

        // Seed roles if none exist
        if (!await context.Roles.AnyAsync())
        {
            var roles = new List<Role>
            {
                new Role { Name = "Customer", Description = "Regular buyer" },
                new Role { Name = "Seller", Description = "Business owner" },
                new Role { Name = "Admin", Description = "Platform administrator" },
                new Role { Name = "SuperAdmin", Description = "Platform super administrator" }
            };

            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        // Seed categories if none exist
        if (!await context.Categories.AnyAsync())
        {
            var categories = new List<Category>
            {
                new Category { Name = "Clothes", Slug = "clothes", Description = "Clothing and fashion" },
                new Category { Name = "Shoes", Slug = "shoes", Description = "Footwear" },
                new Category { Name = "Perfumes", Slug = "perfumes", Description = "Fragrances" },
                new Category { Name = "Cosmetics", Slug = "cosmetics", Description = "Beauty products" },
                new Category { Name = "Electronics", Slug = "electronics", Description = "Phones, computers, gadgets" },
                new Category { Name = "Food", Slug = "food", Description = "Food and groceries" },
                new Category { Name = "Furniture", Slug = "furniture", Description = "Home and office furniture" },
                new Category { Name = "Vehicles", Slug = "vehicles", Description = "Cars, motorcycles, trucks" },
                new Category { Name = "Properties", Slug = "properties", Description = "Houses, apartments, land" },
                new Category { Name = "Services", Slug = "services", Description = "Professional services" }
            };

            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }

        // Seed superadmin if none exists
        var superadminExists = await context.Users.AnyAsync(u => u.Email == "admin@marketplace.com");

        if (!superadminExists)
        {
            // Create superadmin user
            var superadmin = new User
            {
                Email = "admin@marketplace.com",
                PasswordHash = HashPassword("MarketMaster!"),
                FirstName = "Super",
                LastName = "Admin",
                IsEmailVerified = true,
                IsPhoneVerified = true,
                IsActive = true,
                CreatedBy = Guid.NewGuid()
            };

            await context.Users.AddAsync(superadmin);
            await context.SaveChangesAsync();

            // Assign SuperAdmin role
            var superadminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "SuperAdmin");

            if (superadminRole != null)
            {
                var userRole = new UserRole
                {
                    UserId = superadmin.Id,
                    RoleId = superadminRole.Id
                };

                await context.UserRoles.AddAsync(userRole);
                await context.SaveChangesAsync();
            }
        }
    }

    // Hash password using PBKDF2
    private static string HashPassword(string password)
    {
        // Generate random salt
        byte[] salt = System.Security.Cryptography.RandomNumberGenerator.GetBytes(16);

        // Hash password with salt
        byte[] hash = System.Security.Cryptography.Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            100000,
            System.Security.Cryptography.HashAlgorithmName.SHA256,
            32
        );

        // Return salt and hash combined
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }
}