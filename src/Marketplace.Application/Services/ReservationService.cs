using Marketplace.Application.DTOs.Reservation;
using Marketplace.Application.Exceptions;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;

namespace Marketplace.Application.Services;

public class ReservationService
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IListingRepository _listingRepository;

    public ReservationService(
        IReservationRepository reservationRepository,
        IListingRepository listingRepository)
    {
        _reservationRepository = reservationRepository;
        _listingRepository = listingRepository;
    }

    public async Task<ReservationDto> CreateAsync(Guid userId, CreateReservationRequest request)
    {
        // Fetch listing
        var listing = await _listingRepository.GetByIdAsync(request.ListingId);

        if (listing == null)
            throw new NotFoundException("Listing not found");

        // Check if listing is available
        if (!listing.IsAvailable)
            throw new ValidationException("Listing is not available");

        // Check if listing is a product
        if (listing.Type != ListingType.Product)
            throw new ValidationException("Only products can be reserved");

        // Check if product details exist
        if (listing.ProductDetails == null)
            throw new ValidationException("Product details not found");

        // Check if reservable
        if (!listing.ProductDetails.IsReservable)
            throw new ValidationException("This product cannot be reserved");

        // Check available quantity
        if (listing.ProductDetails.AvailableQuantity < 1)
            throw new ValidationException("Out of stock");

        // Check if user already has an active reservation for this listing
        var existingReservations = await _reservationRepository.GetActiveByListingIdAsync(listing.Id);

        if (existingReservations.Any(r => r.UserId == userId))
            throw new ValidationException("You already have an active reservation for this item");

        // Decrement available quantity
        listing.ProductDetails.AvailableQuantity -= 1;

        // If quantity is now 0, mark as reserved
        if (listing.ProductDetails.AvailableQuantity == 0)
        {
            listing.Status = ListingStatus.Reserved;
            listing.IsAvailable = false;
        }

        // Create reservation
        var reservation = new Reservation
        {
            ListingId = listing.Id,
            UserId = userId,
            Status = ReservationStatus.Active,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60),
            CreatedBy = userId
        };

        // Save reservation and update listing
        var created = await _reservationRepository.CreateAsync(reservation);
        await _listingRepository.UpdateAsync(listing);

        // Increment reservation count
        listing.ReservationCount += 1;
        await _listingRepository.UpdateAsync(listing);

        return MapToDto(created);
    }

    public async Task<ReservationDto> GetByIdAsync(Guid id)
    {
        var reservation = await _reservationRepository.GetByIdAsync(id);

        if (reservation == null)
            throw new NotFoundException("Reservation not found");

        return MapToDto(reservation);
    }

    public async Task<IEnumerable<ReservationDto>> GetByUserIdAsync(Guid userId)
    {
        var reservations = await _reservationRepository.GetByUserIdAsync(userId);

        return reservations.Select(MapToDto);
    }

    public async Task<IEnumerable<ReservationDto>> GetByListingIdAsync(Guid listingId)
    {
        var reservations = await _reservationRepository.GetByListingIdAsync(listingId);

        return reservations.Select(MapToDto);
    }

    public async Task CancelAsync(Guid reservationId, Guid userId)
    {
        var reservation = await _reservationRepository.GetByIdAsync(reservationId);

        if (reservation == null)
            throw new NotFoundException("Reservation not found");

        // Only the user who made the reservation can cancel
        if (reservation.UserId != userId)
            throw new UnauthorizedException("Not your reservation");

        // Only active reservations can be cancelled
        if (reservation.Status != ReservationStatus.Active)
            throw new ValidationException("Reservation is not active");

        // Update reservation status
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

    public async Task ExpireAsync(Guid reservationId)
    {
        var reservation = await _reservationRepository.GetByIdAsync(reservationId);

        if (reservation == null)
            throw new NotFoundException("Reservation not found");

        if (reservation.Status != ReservationStatus.Active)
            return;

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