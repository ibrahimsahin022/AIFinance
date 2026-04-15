using System;

namespace BudgetApi.DTOs
{
    public class CategoryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "Income" veya "Expense"
    }

    public class CreateTransactionDto
    {
        public string Type { get; set; } = string.Empty; // "Income" veya "Expense"
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public string? Description { get; set; }
        
        // Eğer var olan bir kategori seçilmişse Id yollanabilir
        public Guid? CategoryId { get; set; }
        
        // Eğer yeni kategori eklenecekse burası doldurulur
        public string? NewCategoryName { get; set; }
    }
}
