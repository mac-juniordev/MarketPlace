namespace Marketplace.Application.DTOs.Business;

public class BusinessDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public bool IsVerified { get; set; }
    public Guid OwnerId { get; set; }
    public DateTime CreatedAt { get; set; }
}