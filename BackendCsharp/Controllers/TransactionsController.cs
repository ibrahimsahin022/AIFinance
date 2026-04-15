using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BudgetApi.Data;
using BudgetApi.DTOs;
using BudgetApi.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BudgetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionDto dto)
        {
            // Kullanıcı ID'sini token üzerinden alıyoruz (Authorize aktif)
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized(new { message = "Kullanıcı bilgisi geçerli değil." });
            }

            Guid actualCategoryId;

            // KATEGORI İŞLEMLERİ
            if (!string.IsNullOrWhiteSpace(dto.NewCategoryName))
            {
                // Kullanıcı yeni bir kategori girmek istemiş
                // Aynı isim ve tipte kategori var mı diye kontrol edelim (önlem olarak)
                var existingCat = _context.Categories.FirstOrDefault(c =>
                    c.UserId == userId &&
                    c.Name.ToLower() == dto.NewCategoryName.ToLower() &&
                    c.Type.ToLower() == dto.Type.ToLower());

                if (existingCat != null)
                {
                    actualCategoryId = existingCat.Id;
                }
                else
                {
                    // Yoksa, yeni kategori oluşturalım
                    var newCategory = new Category
                    {
                        UserId = userId,
                        Name = dto.NewCategoryName.Trim(),
                        Type = dto.Type // "Income" veya "Expense"
                    };
                    _context.Categories.Add(newCategory);
                    await _context.SaveChangesAsync();
                    
                    actualCategoryId = newCategory.Id;
                }
            }
            else if (dto.CategoryId.HasValue)
            {
                var cat = await _context.Categories.FindAsync(dto.CategoryId.Value);
                if (cat == null || cat.UserId != userId)
                    return BadRequest(new { message = "Seçilen kategori bulunamadı veya size ait değil." });
                if (!string.Equals(cat.Type, dto.Type, StringComparison.OrdinalIgnoreCase))
                    return BadRequest(new { message = "Kategori türü ile işlem türü uyuşmuyor." });
                actualCategoryId = cat.Id;
            }
            else
            {
                return BadRequest(new { message = "Lütfen var olan bir kategori seçin veya yeni bir kategori adı girin." });
            }

            // İŞLEMİ KAYDETME (INCOME veya EXPENSE)
            if (dto.Type == "Income")
            {
                var income = new Income
                {
                    UserId = userId,
                    CategoryId = actualCategoryId,
                    Amount = dto.Amount,
                    Date = dto.Date,
                    Description = dto.Description
                };
                _context.Incomes.Add(income);
            }
            else if (dto.Type == "Expense")
            {
                var expense = new Expense
                {
                    UserId = userId,
                    CategoryId = actualCategoryId,
                    Amount = dto.Amount,
                    Date = dto.Date,
                    Description = dto.Description
                };
                _context.Expenses.Add(expense);
            }
            else
            {
                return BadRequest(new { message = "Geçersiz işlem tipi. Lütfen 'Income' veya 'Expense' gönderin." });
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "İşlem başarıyla kaydedildi." });
        }
    }
}
