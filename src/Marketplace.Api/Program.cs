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
using AspNetCoreRateLimit;
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
builder.Services.AddDbContext<MarketplaceDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure Hangfire with PostgreSQL storage
builder.Services.AddHangfire(config =>
    config.UsePostgreSqlStorage(options =>
        options.UseNpgsqlConnection(
            builder.Configuration.GetConnectionString("DefaultConnection"))));

// Register Hangfire server
builder.Services.AddHangfireServer();

// Register repositories
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
builder.Services.AddScoped<CloudinaryService>();

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

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure rate limiting
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(
    builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
builder.Services.AddInMemoryRateLimiting();

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
app.UseHangfireDashboard();

// Redirect HTTP to HTTPS
app.UseHttpsRedirection();

// Enable rate limiting
app.UseIpRateLimiting();

// Enable CORS
app.UseCors("AllowFrontend");

// Enable authentication
app.UseAuthentication();

// Enable authorization
app.UseAuthorization();

// Map controller endpoints
app.MapControllers();

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MarketplaceDbContext>();
    await DatabaseSeeder.SeedAsync(dbContext);
}

// Schedule the reservation expiry job
using (var scope = app.Services.CreateScope())
{
    var recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

    recurringJobManager.AddOrUpdate(
        "expire-reservations",
        () => scope.ServiceProvider.GetRequiredService<ReservationExpiryJob>().ProcessExpiredReservationsAsync(),
        "*/1 * * * *");
}

// Run the application
app.Run();