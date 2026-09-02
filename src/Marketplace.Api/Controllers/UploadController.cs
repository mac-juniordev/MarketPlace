// Import Cloudinary service
using Marketplace.Infrastructure.Services;
// Import authorization
using Microsoft.AspNetCore.Authorization;
// Import MVC
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.Api.Controllers;

// Controller for image uploads
[ApiController]
[Route("api/upload")]
[Authorize]
public class UploadController : ControllerBase
{
    // Cloudinary service
    private readonly CloudinaryService _cloudinaryService;

    // Constructor injection
    public UploadController(CloudinaryService cloudinaryService)
    {
        _cloudinaryService = cloudinaryService;
    }

    // POST /api/upload
    // Upload an image
    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        // Validate file
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file provided" });

        // Validate file type
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType))
            return BadRequest(new { message = "Only JPEG, PNG, and WebP images are allowed" });

        // Validate file size (max 5MB)
        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "Image must be smaller than 5MB" });

        try
        {
            // Upload to Cloudinary
            using var stream = file.OpenReadStream();
            var url = await _cloudinaryService.UploadImageAsync(stream, file.FileName);

            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }
}