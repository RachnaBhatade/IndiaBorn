using BCrypt.Net;
using Indiaborn.Api.Configuration;
using Indiaborn.Api.DTOs;
using Indiaborn.Api.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Indiaborn.Api.Services;

public class UserService
{
    private readonly IMongoCollection<UserAccount> _users;
    private readonly ILogger<UserService> _logger;

    public UserService(Data.MongoDbContext context, IOptions<MongoSettings> mongoSettings, ILogger<UserService> logger)
    {
        _users = context.GetCollection<UserAccount>(mongoSettings.Value.UsersCollection);
        _logger = logger;
    }

    public async Task<UserAccount?> GetByEmailAsync(string email, CancellationToken token = default)
        => await _users.Find(u => u.Email == email).FirstOrDefaultAsync(token);

    public async Task<UserAccount> RegisterAsync(RegisterRequest request, UserRole role = UserRole.Customer, CancellationToken token = default)
    {
        var existing = await GetByEmailAsync(request.Email, token);
        if (existing != null)
        {
            throw new InvalidOperationException("Email already registered.");
        }

        var user = new UserAccount
        {
            Email = request.Email.ToLowerInvariant(),
            FullName = request.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = role,
            CreatedAt = DateTime.UtcNow,
            LastLoginAt = DateTime.UtcNow
        };

        await _users.InsertOneAsync(user, cancellationToken: token);
        return user;
    }

    public async Task<UserAccount?> ValidateCredentialsAsync(LoginRequest request, CancellationToken token = default)
    {
        var user = await GetByEmailAsync(request.Email, token);
        if (user == null) return null;

        return BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash) ? user : null;
    }

    public async Task EnsureAdminAsync(string email, string password, CancellationToken token = default)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            _logger.LogWarning("Admin credentials missing in configuration.");
            return;
        }

        var existing = await GetByEmailAsync(email, token);
        if (existing != null) return;

        var request = new RegisterRequest
        {
            Email = email,
            FullName = "Indiaborn Admin",
            Password = password
        };

        await RegisterAsync(request, UserRole.Admin, token);
        _logger.LogInformation("Seeded default admin user.");
    }
}

