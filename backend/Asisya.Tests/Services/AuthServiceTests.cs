using Asisya.Application.Interfaces;
using Asisya.Domain.Entities;
using Asisya.Infrastructure.Auth;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace Asisya.Tests.Services;

public class AuthServiceTests
{
    private readonly AppDbContext _context;
    private readonly Mock<IJwtProvider> _mockJwtProvider;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _mockJwtProvider = new Mock<IJwtProvider>();
        _authService = new AuthService(_context, _mockJwtProvider.Object);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsToken()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            Email = "test@test.com",
            Name = "Test User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123")
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        _mockJwtProvider.Setup(x => x.GenerateToken(It.IsAny<User>())).Returns("fake-jwt-token");

        // Act
        var token = await _authService.LoginAsync("test@test.com", "password123");

        // Assert
        Assert.Equal("fake-jwt-token", token);
    }

    [Fact]
    public async Task LoginAsync_InvalidEmail_ThrowsUnauthorizedAccessException()
    {
        // Arrange

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _authService.LoginAsync("wrong@test.com", "password123"));
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var user = new User
        {
            Id = 1,
            Email = "test@test.com",
            Name = "Test User",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123")
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            _authService.LoginAsync("test@test.com", "wrongpassword"));
    }
}
