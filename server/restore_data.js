import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function restoreData() {
    try {
        console.log('🔄 Starting data restoration (including Reviews)...');

        const places = await prisma.place.findMany({
            include: {
                reviews: true,
                category: true
            },
        });

        if (places.length === 0) {
            console.log('❌ No data found in DB. Please check Prisma Studio.');
            return;
        }

        console.log(`📦 Found ${places.length} places in database`);

        // Count reviews
        const totalReviews = places.reduce((sum, p) => sum + p.reviews.length, 0);
        console.log(`📝 Found ${totalReviews} reviews in database`);

        const locations = places.map((place) => ({
            id: place.id,
            // CRITICAL: Map Prisma 'title' -> JSON 'name'
            name: place.title,
            name_vi: place.titleVi || place.title,
            type: place.category?.name || 'Indoor',
            description: place.description || '',
            description_vi: place.descriptionVi || place.description || '',
            lat: place.latitude,
            lng: place.longitude,
            google_map_link: place.latitude && place.longitude
                ? `https://maps.google.com/?q=${place.latitude},${place.longitude}`
                : '',
            // CRITICAL: Map Prisma 'imagePath' -> JSON 'image'
            image: place.imagePath || '',
            // CRITICAL: Map Prisma 'location' -> JSON 'address'
            address: place.location || '',
            opening_hours: place.openingHours ? { text: place.openingHours } : null,
            rating: place.rating || 4.5,
            phone: place.phone || null,
            reviews: place.reviews.map((review) => ({
                id: review.id,
                author: 'Traveler',
                text: review.content || '',
                rating: review.rating || 5,
                date: review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : '2023-01-01',
            })),
        }));

        const output = { locations };
        const outputPath = path.join(__dirname, 'data.json');

        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

        console.log(`✅ Success! Exported ${locations.length} places with ${totalReviews} reviews to data.json`);
        console.log(`📁 File saved at: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

restoreData();
