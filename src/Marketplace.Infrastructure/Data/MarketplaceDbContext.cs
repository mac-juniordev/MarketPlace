using Marketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Marketplace.Infrastructure.Data;

public class MarketplaceDbContext : DbContext
{
    public MarketplaceDbContext(DbContextOptions<MarketplaceDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Permission> Permissions { get; set; } = null!;
    public DbSet<UserRole> UserRoles { get; set; } = null!;
    public DbSet<RolePermission> RolePermissions { get; set; } = null!;
    public DbSet<Business> Businesses { get; set; } = null!;
    public DbSet<BusinessStaff> BusinessStaff { get; set; } = null!;
    public DbSet<Category> Categories { get; set; } = null!;
    public DbSet<Listing> Listings { get; set; } = null!;
    public DbSet<ListingImage> ListingImages { get; set; } = null!;
    public DbSet<Reservation> Reservations { get; set; } = null!;
    public DbSet<Review> Reviews { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<Report> Reports { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
    public DbSet<ProductDetails> ProductDetails { get; set; } = null!;
    public DbSet<PropertyDetails> PropertyDetails { get; set; } = null!;
    public DbSet<VehicleDetails> VehicleDetails { get; set; } = null!;
    public DbSet<ServiceDetails> ServiceDetails { get; set; } = null!;
    public DbSet<Plan> Plans { get; set; } = null!;
    public DbSet<Subscription> Subscriptions { get; set; } = null!;
    public DbSet<Payment> Payments { get; set; } = null!;
    public DbSet<Transaction> Transactions { get; set; } = null!;
    public DbSet<Promotion> Promotions { get; set; } = null!;
    public DbSet<VerificationRequest> VerificationRequests { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User relationships
        modelBuilder.Entity<User>()
            .HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity<UserRole>(
                j => j.HasOne(ur => ur.Role).WithMany(r => r.UserRoles).HasForeignKey(ur => ur.RoleId),
                j => j.HasOne(ur => ur.User).WithMany(u => u.UserRoles).HasForeignKey(ur => ur.UserId)
            );

        modelBuilder.Entity<User>()
            .HasMany(u => u.Businesses)
            .WithOne(b => b.Owner)
            .HasForeignKey(b => b.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Reservations)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Reviews)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Notifications)
            .WithOne(n => n.User)
            .HasForeignKey(n => n.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Role relationships
        modelBuilder.Entity<Role>()
            .HasMany(r => r.Permissions)
            .WithMany(p => p.Roles)
            .UsingEntity<RolePermission>(
                j => j.HasOne(rp => rp.Permission).WithMany(p => p.RolePermissions).HasForeignKey(rp => rp.PermissionId),
                j => j.HasOne(rp => rp.Role).WithMany(r => r.RolePermissions).HasForeignKey(rp => rp.RoleId)
            );

        // Business relationships
        modelBuilder.Entity<Business>()
            .HasMany(b => b.Listings)
            .WithOne(l => l.Business)
            .HasForeignKey(l => l.BusinessId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Business>()
            .HasMany(b => b.Staff)
            .WithOne(s => s.Business)
            .HasForeignKey(s => s.BusinessId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Business>()
            .HasMany(b => b.Subscriptions)
            .WithOne(s => s.Business)
            .HasForeignKey(s => s.BusinessId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Business>()
            .HasMany(b => b.Payments)
            .WithOne(p => p.Business)
            .HasForeignKey(p => p.BusinessId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Business>()
            .HasMany(b => b.Transactions)
            .WithOne(t => t.Business)
            .HasForeignKey(t => t.BusinessId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Business>()
            .HasMany(b => b.Promotions)
            .WithOne(p => p.Business)
            .HasForeignKey(p => p.BusinessId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Business>()
            .HasMany(b => b.VerificationRequests)
            .WithOne(v => v.Business)
            .HasForeignKey(v => v.BusinessId)
            .OnDelete(DeleteBehavior.Cascade);

        // Category relationships
        modelBuilder.Entity<Category>()
            .HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Category>()
            .HasMany(c => c.Listings)
            .WithOne(l => l.Category)
            .HasForeignKey(l => l.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Listing relationships
        modelBuilder.Entity<Listing>()
            .HasMany(l => l.Images)
            .WithOne(i => i.Listing)
            .HasForeignKey(i => i.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
            .HasMany(l => l.Reservations)
            .WithOne(r => r.Listing)
            .HasForeignKey(r => r.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
            .HasMany(l => l.Reviews)
            .WithOne(r => r.Listing)
            .HasForeignKey(r => r.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
            .HasMany(l => l.Promotions)
            .WithOne(p => p.Listing)
            .HasForeignKey(p => p.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
            .HasOne(l => l.ProductDetails)
            .WithOne(p => p.Listing)
            .HasForeignKey<ProductDetails>(p => p.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
            .HasOne(l => l.PropertyDetails)
            .WithOne(p => p.Listing)
            .HasForeignKey<PropertyDetails>(p => p.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
            .HasOne(l => l.VehicleDetails)
            .WithOne(v => v.Listing)
            .HasForeignKey<VehicleDetails>(v => v.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Listing>()
            .HasOne(l => l.ServiceDetails)
            .WithOne(s => s.Listing)
            .HasForeignKey<ServiceDetails>(s => s.ListingId)
            .OnDelete(DeleteBehavior.Cascade);

        // Report relationships
        modelBuilder.Entity<Report>()
            .HasOne(r => r.Reporter)
            .WithMany()
            .HasForeignKey(r => r.ReporterUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Report>()
            .HasOne(r => r.ReportedListing)
            .WithMany()
            .HasForeignKey(r => r.ReportedListingId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Report>()
            .HasOne(r => r.ReportedBusiness)
            .WithMany()
            .HasForeignKey(r => r.ReportedBusinessId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Report>()
            .HasOne(r => r.ReportedUser)
            .WithMany()
            .HasForeignKey(r => r.ReportedUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // AuditLog relationships
        modelBuilder.Entity<AuditLog>()
            .HasOne(a => a.Actor)
            .WithMany()
            .HasForeignKey(a => a.ActorUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}