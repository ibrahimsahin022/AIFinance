# PostgreSQL kurulumu (Windows) ve bu proje için veritabanı

Bu API, `appsettings.json` içindeki `DefaultConnection` ile PostgreSQL’e bağlanır (varsayılan: `budgetApp` veritabanı, kullanıcı `postgres`).

**Önemli:** `Password=` değeri, PostgreSQL kurulumunda belirlediğiniz `postgres` kullanıcı şifresi ile **birebir aynı** olmalıdır. Örnek dosyada `123456` vardır; sizinki farklıysa `BackendCsharp/appsettings.json` dosyasını düzenleyin.

**Development:** `dotnet run` ile API’yi başlattığınızda uygulama `budgetApp` veritabanını yoksa oluşturmaya çalışır ve ardından EF migration’larını uygular (tablolar oluşur). PostgreSQL servisi çalışıyor ve şifre doğru olmalıdır.

## 1) PostgreSQL’i kurma

**Seçenek A — winget (yönetici PowerShell önerilir)**

Önce paket adını bulun:

```powershell
winget search postgresql
```

Listede görünen resmi PostgreSQL paketini seçip kurun, örnek:

```powershell
winget install PostgreSQL.PostgreSQL.17
```

(Paket kimliği sürüme göre değişebilir; `search` çıktısındaki **Id** sütununu kullanın.)

Kurulum sihirbazında `postgres` kullanıcısı için bir şifre belirleyin; `appsettings.json` içindeki `Password=` ile aynı olmalı.

**Seçenek B — İndirme**

[https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/) adresinden yükleyiciyi indirip kurun. Port olarak **5432** bırakın (bağlantı dizesi buna göre).

Kurulumdan sonra **PostgreSQL servisinin çalıştığını** doğrulayın: Windows’ta “Hizmetler” uygulamasında `postgresql` servisi “Çalışıyor” olmalı.

## 2) Veritabanını oluşturma

**psql ile** (Kurulumla gelen “SQL Shell” veya `psql` PATH’teyse):

```sql
CREATE DATABASE "budgetApp";
```

Şifre/host farklıysa `BackendCsharp/appsettings.json` içindeki `ConnectionStrings:DefaultConnection` değerini kendi ortamınıza göre güncelleyin.

## 3) Tabloları oluşturma (EF Core migration)

Proje klasöründe:

```powershell
cd BackendCsharp
dotnet ef database update
```

Bu komut migration’ları uygular. PostgreSQL çalışmıyorsa veya bağlantı yanlışsa hata alırsınız.

## 4) API’yi çalıştırma

```powershell
dotnet run
```

Varsayılan adres: `http://localhost:5000` (Swagger: `/swagger`).

## Sorun giderme

- **Bağlantı reddedildi:** PostgreSQL servisi kapalı olabilir veya port 5432 engelleniyordur.
- **password authentication failed:** `appsettings.json` içindeki kullanıcı/şifre ile sunucudaki `postgres` şifresi eşleşmiyordur.
- **database "budgetApp" does not exist:** Yukarıdaki `CREATE DATABASE` adımını uygulayın.
