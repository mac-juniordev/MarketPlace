// Import DTOs
using Marketplace.Application.DTOs.Reservation;
// Import exceptions
using Marketplace.Application.Exceptions;
// Import interfaces
using Marketplace.Application.Interfaces;
// Import entities
using Marketplace.Domain.Entities;
// Import enums
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Services;

// Class: handles reservation business logic
public class ReservationService
{
    // Dependencies: only interfaces, no database context
    private readonly IReservationRepository _reservationRepository;
    private readonly IListingRepository _listingRepository;

    // Constructor injection
    public ReservationService(
        IReservationRepository reservationRepository,
        IListingRepository listingRepository)
    {
        _reservationRepository = reservationRepository;
        _listingRepository = listingRepository;
    }

    // Create a reservation
    public async Task<ReservationDto> CreateAsync(Guid userId, CreateReservationRequest request)
    {
        // Call the repository method that handles locking
        // The actual transaction and locking happens in Infrastructure
        var reservation = await _reservationRepository.CreateWithLockAsync(userId, request.ListingId);

        // Return as DTO
        return MapToDto(reservation);
    }

    // Get reservation by ID
    public async Task<ReservationDto> GetByIdAsync(Guid id)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id);

        if (reservation == null)
            throw new NotFoundException("Reservation not found");

        return MapToDto(reservation);
    }

    // Get user's reservations
    public async Task<IEnumerable<ReservationDto>> GetByUserIdAsync(Guid userId)
    {
        var reservations = await _reservationRepository.GetByUserIdAsync(userId);
        return reservations.Select(MapToDto);
    }

    // Get reservations for a listing
    public async Task<IEnumerable<ReservationDto>> GetByListingIdAsync(Guid listingId)
    {
        var reservations = await _reservationRepository.GetByListingIdAsync(listingId);
        return reservations.Select(MapToDto);
    }

    // Cancel a reservation
    public async Task CancelAsync(Guid reservationId, Guid userId)
    {
        var reservation = await _reservationRepository.GetByIdAsync(reservationId);

        if (reservation == null)
            throw new NotFoundException("Reservation not found");

        // Only the owner can cancel
        if (reservation.UserId != userId)
            throw new UnauthorizedException("Not your reservation");

        // Only active reservations can be cancelled
        if (reservation.Status != ReservationStatus.Active)
            throw new ValidationException("Reservation is not active");

        // Mark as cancelled
        reservation.Status = ReservationStatus.Cancelled;
        reservation.CancelledAt = DateTime.UtcNow;
        reservation.CancellationReason = "Cancelled by user";
        reservation.MarkUpdated();
        reservation.UpdatedBy = userId;

        await _reservationRepository.UpdateAsync(reservation);

        // Restore inventory
        var listing = await _listingRepository.GetByIdAsync(reservation.ListingId);

        if (listing != null && listing.ProductDetails != null)
        {
            listing.ProductDetails.AvailableQuantity += 1;
            listing.Status = ListingStatus.Active;
            listing.IsAvailable = true;
            listing.MarkUpdated();
            await _listingRepository.UpdateAsync(listing);
        }
    }

    // Force expire a reservation
    public async Task ExpireAsync(Guid reservationId)
    {
        var reservation = await _reservationRepository.GetByIdAsync(reservationId);

        if (reservation == null)
            throw new NotFoundException("Reservation not found");

        if (reservation.Status != ReservationStatus.Active)
            return;

        // Mark as expired
        reservation.Status = ReservationStatus.Expired;
        reservation.MarkUpdated();

        await _reservationRepository.UpdateAsync(reservation);

        // Restore inventory
        var listing = await _listingRepository.GetByIdAsync(reservation.ListingId);

        if (listing != null && listing.ProductDetails != null)
        {
            listing.ProductDetails.AvailableQuantity += 1;
            listing.Status = ListingStatus.Active;
            listing.IsAvailable = true;
            listing.MarkUpdated();
            await _listingRepository.UpdateAsync(listing);
        }
    }

    // Map entity to DTO
    private ReservationDto MapToDto(Reservation reservation)
    {
        return new ReservationDto
        {
            Id = reservation.Id,
            ListingId = reservation.ListingId,
            UserId = reservation.UserId,
            Status = reservation.Status,
            ExpiresAt = reservation.ExpiresAt,
            CreatedAt = reservation.CreatedAt
        };
    }
}