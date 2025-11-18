using Indiaborn.Api.DTOs;
using Indiaborn.Api.Models;
using Indiaborn.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Indiaborn.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly JwtService _jwtService;

    public AuthController(UserService userService, JwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request, CancellationToken token)
    {
        var user = await _userService.RegisterAsync(request, UserRole.Customer, token);
        var response = new AuthResponse
        {
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            Token = _jwtService.GenerateToken(user)
        };
        return Created(string.Empty, response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request, CancellationToken token)
    {
        var user = await _userService.ValidateCredentialsAsync(request, token);
        if (user is null) return Unauthorized();

        return new AuthResponse
        {
            Email = user.Email,
            FullName = user.FullName,
            Role = user.Role,
            Token = _jwtService.GenerateToken(user)
        };
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<AuthResponse> Me()
    {
        return new AuthResponse
        {
            Email = User.FindFirst("email")?.Value ?? string.Empty,
            FullName = User.Identity?.Name ?? string.Empty,
            Role = Enum.TryParse<UserRole>(User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value, out var role) ? role : UserRole.Customer,
            Token = string.Empty
        };
    }
}

