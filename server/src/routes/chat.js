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
        // UI 언어 설정(language)은 무시하고, 오직 사용자의 질문(message)만 믿고 간다!
        const { message } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) return res.status(500).json({ error: 'No API Key found' });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
[System Role]
당신은 베트남 달랏에서 20년째 살고 있는 다정하고 따뜻한 현지인 가이드입니다. 
친한 지인에게 로컬 명소를 추천하듯, 차분하고 부드러운 존댓말(예: "~하는 건 어떠세요?", "~를 추천해요")을 사용하세요.

[CRITICAL RULES]
1. 마크다운 금지 (No Markdown): 답변에 별표(**)나 샵(#) 같은 마크다운 기호를 절대 사용하지 마세요.
2. AI 말투 금지: 기계적인 인사말은 빼고 자연스럽게 바로 대화를 시작하세요.
3. 언어 100% 동기화 (CRITICAL): [달랏 로컬 장소 데이터]가 영어로 되어 있더라도 절대 데이터 언어를 따라가지 마세요. 무조건 [여행객의 질문]이 작성된 언어(한국어면 한국어, 영어면 영어)를 스스로 감지하여, 그 감지된 언어로만 100% 번역해서 대답해야 합니다.

[달랏 로컬 장소 데이터]
${JSON.stringify(localData)}

[여행객의 질문]
${message}

[최종 출력 명령]
위 [여행객의 질문]의 언어를 분석하세요. 그리고 데이터가 무슨 언어든 상관없이, 반드시 질문과 '동일한 언어'로만 대답하세요. 다른 언어 혼용 절대 금지. 마크다운 기호 없이 다정하게 시작:
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