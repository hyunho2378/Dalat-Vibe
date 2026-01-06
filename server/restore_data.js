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
            },
        });

        if (places.length === 0) {
            console.log('❌ No data found in DB. Please check Prisma Studio.');
            return;
        }

        const locations = places.map((place) => ({
            id: place.id,
            name: place.name,
            name_vi: place.name_vi || place.name,
            type: place.type || 'Indoor',
            description: place.description || '',
            description_vi: place.descriptionVi || '',
            lat: place.lat,
            lng: place.lng,
            google_map_link: place.google_map_link || '',
            image: place.imagePath || '',
            address: place.location || '',
            opening_hours: place.openingHours ? { text: place.openingHours } : null,
            rating: place.rating || 4.5,
            reviews: place.reviews.map((review) => ({
                id: review.id,
                author: review.author || 'Traveler',
                text: review.text || review.content || '',
                rating: review.rating || 5,
                date: review.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : '2023-01-01',
            })),
        }));

        const output = { locations };
        const outputPath = path.join(__dirname, 'data.json');

        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

        console.log(`✅ Success! Exported ${locations.length} places with reviews to data.json`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

restoreData();
