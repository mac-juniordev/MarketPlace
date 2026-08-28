using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user, IEnumerable<string> roles);
}
