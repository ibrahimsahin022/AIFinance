-- pgAdmin: postgres veritabanına bağlan → Query Tool → bu satırı çalıştır.
-- psql: psql -U postgres -h localhost -c "CREATE DATABASE \"budgetApp\";"
--
-- "already exists" hatası alırsanız veritabanı zaten vardır; sorun değil.
-- Tablolar için: BackendCsharp'ta `dotnet ef database update` veya `dotnet run` (Development).

CREATE DATABASE "budgetApp";
