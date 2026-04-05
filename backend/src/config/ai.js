import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && !apiKey.includes("BURAYA")) {
    genAI = new GoogleGenerativeAI(apiKey);
}

export const testAIPing = async () => {
    try {
        if (!genAI) {
            console.log("⚠️ GEMINI_API_KEY .env dosyasında geçerli tanımlanmadığı için AI testi atlanıyor.");
            return;
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = "Sadece şu cümleyi döndür ve başka hiçbir şey ekleme: 'Merhaba, Gemini API bağlantısı başarılı!'";

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("✅ Yapay Zeka (Gemini Test) Yanıtı:", text.trim());
    } catch (error) {
        console.error("❌ Gemini API Bağlantı Hatası:", error.message);
    }
}
