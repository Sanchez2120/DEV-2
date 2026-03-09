using Asisya.Application.DTOs.Category;

namespace Asisya.Application.Interfaces;

public interface ICategoryRepository
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();
    Task<CategoryDto?> GetByIdAsync(int id);
    Task<CategoryDto> CreateAsync(CreateCategoryDto category);
    Task<bool> UpdateImageUrlAsync(int id, string imageUrl);
}
