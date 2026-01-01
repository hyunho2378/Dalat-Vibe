import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Import đúng chuẩn docs
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// 1. CẤU HÌNH DATA (Giữ nguyên logic đọc file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../../data.json'); 
let localData = [];

// Đọc dữ liệu một lần khi khởi động server
if (fs.existsSync(dataPath)) {
    try {
        localData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        console.log(`✅ Loaded ${localData.length} locations from data.json`);
    } catch (e) { console.error("Error parsing JSON:", e); }
}

// 2. API ROUTE
router.post('/', async (req, res) => {
    try {
        const { message, language = 'vi' } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return res.status(500).json({ error: 'No API Key found' });

        // --- CODE CHUẨN THEO DOCS GOOGLE ---
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // QUAN TRỌNG: Hãy điền tên model bạn tìm thấy ở Bước 1 vào đây.
        // Theo docs hiện tại là "gemini-1.5-flash"
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Language-specific instructions
        const langInstructions = language === 'vi' 
            ? 'Trả lời ngắn gọn bằng tiếng Việt:'
            : 'Answer briefly in English:';

        const roleDescription = language === 'vi'
            ? 'Bạn là hướng dẫn viên du lịch Đà Lạt thân thiện và nhiệt tình.'
            : 'You are a friendly and enthusiastic Dalat travel guide.';

        // Tạo Prompt (Câu lệnh)
        // Kỹ thuật: Nhồi dữ liệu (Context) trực tiếp vào prompt
        const prompt = `
        ${roleDescription} Hãy trả lời câu hỏi dựa trên dữ liệu sau:
        ${JSON.stringify(localData)}
        
        Câu hỏi: ${message}
        ${langInstructions}
        `;

        // Gọi hàm generateContent (đúng chuẩn docs)
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        // -----------------------------------

        res.json({ response: text, success: true });

    } catch (error) {
        console.error("❌ GEMINI ERROR:", error);
        
        // Bắt lỗi 404 cụ thể để báo user
        if (error.message.includes('404') || error.message.includes('not found')) {
            res.status(404).json({ 
                error: 'Model Not Found', 
                message: "Tên Model trong code không khớp với Key. Hãy chạy check_models.js để kiểm tra.",
                details: error.message
            });
        } else {
            res.status(500).json({ error: 'AI Error', details: error.message });
        }
    }
});

export default router;