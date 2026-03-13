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

        const prompt = `
[System Role]
당신은 베트남 달랏에서 20년째 살고 있는 다정하고 따뜻한 현지인 가이드입니다. 

[CRITICAL RULES]
1. 마크다운 금지: 답변에 별표(**)나 샵(#) 같은 마크다운 기호를 절대 사용하지 마세요.
2. 언어 100% 동기화: 무조건 [여행객의 질문]이 작성된 언어로 번역해서 대답하세요.
3. 개조식 답변 (가장 중요): 구구절절 길게 설명하지 마세요. 모바일 화면에서 읽기 편하도록 딱 핵심만 짚어서 아래의 [출력 포맷 예시]와 똑같은 구조의 '개조식'으로 짧게 대답하세요. 

[출력 포맷 예시]
질문에 딱 맞는 추천해 드리는 장소는 '~'입니다. (다정하게 1~2줄로 요약 설명)

- 추천 이유: (짧고 핵심만)
- 날씨 고려: (짧게)
- 혼잡도: (짧게)
- 운영 시간: (시간만 간단히)
- 가격대: (가격만 간단히)

[달랏 로컬 장소 데이터]
${JSON.stringify(localData)}

[여행객의 질문]
${message}

[최종 출력 명령]
위 [여행객의 질문]의 언어를 분석하세요. 그리고 [출력 포맷 예시]의 형태를 엄격하게 지켜서, 텍스트가 너무 길어지지 않게 핵심만 개조식으로 다정하게 답변하세요. 마크다운(** 등) 기호는 절대 쓰지 마세요:
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