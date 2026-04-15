using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "categories",
                type: "uuid",
                nullable: true);

            migrationBuilder.Sql(@"
UPDATE categories SET ""UserId"" = sub.""Id""
FROM (SELECT ""Id"" FROM users ORDER BY ""CreatedAt"" LIMIT 1) AS sub
WHERE categories.""UserId"" IS NULL
  AND EXISTS (SELECT 1 FROM users);

DELETE FROM incomes WHERE ""CategoryId"" IN (
  SELECT ""Id"" FROM categories WHERE ""UserId"" IS NULL);
DELETE FROM expenses WHERE ""CategoryId"" IN (
  SELECT ""Id"" FROM categories WHERE ""UserId"" IS NULL);
DELETE FROM categories WHERE ""UserId"" IS NULL;
");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "categories",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_categories_UserId",
                table: "categories",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_categories_users_UserId",
                table: "categories",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_categories_users_UserId",
                table: "categories");

            migrationBuilder.DropIndex(
                name: "IX_categories_UserId",
                table: "categories");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "categories");
        }
    }
}
