// Import xUnit testing framework
using Xunit;
// Import the class we are testing
using Marketplace.Infrastructure.Services;
// Import the interface
using Marketplace.Application.Interfaces;

namespace Marketplace.UnitTests;

// Test class for PasswordHasher
public class PasswordHasherTests
{
    // Fact attribute means this is a test method
    [Fact]
    public void Hash_ReturnsDifferentHashForDifferentPasswords()
    {
        // Arrange: create the service
        IPasswordHasher passwordHasher = new PasswordHasher();

        // Act: hash two different passwords
        string hash1 = passwordHasher.Hash("password123");
        string hash2 = passwordHasher.Hash("different456");

        // Assert: hashes should be different
        Assert.NotEqual(hash1, hash2);
    }

    [Fact]
    public void Hash_ReturnsDifferentHashForSamePasswordDueToSalt()
    {
        // Arrange
        IPasswordHasher passwordHasher = new PasswordHasher();

        // Act: hash same password twice
        string hash1 = passwordHasher.Hash("samepassword");
        string hash2 = passwordHasher.Hash("samepassword");

        // Assert: hashes should be different because of random salt
        Assert.NotEqual(hash1, hash2);
    }

    [Fact]
    public void Verify_ReturnsTrueForCorrectPassword()
    {
        // Arrange
        IPasswordHasher passwordHasher = new PasswordHasher();
        string hash = passwordHasher.Hash("mypassword");

        // Act
        bool result = passwordHasher.Verify("mypassword", hash);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void Verify_ReturnsFalseForWrongPassword()
    {
        // Arrange
        IPasswordHasher passwordHasher = new PasswordHasher();
        string hash = passwordHasher.Hash("correctpassword");

        // Act
        bool result = passwordHasher.Verify("wrongpassword", hash);

        // Assert
        Assert.False(result);
    }
}