using Microsoft.AspNetCore.Mvc;
using BudgetApi.DTOs;
using BudgetApi.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace BudgetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST /api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            var result = await _authService.RegisterAsync(request);
            if (!result.Success)
                return BadRequest(new { message = result.Message });

            return Ok(new { message = result.Message });
        }

        // POST /api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var result = await _authService.LoginAsync(request);
            if (!result.Success)
                return Unauthorized(new { message = result.Message });

            return Ok(new AuthResponseDto { Token = result.Token, Message = result.Message });
        }

        // Güvenli test Endpoint'i. Yalnızca Token gönderen istekler çağırabilir.
        [HttpGet("me"), Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

            return Ok(new { UserId = userId, UserEmail = userEmail });
        }
    }
}
