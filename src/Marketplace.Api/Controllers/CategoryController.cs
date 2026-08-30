// Import CategoryService
using Marketplace.Application.Services;
// Import Category entity
using Marketplace.Domain.Entities;
// Import Authorize
using Microsoft.AspNetCore.Authorization;
// Import MVC
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.Api.Controllers;

// API controller
[ApiController]
// URL prefix /api/categories
[Route("api/categories")]
// No [Authorize] attribute means all endpoints are public by default
public class CategoryController : ControllerBase
{
    // Private field for CategoryService
    private readonly CategoryService _categoryService;

    // Constructor injection
    public CategoryController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET /api/categories
    [HttpGet]
    // Get all categories
    public async Task<IActionResult> GetAll()
    {
        // Fetch all active categories
        var result = await _categoryService.GetAllAsync();

        // Return list
        return Ok(result);
    }

    // GET /api/categories/{id}
    [HttpGet("{id}")]
    // Get one category by ID
    public async Task<IActionResult> GetById(Guid id)
    {
        // Fetch category
        var result = await _categoryService.GetByIdAsync(id);

        // If not found, return 404
        if (result == null)
            return NotFound();

        // Otherwise return category
        return Ok(result);
    }

    // GET /api/categories/slug/{slug}
    [HttpGet("slug/{slug}")]
    // Get category by URL-friendly slug
    public async Task<IActionResult> GetBySlug(string slug)
    {
        // Fetch category by slug
        var result = await _categoryService.GetBySlugAsync(slug);

        // If not found, return 404
        if (result == null)
            return NotFound();

        // Return category
        return Ok(result);
    }

    // GET /api/categories/{id}/subcategories
    [HttpGet("{id}/subcategories")]
    // Get subcategories of a category
    public async Task<IActionResult> GetSubCategories(Guid id)
    {
        // Fetch subcategories
        var result = await _categoryService.GetSubCategoriesAsync(id);

        // Return list
        return Ok(result);
    }

    // POST /api/categories
    [HttpPost]
    // Only admins can create categories
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> Create([FromBody] Category category)
    {
        // Create category using service
        var result = await _categoryService.CreateAsync(
            category.Name,
            category.Slug,
            category.Description,
            category.ParentCategoryId);

        // Return created category
        return Ok(result);
    }
}