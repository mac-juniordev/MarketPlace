// Import DTOs
using Marketplace.Application.DTOs.Auth;
using Marketplace.Application.DTOs.User;
// Import exceptions
using Marketplace.Application.Exceptions;
// Import interfaces
using Marketplace.Application.Interfaces;
// Import entities
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Services;

// Service for authentication
public class AuthService
{
    // Dependencies
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    // Constructor injection
    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    // Register a new user
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Check if email already exists
        if (await _userRepository.ExistsAsync(request.Email))
            throw new ValidationException("Email already registered");

        // Create user entity
        var user = new User
        {
            Email = request.Email.ToLower().Trim(),
            PasswordHash = _passwordHasher.Hash(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            PhoneNumber = request.PhoneNumber?.Trim(),
            IsEmailVerified = false,
            IsPhoneVerified = false,
            IsActive = true,
            CreatedBy = Guid.NewGuid()
        };

        // Save user
        var created = await _userRepository.CreateAsync(user);

        // Generate token with Customer role
        var token = _jwtService.GenerateToken(created, new List<string> { "Customer" });

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            User = MapToDto(created)
        };
    }

    // Login a user
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Find user by email
        var user = await _userRepository.GetByEmailAsync(request.Email.ToLower().Trim());

        if (user == null)
            throw new UnauthorizedException("Invalid credentials");

        // Verify password
        if (!_passwordHasher.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid credentials");

        // Check if user is active
        if (!user.IsActive)
            throw new UnauthorizedException("Account is deactivated");

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        // Get user roles from database
        var roles = await _userRepository.GetUserRolesAsync(user.Id);

        // If no roles, default to Customer
        if (!roles.Any())
            roles = new List<string> { "Customer" };

        // Generate token with actual roles
        var token = _jwtService.GenerateToken(user, roles);

        return new AuthResponse
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(24),
            User = MapToDto(user)
        };
    }

    // Map entity to DTO
    private UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            AvatarUrl = user.AvatarUrl,
            IsPhoneVerified = user.IsPhoneVerified,
            IsEmailVerified = user.IsEmailVerified,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }
}