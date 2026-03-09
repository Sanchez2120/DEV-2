using Asisya.Application.DTOs.Product;
using Asisya.Domain.Entities;
using Asisya.Infrastructure.Data;
using Asisya.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Asisya.Tests.Repositories;

public class ProductRepositoryTests
{
    private readonly AppDbContext _context;
    private readonly ProductRepository _repository;

    public ProductRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _repository = new ProductRepository(_context);
    }

    [Fact]
    public async Task GetPaginatedAsync_ReturnsCorrectPageAndData()
    {
        // Arrange
        var category = new Category { Id = 1, Name = "SERVIDORES" };
        _context.Categories.Add(category);

        for (int i = 1; i <= 25; i++)
        {
            _context.Products.Add(new Product { Id = i, Name = $"Product {i}", Price = 10, Stock = 5, CategoryId = 1 });
        }
        await _context.SaveChangesAsync();

        var query = new ProductPaginationQuery { Page = 2, PageSize = 10 };

        // Act
        var result = await _repository.GetPaginatedAsync(query);

        // Assert
        Assert.Equal(25, result.TotalCount);
        Assert.Equal(3, result.TotalPages);
        Assert.Equal(10, result.Items.Count());
        Assert.Equal("Product 11", result.Items.First().Name);
    }

    [Fact]
    public async Task BulkInsertAsync_InsertsMultipleProducts()
    {
        // Arrange
        var category = new Category { Id = 1, Name = "CLOUD" };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var dtos = new List<CreateProductDto>();
        for (int i = 0; i < 15; i++)
        {
            dtos.Add(new CreateProductDto { Name = $"Bulk Product {i}", Price = 100, Stock = 10, CategoryId = 1 });
        }

        // Act
        var result = await _repository.BulkInsertAsync(dtos);

        // Assert
        Assert.True(result);
        Assert.Equal(15, await _context.Products.CountAsync());
    }
}
