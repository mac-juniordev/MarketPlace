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
        var reservation = await _reservationRepository.CreateWithLockAsync(userId, request.ListingId);

        // Save buyer contact info
        reservation.BuyerName = request.BuyerName;
        reservation.BuyerPhone = request.BuyerPhone;
        reservation.BuyerEmail = request.BuyerEmail;
        await _reservationRepository.UpdateAsync(reservation);

        return MapToDto(reservation);
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

        if (reservation.UserId != userId)
            throw new UnauthorizedException("Not your reservation");

        if (reservation.Status != ReservationStatus.Active)
            throw new ValidationException("Reservation is not active");

        reservation.Status = ReservationStatus.Cancelled;
        reservation.CancelledAt = DateTime.UtcNow;
        reservation.CancellationReason = "Cancelled by user";
        reservation.MarkUpdated();
        reservation.UpdatedBy = userId;

        await _reservationRepository.UpdateAsync(reservation);

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
            CreatedAt = reservation.CreatedAt,
            BuyerName = reservation.BuyerName,
            BuyerPhone = reservation.BuyerPhone,
            BuyerEmail = reservation.BuyerEmail,
            ListingTitle = reservation.Listing?.Title
        };
    }
}