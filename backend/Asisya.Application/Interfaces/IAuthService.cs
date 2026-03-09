using Asisya.Domain.Entities;

namespace Asisya.Application.Interfaces;

public interface IJwtProvider
{
    string GenerateToken(User user);
}

public interface IAuthService
{
    Task<string> LoginAsync(string email, string password);
}
