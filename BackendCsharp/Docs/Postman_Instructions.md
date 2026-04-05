# REST API - Postman Test Rehberi

Kodlarınızı başarıyla çalıştırdıktan sonra (`dotnet run` komutu ile), oluşturduğumuz modülleri aşağıdaki şekilde Postman'de test edebilirsiniz. Swagger otomatik kurulduğu için `https://localhost:<port>/swagger` adresine girip oradan da hızlı test yapabilirsiniz!

## 1. Kayıt Ol (Register)
Veritabanına eklenecek yeni kullanıcıyı güvenli bir şekilde kaydeder (Şifre BCrypt ile hashlenir).
- **Metot:** `POST`
- **URL:** `https://localhost:<port>/api/auth/register`
- **Body:** Sekmesinden `raw` ve tipini `JSON` seçin. İlgili veri:
```json
{
  "firstName": "Ahmet",
  "lastName": "Yilmaz",
  "email": "test@test.com",
  "password": "sifrem"
}
```

## 2. Giriş Yap (Login)
Oluşturduğunuz hesapla giriş yaparak token talep edin.
- **Metot:** `POST`
- **URL:** `https://localhost:<port>/api/auth/login`
- **Body:** Sekmesinden `raw` ve `JSON` seçerek:
```json
{
  "email": "test@test.com",
  "password": "sifrem"
}
```
**Sonuç:** Bu istek size uzun bir string olarak `"token"` döndürecektir.

## 3. Yetkili (Giriş Yapmış Kullanıcı) Endpoints
Sistem, API'lerin yabancılar tarafından erişilmesini engeller(`[Authorize]` etiketi sayesinde).
Bu yüzden sadece token ile çağırabileceğimiz test endpoint'ine nasıl ulaşacağımızı görelim:

- **Metot:** `GET`
- **URL:** `https://localhost:<port>/api/auth/me`
- **Yetkilendirme İşlemi:** 
  1. Postman'de en üstteki **"Authorization"** sekmesine gidin.
  2. Sol kısımdaki **Type** kısmını **"Bearer Token"** olarak seçin.
  3. Sağ tarafta açılan **Token** boşluğuna **Login** aşamasından kopyaladığınız uzun Token bilgisini yapıştırıp Gönder tuşuna (Send) basın!

**Sonuç:** Token içinde bulunan veriler çözümlenir (Kullanıcı ID ve Email adresiniz dönülür).
