// Using directives: import necessary namespaces
using Marketplace.Application.Interfaces;
using Marketplace.Application.Services;
using Marketplace.Infrastructure.Data;
using Marketplace.Infrastructure.Repositories;
using Marketplace.Infrastructure.Services;
using Marketplace.Infrastructure.Seed;
using Marketplace.Api.Middleware;
using Marketplace.Api.Jobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Hangfire;
using Hangfire.PostgreSql;
using System.Text;

// Create the application builder
var builder = WebApplication.CreateBuilder(args);

// Register controllers
builder.Services.AddControllers();

// Register API explorer for Swagger
builder.Services.AddEndpointsApiExplorer();

// Register Swagger
builder.Services.AddSwaggerGen();

// Register the database context
// This tells EF Core to use PostgreSQL with our connection string
builder.Services.AddDbContext<MarketplaceDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Hangfire with PostgreSQL storage
// Jobs are stored in the database and survive application restarts
builder.Services.AddHangfire(config =>
    config.UsePostgreSqlStorage(options =>
        options.UseNpgsqlConnection(
            builder.Configuration.GetConnectionString("DefaultConnection"))));
// Register Hangfire server
// This runs the background jobs
builder.Services.AddHangfireServer();

// Register repositories
// Each interface is mapped to its implementation
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBusinessRepository, BusinessRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IListingRepository, ListingRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<IReportRepository, ReportRepository>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();

// Register services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<BusinessService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<ListingService>();
builder.Services.AddScoped<ReservationService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<ReportService>();

// Register utilities
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtService, JwtService>();

// Register background job class
builder.Services.AddScoped<ReservationExpiryJob>();

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!))
        };
    });

// Register authorization
builder.Services.AddAuthorization();

// Build the application
var app = builder.Build();

// Use exception handling middleware
app.UseMiddleware<ExceptionMiddleware>();

// Enable Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable Hangfire dashboard
// Shows job history, failures, and retries
app.UseHangfireDashboard();

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

// Enable authentication
app.UseAuthentication();

// Enable authorization
app.UseAuthorization();

// Map controller endpoints
app.MapControllers();

// Seed the database
// Creates initial roles and categories if they do not exist
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MarketplaceDbContext>();
    await DatabaseSeeder.SeedAsync(dbContext);
}

// Schedule the reservation expiry job
using (var scope = app.Services.CreateScope())
{
    // Get the recurring job manager from Hangfire
    var recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

    // Schedule the job to run every minute
    recurringJobManager.AddOrUpdate(
        "expire-reservations",
        () => scope.ServiceProvider.GetRequiredService<ReservationExpiryJob>().ProcessExpiredReservationsAsync(),
        "*/1 * * * *");
}

// Run the application
app.Run();