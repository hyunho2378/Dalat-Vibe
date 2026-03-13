import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../../data.json');
let localData = [];

if (fs.existsSync(dataPath)) {
    try {
        const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        localData = jsonData.locations || [];
    } catch (e) { console.error("Error parsing JSON:", e); }
}

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return res.status(500).json({ error: 'No API Key found' });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // AI의 자유도를 0%로 만드는 극단적 통제 프롬프트
        const prompt = `
[ABSOLUTE STRICT RULES - 무조건 지킬 것]
1. 분량 통제: 절대 전체 답변이 10줄을 넘겨선 안 됩니다. 각 항목은 반드시 '1문장'으로만 끝내세요.
2. 마크다운 금지: 별표(**)나 샵(#) 기호는 절대 금지합니다.
3. 포맷 강제: 서론, 결론, 인사말, 덧붙이는 말을 절대 쓰지 마세요. 오직 아래 [출력 포맷]과 100% 동일한 구조로만 출력하세요.

[출력 포맷 - 이 양식을 무조건 지킬 것]
질문에 딱 맞는 추천해 드리는 장소는 '[장소명]'입니다. (장소에 대한 다정한 1줄 요약)

- 추천 이유: (반드시 1문장으로 핵심만)
- 날씨 고려: (반드시 1문장으로 짧게)
- 혼잡도: (반드시 1문장으로 짧게)
- 운영 시간: (예: 08:00 - 22:00)
- 가격대: (예: 50,000 VND)

[달랏 로컬 장소 데이터]
${JSON.stringify(localData)}

[여행객의 질문]
${message}

[최종 출력 명령]
위 [여행객의 질문]을 분석하고, 질문과 동일한 언어로, 오직 지정된 [출력 포맷] 형태 그대로만 지금 바로 출력하세요:
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text, success: true });

    } catch (error) {
        console.error("❌ GEMINI ERROR:", error);
        res.status(500).json({ error: 'AI Error', details: error.message });
    }
});

export default router;