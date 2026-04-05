import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDbConnection } from './config/db.js';
import { testAIPing } from './config/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Budget API Server is running!' });
});

app.listen(PORT, async () => {
    console.log(`🚀 Sunucu ${PORT} portunda başlatıldı.`);

    console.log("-----------------------------------------");
    console.log("Sistem Altyapı Testleri Başlıyor...");
    await testDbConnection();
    await testAIPing();
    console.log("-----------------------------------------");
    console.log("Durdurmak için (CTRL+C) tuşlarına basın.");
});
