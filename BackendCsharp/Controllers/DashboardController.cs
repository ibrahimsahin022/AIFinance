using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BudgetApi.Data;
using BudgetApi.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BudgetApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized(new { message = "Kullanıcı bilgisi geçerli değil." });

            var now = DateTime.UtcNow;
            var startThisMonth = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var startLastMonth = startThisMonth.AddMonths(-1);
            var startNextMonth = startThisMonth.AddMonths(1);

            var totalIncome = await _context.Incomes
                .Where(i => i.UserId == userId)
                .SumAsync(i => (decimal?)i.Amount) ?? 0m;
            var totalExpense = await _context.Expenses
                .Where(e => e.UserId == userId)
                .SumAsync(e => (decimal?)e.Amount) ?? 0m;

            var monthlyIncome = await _context.Incomes
                .Where(i => i.UserId == userId && i.Date >= startThisMonth && i.Date < startNextMonth)
                .SumAsync(i => (decimal?)i.Amount) ?? 0m;
            var monthlyExpense = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= startThisMonth && e.Date < startNextMonth)
                .SumAsync(e => (decimal?)e.Amount) ?? 0m;

            var lastMonthIncome = await _context.Incomes
                .Where(i => i.UserId == userId && i.Date >= startLastMonth && i.Date < startThisMonth)
                .SumAsync(i => (decimal?)i.Amount) ?? 0m;
            var lastMonthExpense = await _context.Expenses
                .Where(e => e.UserId == userId && e.Date >= startLastMonth && e.Date < startThisMonth)
                .SumAsync(e => (decimal?)e.Amount) ?? 0m;

            var thisNet = monthlyIncome - monthlyExpense;
            var lastNet = lastMonthIncome - lastMonthExpense;
            decimal? pct = null;
            if (lastNet != 0m)
                pct = Math.Round((thisNet - lastNet) / Math.Abs(lastNet) * 100m, 1);
            else if (thisNet != 0m)
                pct = null;

            var dto = new DashboardSummaryDto
            {
                TotalBalance = totalIncome - totalExpense,
                MonthlyIncome = monthlyIncome,
                MonthlyExpense = monthlyExpense,
                MonthOverMonthNetChangePercent = pct
            };

            return Ok(dto);
        }

        [HttpGet("transactions")]
        public async Task<IActionResult> GetRecentTransactions([FromQuery] int take = 30)
        {
            if (!TryGetUserId(out var userId))
                return Unauthorized(new { message = "Kullanıcı bilgisi geçerli değil." });

            take = Math.Clamp(take, 1, 200);

            var incomeRows = await _context.Incomes
                .AsNoTracking()
                .Where(i => i.UserId == userId)
                .Include(i => i.Category)
                .Select(i => new TransactionRowDto
                {
                    Id = i.Id,
                    Type = "Income",
                    Amount = i.Amount,
                    Date = i.Date,
                    Description = i.Description,
                    CategoryName = i.Category.Name
                })
                .ToListAsync();

            var expenseRows = await _context.Expenses
                .AsNoTracking()
                .Where(e => e.UserId == userId)
                .Include(e => e.Category)
                .Select(e => new TransactionRowDto
                {
                    Id = e.Id,
                    Type = "Expense",
                    Amount = e.Amount,
                    Date = e.Date,
                    Description = e.Description,
                    CategoryName = e.Category.Name
                })
                .ToListAsync();

            var merged = new List<TransactionRowDto>(incomeRows.Count + expenseRows.Count);
            merged.AddRange(incomeRows);
            merged.AddRange(expenseRows);
            merged.Sort((a, b) => b.Date.CompareTo(a.Date));

            return Ok(new DashboardTransactionsResponseDto
            {
                Items = merged.Take(take).ToList()
            });
        }

        private bool TryGetUserId(out Guid userId)
        {
            userId = Guid.Empty;
            var raw = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return !string.IsNullOrEmpty(raw) && Guid.TryParse(raw, out userId);
        }
    }
}
