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
    console.log('🌱 Starting force seed...');

    // 1. Read data.json
    const dataPath = path.join(__dirname, '../data.json');
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'data.json not found at: ' + dataPath });
    }

    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const locations = jsonData.locations || [];

    if (locations.length === 0) {
      return res.status(400).json({ error: 'No locations found in data.json' });
    }

    console.log(`📦 Found ${locations.length} locations in data.json`);

    // 2. DEBUG: Log the first item's keys
    const firstItem = locations[0];
    console.log('🔍 DEBUG - Keys:', Object.keys(firstItem));

    // 3. Clear existing data
    await prisma.favorite.deleteMany();
    await prisma.review.deleteMany();
    await prisma.place.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('✓ Cleared existing data');

    // 4. Create demo user
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@dalat.vibe',
        username: 'Traveler',
        passwordHash: 'demo_password_hash',
        avatar: null
      }
    });
    console.log('✓ Created demo user');

    // 5. Create category
    const defaultCategory = await prisma.category.create({
      data: { name: 'General', nameVi: 'Điểm đến' }
    });
    console.log('✓ Created category');

    // 6. Insert places with COMPLETE field mapping
    let insertedCount = 0;
    let reviewCount = 0;
    const errors = [];

    for (const item of locations) {
      try {
        // ========== TITLE MAPPING ==========
        // Try: name -> title (data.json format)
        // Or:  title -> title (seed.js format)
        const title = item.name || item.title || `Dalat Place #${item.id}`;
        const titleVi = item.name_vi || item.nameVi || item.titleVi || title;

        // ========== IMAGE MAPPING ==========
        // Try: image -> imagePath (data.json format)
        // Or:  imagePath -> imagePath (seed.js format)
        const imagePath = item.image || item.imagePath || 'https://via.placeholder.com/400x300';

        // ========== LOCATION/ADDRESS MAPPING ==========
        // Try: address -> location (data.json format)
        // Or:  location -> location (seed.js format)
        const location = item.address || item.location || 'Đà Lạt';
        const locationVi = item.address || item.locationVi || item.location || 'Đà Lạt';

        // ========== DESCRIPTION MAPPING ==========
        const description = item.description || '';
        const descriptionVi = item.description_vi || item.descriptionVi || description;

        // ========== COORDINATES MAPPING ==========
        // Try: lat/lng (data.json format)  
        // Or:  latitude/longitude (seed.js format)
        // Parse as Float to ensure valid numbers
        let latitude = null;
        if (item.lat !== undefined && item.lat !== null) {
          latitude = parseFloat(item.lat);
        } else if (item.latitude !== undefined && item.latitude !== null) {
          latitude = parseFloat(item.latitude);
        }

        let longitude = null;
        if (item.lng !== undefined && item.lng !== null) {
          longitude = parseFloat(item.lng);
        } else if (item.longitude !== undefined && item.longitude !== null) {
          longitude = parseFloat(item.longitude);
        }

        // ========== OPENING HOURS MAPPING ==========
        let openingHours = null;
        if (item.opening_hours) {
          if (typeof item.opening_hours === 'string') {
            openingHours = item.opening_hours;
          } else if (item.opening_hours.text) {
            openingHours = item.opening_hours.text;
          } else if (item.opening_hours.start && item.opening_hours.end) {
            openingHours = `${item.opening_hours.start} - ${item.opening_hours.end}`;
          }
        } else if (item.openingHours) {
          openingHours = item.openingHours;
        }

        // ========== DESIGNER TIP / PRICE MAPPING ==========
        // Map: price_range OR google_map_link -> designerTip
        const designerTip = item.price_range || item.designerTip || item.google_map_link || null;

        // ========== OTHER FIELDS ==========
        const rating = parseFloat(item.rating) || 4.5;
        const phone = item.phone || null;
        const indoorSuitable = (item.type || '').toLowerCase().includes('indoor') ||
          (item.type || '').toLowerCase().includes('cafe') ||
          (item.type || '').toLowerCase().includes('restaurant');

        // Log first 3 items for debugging
        if (insertedCount < 3) {
          console.log(`📝 [${insertedCount + 1}] title="${title}", lat=${latitude}, lng=${longitude}, image="${imagePath?.substring(0, 40)}..."`);
        }

        // Create the place record
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
            categoryId: defaultCategory.id,
            openingHours,
            phone,
            latitude,
            longitude,
            indoorSuitable,
            designerTip
          }
        });
        insertedCount++;

        // Create reviews if they exist
        if (item.reviews && Array.isArray(item.reviews)) {
          for (const review of item.reviews) {
            try {
              await prisma.review.create({
                data: {
                  title: review.title || null,
                  content: review.text || review.content || 'Great experience!',
                  rating: review.rating || 5,
                  language: 'en',
                  helpful: 0,
                  tags: '[]',
                  userId: demoUser.id,
                  placeId: place.id
                }
              });
              reviewCount++;
            } catch (reviewErr) {
              console.warn(`⚠️ Review error: ${reviewErr.message}`);
            }
          }
        }

      } catch (itemErr) {
        console.error(`❌ Failed item ${item.id}: ${itemErr.message}`);
        errors.push({ id: item.id, error: itemErr.message });
      }
    }

    console.log(`✓ Inserted ${insertedCount} places`);
    console.log(`✓ Inserted ${reviewCount} reviews`);
    console.log('🎉 Force seed completed!');

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      debug: {
        firstItemKeys: Object.keys(firstItem),
        hasName: !!firstItem.name,
        hasTitle: !!firstItem.title,
        hasLat: !!firstItem.lat,
        hasLatitude: !!firstItem.latitude
      },
      stats: {
        places: insertedCount,
        reviews: reviewCount,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ Force seed failed:', error);
    res.status(500).json({
      error: 'Seed failed',
      message: error.message,
      stack: error.stack
    });
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
