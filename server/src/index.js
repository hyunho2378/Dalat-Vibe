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

    // Read data.json
    const dataPath = path.resolve(__dirname, '../data.json');
    if (!fs.existsSync(dataPath)) {
      return res.status(404).json({ error: 'data.json not found' });
    }

    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const locations = jsonData.locations || [];

    if (locations.length === 0) {
      return res.status(400).json({ error: 'No locations found in data.json' });
    }

    // Clear existing data (in correct order due to foreign keys)
    await prisma.favorite.deleteMany();
    await prisma.review.deleteMany();
    await prisma.place.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('✓ Cleared existing data');

    // Create categories from unique types in data.json
    const typeMap = {
      'indoor': { name: 'Indoor', nameVi: 'Trong nhà' },
      'outdoor': { name: 'Outdoor', nameVi: 'Ngoài trời' },
      'waterfall': { name: 'Waterfall', nameVi: 'Thác nước' },
      'cafe': { name: 'Café', nameVi: 'Quán cà phê' },
      'restaurant': { name: 'Restaurant', nameVi: 'Nhà hàng' },
      'viewpoint': { name: 'Scenic', nameVi: 'Phong cảnh' },
      'garden': { name: 'Garden', nameVi: 'Vườn hoa' },
      'adventure': { name: 'Adventure', nameVi: 'Phiêu lưu' }
    };

    // Create all categories
    for (const [type, catData] of Object.entries(typeMap)) {
      await prisma.category.create({ data: catData });
    }
    console.log('✓ Created categories');

    // Get category IDs
    const categories = await prisma.category.findMany();
    const categoryIdMap = {};
    categories.forEach(cat => {
      // Map category name to ID
      for (const [type, catData] of Object.entries(typeMap)) {
        if (catData.name === cat.name) {
          categoryIdMap[type] = cat.id;
        }
      }
    });

    // Insert places
    let insertedCount = 0;
    for (const loc of locations) {
      const categoryId = categoryIdMap[loc.type] || categoryIdMap['outdoor'];

      await prisma.place.create({
        data: {
          title: loc.name,
          titleVi: loc.name_vi,
          location: loc.address || 'Đà Lạt',
          locationVi: loc.address || 'Đà Lạt',
          description: loc.description,
          descriptionVi: loc.description,
          imagePath: loc.image || 'https://via.placeholder.com/400x300',
          rating: 4.5,
          reviewCount: 0,
          categoryId: categoryId,
          openingHours: loc.opening_hours ? `${loc.opening_hours.start} - ${loc.opening_hours.end}` : null,
          phone: loc.phone || null,
          latitude: loc.lat || null,
          longitude: loc.lng || null,
          indoorSuitable: loc.type === 'indoor' || loc.type === 'cafe' || loc.type === 'restaurant',
          designerTip: loc.price_range ? `Price: ${loc.price_range}` : null
        }
      });
      insertedCount++;
    }

    console.log(`✓ Inserted ${insertedCount} places`);
    console.log('🎉 Force seed completed!');

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      stats: {
        categories: Object.keys(typeMap).length,
        places: insertedCount
      }
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
