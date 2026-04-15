using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BudgetApi.Data;
using BudgetApi.DTOs;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BudgetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/categories?type=Expense
        [HttpGet]
        public async Task<IActionResult> GetCategories([FromQuery] string? type)
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
                return Unauthorized(new { message = "Kullanıcı bilgisi geçerli değil." });

            var query = _context.Categories.Where(c => c.UserId == userId);

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(c => c.Type.ToLower() == type.ToLower());
            }

            var categories = await query
                .Select(c => new CategoryDto { Id = c.Id, Name = c.Name, Type = c.Type })
                .ToListAsync();

            return Ok(categories);
        }
    }
}
