using Marketplace.Application.Interfaces;
using System.Security.Cryptography;

namespace Marketplace.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 100000;
    private static readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA256;

    public string Hash(string password)
    {
        // Generate random salt
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);

        // Hash password with salt
        byte[] hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            Algorithm,
            KeySize
        );

        // Return salt and hash combined
        return $"{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    public bool Verify(string password, string passwordHash)
    {
        // Split stored hash into salt and hash
        string[] parts = passwordHash.Split('.');
        byte[] salt = Convert.FromBase64String(parts[0]);
        byte[] hash = Convert.FromBase64String(parts[1]);

        // Hash the input password with the same salt
        byte[] inputHash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            Algorithm,
            KeySize
        );

        // Compare hashes
        return CryptographicOperations.FixedTimeEquals(hash, inputHash);
    }
}