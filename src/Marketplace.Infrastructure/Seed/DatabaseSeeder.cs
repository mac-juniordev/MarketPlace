using Marketplace.Domain.Entities;
using Marketplace.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Seed;

public static class DatabaseSeeder
{
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
    }
}