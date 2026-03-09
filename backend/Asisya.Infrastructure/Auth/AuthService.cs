using Asisya.Application.Interfaces;
using Asisya.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Asisya.Infrastructure.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IJwtProvider _jwtProvider;

    public AuthService(AppDbContext context, IJwtProvider jwtProvider)
    {
        _context = context;
        _jwtProvider = jwtProvider;
    }

    public async Task<string> LoginAsync(string email, string password)
    {
        var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == email);
        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password.");

        bool isValidPassword = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
        if (!isValidPassword)
            throw new UnauthorizedAccessException("Invalid email or password.");

        return _jwtProvider.GenerateToken(user);
    }
}
