using Asisya.Application.DTOs.Product;
using Asisya.Application.DTOs.Category;
using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Asisya.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<ProductDto>> GetPaginatedAsync(ProductPaginationQuery query)
    {
        var queryable = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        if (query.CategoryId.HasValue)
        {
            queryable = queryable.Where(p => p.CategoryId == query.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.ToLower();
            queryable = queryable.Where(p => p.Name.ToLower().Contains(search) 
                                          || (p.Description != null && p.Description.ToLower().Contains(search)));
        }

        var totalCount = await queryable.CountAsync();

        var items = await queryable
            .OrderBy(p => p.Id)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                Stock = p.Stock,
                ImageUrl = p.ImageUrl,
                CategoryId = p.CategoryId,
                Category = new CategoryDto
                {
                    Id = p.Category.Id,
                    Name = p.Category.Name,
                    Description = p.Category.Description
                }
            })
            .ToListAsync();

        return new PaginatedResult<ProductDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }

    public async Task<ProductDto?> GetByIdAsync(int id)
    {
        var p = await _context.Products
            .Include(x => x.Category)
            .FirstOrDefaultAsync(x => x.Id == id);
            
        if (p == null) return null;

        return new ProductDto
        {
            Id = p.Id,
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            Stock = p.Stock,
            ImageUrl = p.ImageUrl,
            CategoryId = p.CategoryId,
            Category = new CategoryDto
            {
                Id = p.Category.Id,
                Name = p.Category.Name,
                Description = p.Category.Description
            }
        };
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return await GetByIdAsync(product.Id) ?? throw new InvalidOperationException("Failed to retrieve created product.");
    }

    public async Task<ProductDto> UpdateAsync(int id, UpdateProductDto dto)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) throw new KeyNotFoundException($"Product with ID {id} not found.");

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.Stock = dto.Stock;
        product.ImageUrl = dto.ImageUrl;
        product.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();
        
        return await GetByIdAsync(product.Id) ?? throw new InvalidOperationException("Failed to retrieve updated product.");
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return false;

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> BulkInsertAsync(IEnumerable<CreateProductDto> dtos)
    {
        var products = dtos.Select(dto => new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId
        }).ToList();
        
        // Use EF Core bulk AddRange
        // In PostgreSQL using Npgsql, SaveChanges() automatically batches inserts efficiently,
        // reducing round-trips for the 100,000 items. We process in chunks to avoid memory explosion.
        
        int batchSize = 10000;
        for (int i = 0; i < products.Count; i += batchSize)
        {
            var batch = products.Skip(i).Take(batchSize);
            _context.Products.AddRange(batch);
            await _context.SaveChangesAsync();
            _context.ChangeTracker.Clear(); // crucial for performance during bulk inserts
        }

        return true;
    }
}
