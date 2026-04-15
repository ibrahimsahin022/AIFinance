using System;
using System.Collections.Generic;

namespace BudgetApi.DTOs
{
    public class DashboardSummaryDto
    {
        public decimal TotalBalance { get; set; }
        public decimal MonthlyIncome { get; set; }
        public decimal MonthlyExpense { get; set; }
        public decimal? MonthOverMonthNetChangePercent { get; set; }
    }

    public class TransactionRowDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        public string CategoryName { get; set; } = string.Empty;
    }

    public class DashboardTransactionsResponseDto
    {
        public List<TransactionRowDto> Items { get; set; } = new();
    }
}
