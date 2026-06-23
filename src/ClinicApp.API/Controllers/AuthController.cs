using ClinicApp.Application.Common.Interfaces;
using ClinicApp.Shared.DTOs.Auth;
using ClinicApp.Shared.Wrappers;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace ClinicApp.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly ITokenService _tokenService;

    public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<string>>> Register([FromBody] RegisterRequestDto dto)
    {
        var user = new IdentityUser { UserName = dto.Email, Email = dto.Email };
        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
            return BadRequest(ApiResponse<string>.FailResult("Registration failed", result.Errors.Select(e => e.Description).ToList()));

        await _userManager.AddToRoleAsync(user, dto.Role);
        return Ok(ApiResponse<string>.SuccessResult(user.Id, "Registration successful"));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginRequestDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return Unauthorized(ApiResponse<LoginResponseDto>.FailResult("Invalid credentials"));

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded)
            return Unauthorized(ApiResponse<LoginResponseDto>.FailResult("Invalid credentials"));

        var roles = await _userManager.GetRolesAsync(user);
        var token = _tokenService.GenerateAccessToken(user.Id, user.Email!, roles);

        return Ok(ApiResponse<LoginResponseDto>.SuccessResult(new LoginResponseDto
        {
            AccessToken = token,
            Email = user.Email!,
            Roles = roles.ToList()
        }, "Login successful"));
    }
}