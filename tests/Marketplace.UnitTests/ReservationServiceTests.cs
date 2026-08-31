using Xunit;
using Moq;
using Marketplace.Application.Interfaces;
using Marketplace.Application.Services;
using Marketplace.Application.DTOs.Reservation;
using Marketplace.Application.Exceptions;
using Marketplace.Domain.Entities;
using Marketplace.Domain.Enums;

namespace Marketplace.UnitTests;

public class ReservationServiceTests
{
    [Fact]
    public async Task CancelAsync_RestoresInventory()
    {
        // Arrange
        var mockReservationRepo = new Mock<IReservationRepository>();
        var mockListingRepo = new Mock<IListingRepository>();

        var userId = Guid.NewGuid();

        var listing = new Listing
        {
            Title = "Test Product",
            Status = ListingStatus.Reserved,
            IsAvailable = false,
            ProductDetails = new ProductDetails
            {
                AvailableQuantity = 0,
                IsReservable = true
            }
        };

        var listingId = listing.Id;

        var reservation = new Reservation
        {
            ListingId = listingId,
            UserId = userId,
            Status = ReservationStatus.Active,
            ExpiresAt = DateTime.UtcNow.AddMinutes(30)
        };

        var reservationId = reservation.Id;

        mockReservationRepo
            .Setup(r => r.GetByIdAsync(reservationId))
            .ReturnsAsync(reservation);

        mockListingRepo
            .Setup(l => l.GetByIdAsync(listingId))
            .ReturnsAsync(listing);

        var service = new ReservationService(
            mockReservationRepo.Object,
            mockListingRepo.Object);

        // Act
        await service.CancelAsync(reservationId, userId);

        // Assert
        Assert.Equal(1, listing.ProductDetails.AvailableQuantity);
        Assert.Equal(ListingStatus.Active, listing.Status);
        Assert.True(listing.IsAvailable);
        Assert.Equal(ReservationStatus.Cancelled, reservation.Status);
    }

    [Fact]
    public async Task CancelAsync_NotOwner_ThrowsUnauthorizedException()
    {
        // Arrange
        var mockReservationRepo = new Mock<IReservationRepository>();
        var mockListingRepo = new Mock<IListingRepository>();

        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();

        var reservation = new Reservation
        {
            UserId = ownerId,
            Status = ReservationStatus.Active
        };

        var reservationId = reservation.Id;

        mockReservationRepo
            .Setup(r => r.GetByIdAsync(reservationId))
            .ReturnsAsync(reservation);

        var service = new ReservationService(
            mockReservationRepo.Object,
            mockListingRepo.Object);

        // Act and Assert
        await Assert.ThrowsAsync<UnauthorizedException>(
            () => service.CancelAsync(reservationId, otherUserId));
    }

    [Fact]
    public async Task CancelAsync_AlreadyCancelled_ThrowsValidationException()
    {
        // Arrange
        var mockReservationRepo = new Mock<IReservationRepository>();
        var mockListingRepo = new Mock<IListingRepository>();

        var userId = Guid.NewGuid();

        var reservation = new Reservation
        {
            UserId = userId,
            Status = ReservationStatus.Cancelled
        };

        var reservationId = reservation.Id;

        mockReservationRepo
            .Setup(r => r.GetByIdAsync(reservationId))
            .ReturnsAsync(reservation);

        var service = new ReservationService(
            mockReservationRepo.Object,
            mockListingRepo.Object);

        // Act and Assert
        await Assert.ThrowsAsync<ValidationException>(
            () => service.CancelAsync(reservationId, userId));
    }
}