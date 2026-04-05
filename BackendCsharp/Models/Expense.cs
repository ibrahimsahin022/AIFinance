using System;

namespace BudgetApi.Models
{
    public class Expense
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid UserId { get; set; }
        public User User { get; set; } = null!; // Navigation Property

        public Guid CategoryId { get; set; }
        public Category Category { get; set; } = null!; // Navigation Property

        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
