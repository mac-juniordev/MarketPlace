// Import Cloudinary
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
// Import configuration
using Microsoft.Extensions.Configuration;

namespace Marketplace.Infrastructure.Services;

// Service for uploading images to Cloudinary
public class CloudinaryService
{
    // Cloudinary client
    private readonly Cloudinary _cloudinary;

    // Constructor
    public CloudinaryService(IConfiguration configuration)
    {
        var cloudName = configuration["Cloudinary:CloudName"];
        var apiKey = configuration["Cloudinary:ApiKey"];
        var apiSecret = configuration["Cloudinary:ApiSecret"];

        var account = new Account(cloudName, apiKey, apiSecret);
        _cloudinary = new Cloudinary(account);
    }

    // Upload an image
    public async Task<string> UploadImageAsync(Stream stream, string fileName)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, stream),
            UploadPreset = "marketplace_uploads",
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null)
        {
            throw new Exception($"Cloudinary upload failed: {uploadResult.Error.Message}");
        }

        return uploadResult.SecureUrl.ToString();
    }

    // Delete an image
    public async Task DeleteImageAsync(string publicId)
    {
        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }
}