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

    // Read data.json reliably
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

    // Clear existing data (in correct order due to foreign keys)
    await prisma.favorite.deleteMany();
    await prisma.review.deleteMany();
    await prisma.place.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('✓ Cleared existing data');

    // Create demo user for reviews
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@dalat.vibe',
        username: 'Traveler',
        passwordHash: 'demo_password_hash',
        avatar: null
      }
    });
    console.log('✓ Created demo user');

    // Create categories from unique types in data.json
    const typeMap = {
      'indoor': { name: 'Indoor', nameVi: 'Trong nhà' },
      'outdoor': { name: 'Outdoor', nameVi: 'Ngoài trời' },
      'waterfall': { name: 'Waterfall', nameVi: 'Thác nước' },
      'cafe': { name: 'Café', nameVi: 'Quán cà phê' },
      'restaurant': { name: 'Restaurant', nameVi: 'Nhà hàng' },
      'viewpoint': { name: 'Scenic', nameVi: 'Phong cảnh' },
      'garden': { name: 'Garden', nameVi: 'Vườn hoa' },
      'adventure': { name: 'Adventure', nameVi: 'Phiêu lưu' },
      'Indoor': { name: 'Indoor', nameVi: 'Trong nhà' }
    };

    // Create all categories
    const createdCategories = [];
    for (const [type, catData] of Object.entries(typeMap)) {
      // Check if category already exists
      const existing = createdCategories.find(c => c.name === catData.name);
      if (!existing) {
        const cat = await prisma.category.create({ data: catData });
        createdCategories.push(cat);
      }
    }
    console.log(`✓ Created ${createdCategories.length} categories`);

    // Build category ID map
    const categoryIdMap = {};
    for (const cat of createdCategories) {
      for (const [type, catData] of Object.entries(typeMap)) {
        if (catData.name === cat.name) {
          categoryIdMap[type] = cat.id;
        }
      }
    }

    // Insert places with proper field mapping
    let insertedCount = 0;
    let reviewCount = 0;
    const errors = [];

    for (const loc of locations) {
      try {
        // Get category ID (default to 'outdoor' if type not found)
        const locType = (loc.type || 'outdoor').toLowerCase();
        const categoryId = categoryIdMap[locType] || categoryIdMap['outdoor'] || createdCategories[0]?.id;

        // Parse opening_hours - handle both object and string formats
        let openingHoursStr = null;
        if (loc.opening_hours) {
          if (typeof loc.opening_hours === 'string') {
            openingHoursStr = loc.opening_hours;
          } else if (loc.opening_hours.text) {
            openingHoursStr = loc.opening_hours.text;
          } else if (loc.opening_hours.start && loc.opening_hours.end) {
            openingHoursStr = `${loc.opening_hours.start} - ${loc.opening_hours.end}`;
          }
        }

        // Create place with correct field mapping: JSON -> Prisma schema
        const place = await prisma.place.create({
          data: {
            title: loc.name || 'Untitled',                    // name -> title
            titleVi: loc.name_vi || loc.name || 'Untitled',   // name_vi -> titleVi
            location: loc.address || 'Đà Lạt',                // address -> location
            locationVi: loc.address || 'Đà Lạt',
            description: loc.description || '',
            descriptionVi: loc.description_vi || loc.description || '',  // description_vi -> descriptionVi
            imagePath: loc.image || 'https://via.placeholder.com/400x300',  // image -> imagePath
            rating: loc.rating || 4.5,
            reviewCount: loc.reviews?.length || 0,
            categoryId: categoryId,
            openingHours: openingHoursStr,
            phone: loc.phone || null,
            latitude: loc.lat || null,                        // lat -> latitude
            longitude: loc.lng || null,                       // lng -> longitude
            indoorSuitable: locType === 'indoor' || locType === 'cafe' || locType === 'restaurant',
            designerTip: loc.google_map_link || null
          }
        });
        insertedCount++;

        // Create reviews if they exist
        if (loc.reviews && Array.isArray(loc.reviews) && loc.reviews.length > 0) {
          for (const review of loc.reviews) {
            try {
              await prisma.review.create({
                data: {
                  title: review.title || null,
                  content: review.text || review.content || 'Great place!',
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
              console.warn(`⚠️ Failed to create review for ${loc.name}:`, reviewErr.message);
            }
          }
        }

      } catch (itemErr) {
        console.error(`❌ Failed to insert "${loc.name || 'unknown'}":`, itemErr.message);
        errors.push({ name: loc.name, error: itemErr.message });
      }
    }

    console.log(`✓ Inserted ${insertedCount} places`);
    console.log(`✓ Inserted ${reviewCount} reviews`);
    if (errors.length > 0) {
      console.log(`⚠️ ${errors.length} items failed`);
    }
    console.log('🎉 Force seed completed!');

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      stats: {
        categories: createdCategories.length,
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
      message: error.message
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
