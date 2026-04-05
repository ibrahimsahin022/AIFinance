using BudgetApi.Data;
using BudgetApi.DTOs;
using BudgetApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BudgetApi.Services
{
    public interface IAuthService
    {
        Task<(bool Success, string Message)> RegisterAsync(RegisterDto request);
        Task<(bool Success, string Token, string Message)> LoginAsync(LoginDto request);
    }

    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<(bool Success, string Message)> RegisterAsync(RegisterDto request)
        {
            // Veritabanında aynı emaile sahip kullanıcı var mı?
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return (false, "Bu e-posta adresi zaten kullanımda.");

            // BCrypt kullanarak gelen açık şifreyi Hash'leyip saklıyoruz
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PasswordHash = passwordHash
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return (true, "Kayıt işlemi başarılı.");
        }

        public async Task<(bool Success, string Token, string Message)> LoginAsync(LoginDto request)
        {
            // Kullanıcı sorgulanması
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
                return (false, string.Empty, "Kullanıcı bulunamadı.");

            // BCrypt ile kullanıcının girdiği açık şifreyi hashlenmiş şifre ile doğrula
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return (false, string.Empty, "Hatalı şifre.");

            var token = CreateToken(user);
            return (true, token, "Giriş başarılı.");
        }

        // JWT Token Üretme Metodu
        private string CreateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(1), // Token 1 gün geçerli
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
