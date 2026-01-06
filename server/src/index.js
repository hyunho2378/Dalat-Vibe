import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

// Route imports
import authRoutes from './routes/auth.js';
import placesRoutes from './routes/places.js';
import reviewsRoutes from './routes/reviews.js';
import weatherRoutes from './routes/weather.js';
import chatRoutes from './routes/chat.js';

// =============================================================================
// Initialize
// =============================================================================

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// =============================================================================
// Middleware
// =============================================================================

app.use(cors());
app.use(express.json());

// Make Prisma available to routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// =============================================================================
// Routes
// =============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =============================================================================
// Force Seed Route (Temporary - for Render Free Tier without SSH)
// Visit: https://your-app.onrender.com/force-seed to seed the database
// =============================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/force-seed', async (req, res) => {
  try {
    console.log('🚨 FORCE SEED WITH CATEGORY MAPPING 🚨');

    // 1. Clear existing data
    await prisma.favorite.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.place.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('🧹 Database cleared.');

    // 2. Create demo user for reviews
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@dalat.vibe',
        username: 'Traveler',
        passwordHash: 'demo_password_hash'
      }
    });
    console.log('✓ Created demo user');

    // 3. Create ALL categories (for LocalEats page to work)
    const categories = [
      { name: 'Restaurant', nameVi: 'Nhà hàng' },
      { name: 'Street Food', nameVi: 'Ẩm thực đường phố' },
      { name: 'Café', nameVi: 'Quán cà phê' },
      { name: 'Nature', nameVi: 'Thiên nhiên' },
      { name: 'Lake', nameVi: 'Hồ' },
      { name: 'Waterfall', nameVi: 'Thác nước' },
      { name: 'Indoor', nameVi: 'Trong nhà' },
      { name: 'Outdoor', nameVi: 'Ngoài trời' },
      { name: 'Park', nameVi: 'Công viên' },
      { name: 'Adventure', nameVi: 'Phiêu lưu' },
      { name: 'General', nameVi: 'Điểm đến' }
    ];

    const categoryMap = {};
    for (const cat of categories) {
      const created = await prisma.category.create({ data: cat });
      categoryMap[cat.name.toLowerCase()] = created.id;
    }
    console.log(`✓ Created ${categories.length} categories`);

    // 4. Read JSON File
    const dataPath = path.join(__dirname, '../data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    const locations = jsonData.locations || [];

    console.log(`📦 Found ${locations.length} locations`);

    let successCount = 0;
    let reviewCount = 0;

    // 5. Insert Loop with AGGRESSIVE MAPPING
    for (const item of locations) {
      try {
        // ========== TITLE MAPPING ==========
        const title = item.name || item.title || `Place ${item.id}`;
        const titleVi = item.name_vi || item.nameVi || item.titleVi || title;

        // ========== COORDINATES (Critical for Maps) ==========
        const latitude = item.lat != null ? parseFloat(item.lat) : null;
        const longitude = item.lng != null ? parseFloat(item.lng) : null;

        // ========== IMAGES ==========
        const imagePath = item.image || item.imagePath || '';

        // ========== LOCATION/ADDRESS ==========
        const location = item.address || item.location || 'Đà Lạt';
        const locationVi = item.address || item.location || 'Đà Lạt, Việt Nam';

        // ========== DESIGNER TIP (from price_range) ==========
        const designerTip = item.price_range || item.designerTip || null;

        // ========== CATEGORY MAPPING (Critical for LocalEats) ==========
        const itemType = (item.type || '').toLowerCase();
        let categoryId = categoryMap['general']; // default

        // Map type to category
        if (itemType.includes('restaurant') || itemType.includes('dining') || itemType.includes('local')) {
          categoryId = categoryMap['restaurant'];
        } else if (itemType.includes('street') || itemType.includes('food')) {
          categoryId = categoryMap['street food'];
        } else if (itemType.includes('café') || itemType.includes('cafe') || itemType.includes('coffee')) {
          categoryId = categoryMap['café'];
        } else if (itemType.includes('nature') || itemType.includes('scenic')) {
          categoryId = categoryMap['nature'];
        } else if (itemType.includes('lake')) {
          categoryId = categoryMap['lake'];
        } else if (itemType.includes('waterfall')) {
          categoryId = categoryMap['waterfall'];
        } else if (itemType.includes('indoor')) {
          categoryId = categoryMap['indoor'];
        } else if (itemType.includes('outdoor') || itemType.includes('park')) {
          categoryId = categoryMap['outdoor'];
        } else if (itemType.includes('adventure')) {
          categoryId = categoryMap['adventure'];
        }

        // ========== OPENING HOURS ==========
        let openingHours = null;
        if (item.opening_hours) {
          if (typeof item.opening_hours === 'string') {
            openingHours = item.opening_hours;
          } else if (item.opening_hours.text) {
            openingHours = item.opening_hours.text;
          }
        }

        // ========== OTHER FIELDS ==========
        const description = item.description || '';
        const descriptionVi = item.description_vi || item.descriptionVi || description;
        const rating = parseFloat(item.rating) || 4.5;
        const indoorSuitable = itemType.includes('indoor') || itemType.includes('café') || itemType.includes('restaurant');

        // Log first 3 for debugging
        if (successCount < 3) {
          console.log(`📝 [${successCount + 1}] "${title}" | type="${item.type}" | lat=${latitude}, lng=${longitude}`);
        }

        // Create place
        const place = await prisma.place.create({
          data: {
            title,
            titleVi,
            location,
            locationVi,
            description,
            descriptionVi,
            imagePath,
            rating,
            reviewCount: item.reviews?.length || 0,
            categoryId,
            openingHours,
            latitude,
            longitude,
            indoorSuitable,
            designerTip
          }
        });

        // Create reviews
        if (item.reviews && Array.isArray(item.reviews)) {
          for (const r of item.reviews) {
            await prisma.review.create({
              data: {
                title: null,
                content: r.text || r.content || 'Great place!',
                rating: r.rating || 5,
                language: 'en',
                helpful: 0,
                tags: '[]',
                userId: demoUser.id,
                placeId: place.id
              }
            });
            reviewCount++;
          }
        }

        successCount++;
      } catch (itemError) {
        console.error(`❌ Failed: ${item.name || item.id}:`, itemError.message);
      }
    }

    console.log(`✅ SUCCESS: ${successCount} places, ${reviewCount} reviews`);
    res.json({
      success: true,
      places: successCount,
      reviews: reviewCount,
      categories: categories.length
    });

  } catch (error) {
    console.error('🔥 SEED ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================================================
// Error Handler
// =============================================================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// =============================================================================
// Start Server
// =============================================================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: SQLite (Prisma)`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
