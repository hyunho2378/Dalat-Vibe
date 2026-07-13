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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Uptime ping target (UptimeRobot) — keeps Render from sleeping
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// =============================================================================
// Seeding Function (Reusable for auto-seed and force-seed)
// =============================================================================

async function runSeedProcess() {
  console.log('🚀 SEEDING DATABASE - RESTORING ALL PLACES (EN/VI) 🚀');

  // 1. Clear all data
  await prisma.favorite.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('🧹 Database cleared.');

  // 2. Create demo user
  const demoUser = await prisma.user.create({
    data: { email: 'demo@dalat.vibe', username: 'Traveler', passwordHash: 'demo' }
  });

  // 3. Create categories
  const catRestaurant = await prisma.category.create({ data: { name: 'Restaurant', nameVi: 'Nhà hàng' } });
  const catStreetFood = await prisma.category.create({ data: { name: 'Street Food', nameVi: 'Ẩm thực đường phố' } });
  const catCafe = await prisma.category.create({ data: { name: 'Café', nameVi: 'Quán cà phê' } });
  const catNature = await prisma.category.create({ data: { name: 'Nature', nameVi: 'Thiên nhiên' } });
  const catGeneral = await prisma.category.create({ data: { name: 'General', nameVi: 'Điểm đến' } });
  console.log('✓ Created categories');

  // 4. Read data.json
  const dataPath = path.join(__dirname, '../data.json');
  const locations = JSON.parse(fs.readFileSync(dataPath, 'utf-8')).locations || [];
  console.log(`📦 Found ${locations.length} locations`);

  let count = 0;

  // 5. Insert each place with EN/VI - PERMANENT DATA: Fill all fields with English fallback
  for (const item of locations) {
    try {
      // TITLE mappings (EN + VI) - Always fill, never NULL
      const title = item.name || item.title || `Place ${item.id}`;
      const titleVi = item.name_vi || title; // Fallback to English if missing

      // DESCRIPTION mappings (EN + VI) - Always fill, never NULL
      const description = item.description || 'A wonderful destination in Dalat';
      const descriptionVi = item.description_vi || description; // Fallback to English if missing

      // LOCATION mappings - Always fill, never NULL
      const location = item.address || 'Đà Lạt';
      const locationVi = item.address || 'Đà Lạt'; // Same for both

      // COORDS
      const latitude = item.lat != null ? parseFloat(item.lat) : 0;
      const longitude = item.lng != null ? parseFloat(item.lng) : 0;

      // CATEGORY mapping
      const itemType = (item.type || '').toLowerCase();
      let categoryId = catGeneral.id;

      if (itemType === 'restaurant' || itemType.includes('dining') || itemType.includes('local')) {
        categoryId = catRestaurant.id;
      } else if (itemType === 'street food' || itemType.includes('street')) {
        categoryId = catStreetFood.id;
      } else if (itemType === 'café' || itemType === 'cafe' || itemType.includes('coffee')) {
        categoryId = catCafe.id;
      } else if (itemType.includes('nature') || itemType.includes('lake') || itemType.includes('waterfall') || itemType.includes('scenic')) {
        categoryId = catNature.id;
      }

      // Create place with all fields filled (permanent data, never NULL)
      const place = await prisma.place.create({
        data: {
          title,
          titleVi,
          description,
          descriptionVi,
          location,
          locationVi,
          imagePath: item.image || '',
          rating: parseFloat(item.rating) || 4.5,
          reviewCount: item.reviews?.length || 0,
          categoryId,
          openingHours: item.opening_hours?.text || null,
          latitude,
          longitude,
          indoorSuitable: itemType.includes('indoor') || itemType.includes('cafe') || itemType.includes('restaurant'),
          designerTip: item.price_range || null
        }
      });

      // Create reviews
      if (item.reviews?.length > 0) {
        for (const r of item.reviews) {
          await prisma.review.create({
            data: {
              title: null,
              content: r.text || r.content || 'Great!',
              rating: r.rating || 5,
              language: 'en',
              helpful: 0,
              tags: '[]',
              userId: demoUser.id,
              placeId: place.id
            }
          });
        }
      }

      count++;
      if (count <= 5) console.log(`✓ [${count}] ${title}`);

    } catch (err) {
      console.error(`❌ ${item.name}: ${err.message}`);
    }
  }

  console.log(`🎉 SUCCESS: ${count} places seeded (EN/VI).`);
  return count;
}

// =============================================================================
// Automatic Self-Seeding on Startup
// =============================================================================

async function checkAndAutoSeed() {
  try {
    // Check if database is empty or has places with NULL title values
    const placeCount = await prisma.place.count();
    const nullTitleCount = await prisma.place.count({
      where: {
        OR: [
          { title: null },
          { title: '' }
        ]
      }
    });

    if (placeCount === 0 || nullTitleCount > 0) {
      console.log('📋 Database check: Empty or has NULL values. Auto-seeding...');
      await runSeedProcess();
    } else {
      console.log(`✅ Database OK: ${placeCount} places found. No seeding needed.`);
    }
  } catch (err) {
    console.error('⚠️ Auto-seed check failed:', err.message);
    // If the check fails (e.g., table doesn't exist), try seeding anyway
    try {
      console.log('📋 Attempting auto-seed due to database error...');
      await runSeedProcess();
    } catch (seedErr) {
      console.error('❌ Auto-seed failed:', seedErr.message);
    }
  }
}

// =============================================================================
// Force Seed Route (Manual trigger if needed)
// =============================================================================

app.get('/force-seed', async (req, res) => {
  try {
    const count = await runSeedProcess();
    res.json({ success: true, message: `All ${count} places restored with EN/VI.` });
  } catch (err) {
    console.error('🔥 SEED ERROR:', err);
    res.status(500).json({ error: err.message });
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
// Start Server (with Auto-Seeding)
// =============================================================================

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: SQLite (Prisma)`);

  // Auto-seed on startup if needed
  await checkAndAutoSeed();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
