using Marketplace.Application.Exceptions;
using Marketplace.Application.Interfaces;
using Marketplace.Domain.Entities;

namespace Marketplace.Application.Services;

public class CategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<Category> CreateAsync(string name, string slug, string? description, Guid? parentId)
    {
        var category = new Category
        {
            Name = name.Trim(),
            Slug = slug.Trim().ToLower(),
            Description = description?.Trim(),
            ParentCategoryId = parentId,
            IsActive = true
        };

        return await _categoryRepository.CreateAsync(category);
    }

    public async Task<Category?> GetByIdAsync(Guid id)
    {
        return await _categoryRepository.GetByIdAsync(id);
    }

    public async Task<Category?> GetBySlugAsync(string slug)
    {
        return await _categoryRepository.GetBySlugAsync(slug);
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
        return await _categoryRepository.GetAllAsync();
    }

    public async Task<IEnumerable<Category>> GetSubCategoriesAsync(Guid parentId)
    {
        return await _categoryRepository.GetSubCategoriesAsync(parentId);
    }
}