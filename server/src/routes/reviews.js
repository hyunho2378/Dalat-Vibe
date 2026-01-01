import express from 'express';
import jwt from 'jsonwebtoken';

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

export default router;
