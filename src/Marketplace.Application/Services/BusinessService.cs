using Marketplace.Application.DTOs.Business;
using Marketplace.Application.Exceptions;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Services;

public class BusinessService
{
    private readonly IBusinessRepository _businessRepository;

    public BusinessService(IBusinessRepository businessRepository)
    {
        _businessRepository = businessRepository;
    }

    public async Task<BusinessDto> CreateAsync(Guid ownerId, CreateBusinessRequest request)
    {
        var business = new Business
        {
            Name = request.Name.Trim(),
            Description = request.Description.Trim(),
            PhoneNumber = request.PhoneNumber?.Trim(),
            Email = request.Email?.Trim(),
            Address = request.Address?.Trim(),
            City = request.City?.Trim(),
            OwnerId = ownerId,
            IsVerified = false,
            IsActive = true,
            CreatedBy = ownerId
        };

        var created = await _businessRepository.CreateAsync(business);

        return MapToDto(created);
    }

    public async Task<BusinessDto> GetByIdAsync(Guid id)
    {
        var business = await _businessRepository.GetByIdAsync(id);

        if (business == null)
            throw new NotFoundException("Business not found");

        return MapToDto(business);
    }

    public async Task<IEnumerable<BusinessDto>> GetByOwnerIdAsync(Guid ownerId)
    {
        var businesses = await _businessRepository.GetByOwnerIdAsync(ownerId);

        return businesses.Select(MapToDto);
    }

    public async Task<BusinessDto> UpdateAsync(Guid businessId, Guid userId, UpdateBusinessRequest request)
    {
        var business = await _businessRepository.GetByIdAsync(businessId);

        if (business == null)
            throw new NotFoundException("Business not found");

        if (business.OwnerId != userId)
            throw new UnauthorizedException("Not the business owner");

        business.Name = request.Name.Trim();
        business.Description = request.Description.Trim();
        business.LogoUrl = request.LogoUrl;
        business.PhoneNumber = request.PhoneNumber?.Trim();
        business.Email = request.Email?.Trim();
        business.Address = request.Address?.Trim();
        business.City = request.City?.Trim();
        business.MarkUpdated();
        business.UpdatedBy = userId;

        await _businessRepository.UpdateAsync(business);

        return MapToDto(business);
    }

    private BusinessDto MapToDto(Business business)
    {
        return new BusinessDto
        {
            Id = business.Id,
            Name = business.Name,
            Description = business.Description,
            LogoUrl = business.LogoUrl,
            PhoneNumber = business.PhoneNumber,
            Email = business.Email,
            Address = business.Address,
            City = business.City,
            Country = business.Country,
            IsVerified = business.IsVerified,
            OwnerId = business.OwnerId,
            CreatedAt = business.CreatedAt
        };
    }
}