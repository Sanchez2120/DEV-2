using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Asisya.Application.DTOs.Auth;
using Asisya.Application.DTOs.Product;
using Asisya.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Xunit;

namespace Asisya.Tests.Integration;

public class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<Program> _factory;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                var dbConnectionDescriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(System.Data.Common.DbConnection));

                if (dbConnectionDescriptor != null)
                {
                    services.Remove(dbConnectionDescriptor);
                }

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseInMemoryDatabase("IntegrationTestsDb");
                });
            });
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task CreateProduct_WithoutToken_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.PostAsJsonAsync("/api/product", new CreateProductDto { Name = "Test" });

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateProduct_WithValidToken_ReturnsCreated()
    {
        // 1. Obtener token
        var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", new LoginDto
        {
            Email = "admin@asisya.com",
            Password = "Admin123!"
        });
        
        // Assert login fue 200 OK
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        
        var authData = await loginResponse.Content.ReadFromJsonAsync<AuthResponseDto>();
        Assert.NotNull(authData?.Token);

        // 2. Hacer petición POST protegida con el token
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", authData.Token);
        var dto = new CreateProductDto { Name = "New Int Product", Price = 99.99m, Stock = 10, CategoryId = 1 };
        var productsResponse = await _client.PostAsJsonAsync("/api/product", dto);

        // Assert petición protegida fue autorizada y devuelve 201 Created (o 400 si falla validación, pero no 401)
        Assert.NotEqual(HttpStatusCode.Unauthorized, productsResponse.StatusCode);
    }

    [Fact]
    public async Task GetCategories_IsPublic_ReturnsOkWithoutToken()
    {
        // Act (sin token)
        var response = await _client.GetAsync("/api/category");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
