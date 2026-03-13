import express from 'express';
import jwt from 'jsonwebtoken';
// 1. 번역 기능을 위해 제미나이 모듈 추가 임포트
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Middleware to get user from token (optional auth)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
        }
    } catch (error) {
        // Token invalid, continue without auth
    }
    next();
};

// Middleware to require auth
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// =============================================================================
// GET /api/reviews - List All Reviews
// =============================================================================

router.get('/', async (req, res) => {
    try {
        const { limit = 50, offset = 0, language } = req.query;

        const where = {};
        if (language) {
            where.language = language;
        }

        const reviews = await req.prisma.review.findMany({
            where,
            include: {
                user: { select: { id: true, username: true, avatar: true } },
                place: { select: { id: true, title: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset)
        });

        const total = await req.prisma.review.count({ where });

        res.json({ reviews, total });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// =============================================================================
// GET /api/reviews/place/:placeId - Get Reviews for a Place
// =============================================================================

router.get('/place/:placeId', async (req, res) => {
    try {
        const { placeId } = req.params;
        const { limit = 20, offset = 0 } = req.query;

        const reviews = await req.prisma.review.findMany({
            where: { placeId: parseInt(placeId) },
            include: {
                user: { select: { id: true, username: true, avatar: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset)
        });

        const total = await req.prisma.review.count({
            where: { placeId: parseInt(placeId) }
        });

        res.json({ reviews, total });
    } catch (error) {
        console.error('Get place reviews error:', error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// =============================================================================
// POST /api/reviews - Create Review (requires auth)
// =============================================================================

router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, content, rating, placeId, language = 'en', tags = [] } = req.body;

        // Validation
        if (!content || !rating || !placeId) {
            return res.status(400).json({ error: 'Content, rating, and placeId are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Check if place exists
        const place = await req.prisma.place.findUnique({
            where: { id: parseInt(placeId) }
        });

        if (!place) {
            return res.status(404).json({ error: 'Place not found' });
        }

        // Create review
        const review = await req.prisma.review.create({
            data: {
                title,
                content,
                rating: parseInt(rating),
                language,
                tags: JSON.stringify(tags),
                userId: req.userId,
                placeId: parseInt(placeId)
            },
            include: {
                user: { select: { id: true, username: true, avatar: true } }
            }
        });

        // Update place rating
        const allReviews = await req.prisma.review.findMany({
            where: { placeId: parseInt(placeId) }
        });

        const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await req.prisma.place.update({
            where: { id: parseInt(placeId) },
            data: {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: allReviews.length
            }
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ error: 'Failed to create review' });
    }
});

// =============================================================================
// POST /api/reviews/:id/helpful - Mark Review as Helpful
// =============================================================================

router.post('/:id/helpful', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const review = await req.prisma.review.update({
            where: { id: parseInt(id) },
            data: { helpful: { increment: 1 } }
        });

        res.json({ helpful: review.helpful });
    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({ error: 'Failed to update' });
    }
});

// =============================================================================
// POST /api/reviews/translate - Translate Review Content (새로 추가된 부분)
// =============================================================================

router.post('/translate', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({ error: 'Text and targetLanguage are required' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'No API Key found' });

        const genAI = new GoogleGenerativeAI(apiKey);
        // 번역은 가볍고 빠른 처리가 중요하므로 가장 안정적인 1.5-flash 모델 권장
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        다음 텍스트를 ${targetLanguage} 언어로 정확하고 자연스럽게 번역해 주세요.
        번역된 결과물 외에 어떠한 인사말, 설명, 마크다운 기호도 덧붙이지 마세요. 오직 번역된 텍스트만 출력하세요.

        번역할 텍스트:
        ${text}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text();

        res.json({ translatedText: translatedText.trim() });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Failed to translate review' });
    }
});

export default router;