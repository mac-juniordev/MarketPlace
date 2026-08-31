// Import entities from Domain
using Marketplace.Domain.Entities;
// Import enums
using Marketplace.Domain.Enums;
// Import DbContext
using Marketplace.Infrastructure.Data;
// Import EF Core
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Seed;

// Static class: cannot be instantiated, only holds methods
public static class DatabaseSeeder
{
    // Method to seed the database
    // Takes the DbContext as parameter
    public static async Task SeedAsync(MarketplaceDbContext context)
    {
        // Apply any pending migrations first
        await context.Database.MigrateAsync();

        // Seed roles if none exist
        if (!await context.Roles.AnyAsync())
        {
            // Create roles
            var roles = new List<Role>
            {
                new Role { Name = "Customer", Description = "Regular buyer" },
                new Role { Name = "Seller", Description = "Business owner" },
                new Role { Name = "Admin", Description = "Platform administrator" },
                new Role { Name = "SuperAdmin", Description = "Platform super administrator" }
            };

            // Add all roles to database
            await context.Roles.AddRangeAsync(roles);
            await context.SaveChangesAsync();
        }

        // Seed categories if none exist
        if (!await context.Categories.AnyAsync())
        {
            // Create top-level categories
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

            // Add categories
            await context.Categories.AddRangeAsync(categories);
            await context.SaveChangesAsync();
        }
    }
}