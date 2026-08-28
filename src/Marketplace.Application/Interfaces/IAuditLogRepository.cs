using Marketplace.Domain.Entities;

namespace Marketplace.Application.Interfaces;

public interface IAuditLogRepository
{
    Task<AuditLog?> GetByIdAsync(Guid id);
    Task<IEnumerable<AuditLog>> GetByActorIdAsync(Guid actorId);
    Task<AuditLog> CreateAsync(AuditLog auditLog);
}