using Asisya.Application.DTOs.Product;

namespace Asisya.Application.Interfaces;

public interface IProductRepository
{
    Task<PaginatedResult<ProductDto>> GetPaginatedAsync(ProductPaginationQuery query);
    Task<ProductDto?> GetByIdAsync(int id);
    Task<ProductDto> CreateAsync(CreateProductDto product);
    Task<ProductDto> UpdateAsync(int id, UpdateProductDto product);
    Task<bool> DeleteAsync(int id);
    Task<bool> BulkInsertAsync(IEnumerable<CreateProductDto> products);
}
