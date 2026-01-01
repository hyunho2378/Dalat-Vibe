// File: D:\Dalat_SmartRoute_AI\server\check_models.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

// Load biến môi trường
dotenv.config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ LỖI: Không tìm thấy GEMINI_API_KEY trong file .env");
    console.error("👉 Hãy kiểm tra lại file .env của bạn.");
    return;
  }

  console.log("🔑 Đang dùng Key:", apiKey.substring(0, 8) + "...");
  console.log("⏳ Đang kết nối tới Google để lấy danh sách model...");

  try {
    // Gọi API lấy danh sách model
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.error) {
        console.error("❌ LỖI API:", data.error.message);
        console.log("💡 Gợi ý: API Key này có thể bị lỗi hoặc chưa kích hoạt.");
        return;
    }

    console.log("\n✅ KẾT QUẢ: Danh sách Model mà Key của bạn được phép dùng:");
    console.log("==================================================");
    
    // Lọc các model hỗ trợ chat
    const chatModels = data.models?.filter(m => m.supportedGenerationMethods.includes("generateContent"));

    if (!chatModels || chatModels.length === 0) {
        console.log("⚠️ Không tìm thấy model nào hỗ trợ chat. Key của bạn có vấn đề.");
    } else {
        chatModels.forEach(m => {
            // In ra tên model (bỏ chữ models/ ở đầu đi cho dễ copy)
            console.log(`🔹 Tên: "${m.name.replace('models/', '')}"`);
        });
    }
    console.log("==================================================");
    console.log("👉 Hãy copy một trong các tên trên (ví dụ: gemini-1.5-flash) vào file chat.js");

  } catch (error) {
    console.error("❌ Lỗi kết nối mạng hoặc lỗi cú pháp:", error);
  }
}

checkModels();