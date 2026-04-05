# Yapay Zeka Destekli Bütçe Yönetim Sistemi

Bu depo projenin tüm kaynak kodlarını (Frontend ve Backend) içermektedir.

## Klasör Yapısı

- `frontend/`: Mobil ve Web arayüzü için Flutter projesi (Clean Architecture prensipleriyle organize edilmektedir).
- `backend/`: Node.js, Express ve PostgreSQL kullanılarak oluşturulan, Gemini API destekli Backend servisi.

## Kurulum ve Çalıştırma

1. `backend/` klasörüne gidin ve `npm install` komutunu çalıştırın.
2. `backend/.env.example` dosyasını `backend/.env` olarak kopyalayın ve içerisindeki `DATABASE_URL` ile `GEMINI_API_KEY` değerlerini kendinize göre güncelleyin.
3. Node.js backend sunucusunu ve testleri başlatmak için `backend/` dizininde `npm run dev` komutunu çalıştırın.
