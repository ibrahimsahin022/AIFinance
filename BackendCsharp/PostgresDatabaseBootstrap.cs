using Npgsql;

namespace BudgetApi;

/// <summary>
/// Hedef veritabanı yoksa (3D000) önce <c>postgres</c> veritabanına bağlanıp CREATE DATABASE çalıştırır.
/// </summary>
internal static class PostgresDatabaseBootstrap
{
    internal static void EnsureDatabaseExists(string? connectionString)
    {
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        try
        {
            using var conn = new NpgsqlConnection(connectionString);
            conn.Open();
            return;
        }
        catch (PostgresException ex) when (ex.SqlState == PostgresErrorCodes.InvalidCatalogName)
        {
            // Veritabanı yok; oluşturulacak
        }
        catch (NpgsqlException)
        {
            return;
        }

        NpgsqlConnectionStringBuilder adminCsb;
        try
        {
            adminCsb = new NpgsqlConnectionStringBuilder(connectionString);
        }
        catch
        {
            return;
        }

        var dbName = adminCsb.Database?.Trim();
        if (string.IsNullOrEmpty(dbName))
            return;

        adminCsb.Database = "postgres";

        using var adminConn = new NpgsqlConnection(adminCsb.ConnectionString);
        adminConn.Open();

        var escaped = dbName.Replace("\"", "\"\"");
        using var cmd = new NpgsqlCommand($"CREATE DATABASE \"{escaped}\"", adminConn);
        cmd.ExecuteNonQuery();
    }
}
