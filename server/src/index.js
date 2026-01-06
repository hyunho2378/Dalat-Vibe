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
    console.log('🚨 FORCE SEED INITIATED WITH STRICT MAPPING 🚨');

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

    // 3. Create default category
    const defaultCategory = await prisma.category.create({
      data: { name: 'General', nameVi: 'Điểm đến' }
    });
    console.log('✓ Created category');

    // 4. Read JSON File
    const dataPath = path.join(__dirname, '../data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const jsonData = JSON.parse(rawData);
    const locations = jsonData.locations || [];

    console.log(`📦 Found ${locations.length} locations`);

    let successCount = 0;

    // 5. Insert Loop with FORCED MAPPING
    for (const item of locations) {
      try {
        // --- FIX: NAME MAPPING ---
        const title = item.name || "Untitled Place";
        const titleVi = item.name_vi || item.nameVi || item.name || title;

        // --- FIX: TIP MAPPING (Critical) ---
        // The JSON has the tip text in 'price_range'. Map it to 'designerTip'.
        const designerTip = item.price_range || item.designerTip || null;

        // --- FIX: ADDRESS & COORDS ---
        const location = item.address || "Dalat, Vietnam";
        const locationVi = item.address || "Đà Lạt, Việt Nam";
        const latitude = item.lat !== undefined ? parseFloat(item.lat) : null;
        const longitude = item.lng !== undefined ? parseFloat(item.lng) : null;

        // --- FIX: IMAGES ---
        const imagePath = item.image || "";

        // --- FIX: OPENING HOURS ---
        let openingHours = "9:00 AM - 6:00 PM";
        if (item.opening_hours) {
          if (typeof item.opening_hours === 'string') {
            openingHours = item.opening_hours;
          } else if (item.opening_hours.text) {
            openingHours = item.opening_hours.text;
          }
        }

        // --- OTHERS ---
        const description = item.description || "";
        const descriptionVi = item.description_vi || item.description || "";
        const rating = parseFloat(item.rating) || 4.5;
        const reviewCount = item.reviews ? item.reviews.length : 0;
        const indoorSuitable = (item.type || '').toLowerCase().includes('indoor');

        // Log for debugging
        if (successCount < 3) {
          console.log(`📝 [${successCount + 1}] "${title}" | lat=${latitude} | tip="${designerTip?.substring(0, 30)}..."`);
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
            reviewCount,
            categoryId: defaultCategory.id,
            openingHours,
            latitude,
            longitude,
            indoorSuitable,
            designerTip
          }
        });

        // --- REVIEWS ---
        if (item.reviews && Array.isArray(item.reviews)) {
          for (const r of item.reviews) {
            await prisma.review.create({
              data: {
                title: null,
                content: r.text || r.content || "Great place!",
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

        successCount++;
      } catch (itemError) {
        console.error(`❌ Failed: ${item.name || item.id}:`, itemError.message);
      }
    }

    console.log(`✅ SUCCESS: Seeded ${successCount} places with correct names and tips.`);
    res.json({ success: true, count: successCount });

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
