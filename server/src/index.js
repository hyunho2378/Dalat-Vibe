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

        // ========== CATEGORY MAPPING (Critical for LocalEats/Home) ==========
        const itemType = (item.type || '').trim();
        const itemTypeLower = itemType.toLowerCase();
        let categoryId = categoryMap['general']; // default
        let assignedCategory = 'General';

        // DIRECT MATCH first (for exact types like "Restaurant", "Street Food", "Café")
        if (itemType === 'Restaurant') {
          categoryId = categoryMap['restaurant'];
          assignedCategory = 'Restaurant';
        } else if (itemType === 'Street Food') {
          categoryId = categoryMap['street food'];
          assignedCategory = 'Street Food';
        } else if (itemType === 'Café' || itemType === 'Cafe') {
          categoryId = categoryMap['café'];
          assignedCategory = 'Café';
        } else if (itemType === 'Nature' || itemType === 'Scenic') {
          categoryId = categoryMap['nature'];
          assignedCategory = 'Nature';
        } else if (itemType === 'Waterfall') {
          categoryId = categoryMap['waterfall'];
          assignedCategory = 'Waterfall';
        } else if (itemType === 'Lake') {
          categoryId = categoryMap['lake'];
          assignedCategory = 'Lake';
        } else if (itemType === 'Adventure') {
          categoryId = categoryMap['adventure'];
          assignedCategory = 'Adventure';
        } else if (itemType === 'Park' || itemType === 'Garden') {
          categoryId = categoryMap['park'];
          assignedCategory = 'Park';
        }
        // FALLBACK: includes-based matching for partial matches
        else if (itemTypeLower.includes('restaurant') || itemTypeLower.includes('dining') || itemTypeLower.includes('local')) {
          categoryId = categoryMap['restaurant'];
          assignedCategory = 'Restaurant';
        } else if (itemTypeLower.includes('street') || itemTypeLower.includes('food')) {
          categoryId = categoryMap['street food'];
          assignedCategory = 'Street Food';
        } else if (itemTypeLower.includes('café') || itemTypeLower.includes('cafe') || itemTypeLower.includes('coffee')) {
          categoryId = categoryMap['café'];
          assignedCategory = 'Café';
        } else if (itemTypeLower.includes('indoor') || itemTypeLower.includes('architecture') || itemTypeLower.includes('temple') || itemTypeLower.includes('historic')) {
          categoryId = categoryMap['indoor'];
          assignedCategory = 'Indoor';
        } else if (itemTypeLower.includes('outdoor')) {
          categoryId = categoryMap['outdoor'];
          assignedCategory = 'Outdoor';
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

        // Log first 5 for debugging
        if (successCount < 5) {
          console.log(`📝 [${successCount + 1}] "${title}" | type="${item.type}" → category="${assignedCategory}"`);
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
