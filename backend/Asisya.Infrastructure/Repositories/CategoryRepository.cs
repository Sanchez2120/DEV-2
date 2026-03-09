using Asisya.Application.DTOs.Category;
using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Asisya.Infrastructure.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly AppDbContext _context;
    private readonly IMemoryCache _cache;
    private const string CacheKey = "categories_all";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

    public CategoryRepository(AppDbContext context, IMemoryCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        if (_cache.TryGetValue(CacheKey, out IEnumerable<CategoryDto>? cached) && cached != null)
            return cached;

        var categories = await _context.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl
            })
            .ToListAsync();

        _cache.Set(CacheKey, categories, CacheDuration);
        return categories;
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ImageUrl = category.ImageUrl
        };
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        // Invalidate cache so next GET /category fetches fresh data
        _cache.Remove(CacheKey);

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ImageUrl = category.ImageUrl
        };
    }

    public async Task<bool> UpdateImageUrlAsync(int id, string imageUrl)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return false;

        category.ImageUrl = imageUrl;
        await _context.SaveChangesAsync();

        // Invalidate cache
        _cache.Remove(CacheKey);
        return true;
    }
}
