import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function restoreData() {
    try {
        console.log('🔄 Starting data restoration...');

        const places = await prisma.place.findMany({
            include: {
                reviews: true,
                category: true
            },
        });

        if (places.length === 0) {
            console.log('❌ No data found in DB.');
            return;
        }

        console.log(`📦 Found ${places.length} places in database`);

        const locations = places.map((place) => ({
            id: place.id,

            // ========== CRITICAL: NAME FIELDS ==========
            name: place.title,                    // DB title -> JSON name
            name_vi: place.titleVi || place.title, // DB titleVi -> JSON name_vi

            // ========== CRITICAL: COORDINATES ==========
            lat: place.latitude,                  // DB latitude -> JSON lat
            lng: place.longitude,                 // DB longitude -> JSON lng

            // ========== CRITICAL: TIP/PRICE ==========
            price_range: place.designerTip,       // DB designerTip -> JSON price_range

            // ========== OTHER FIELDS ==========
            type: place.category?.name || 'Indoor',
            description: place.description || '',
            description_vi: place.descriptionVi || place.description || '',
            google_map_link: place.latitude && place.longitude
                ? `https://maps.google.com/?q=${place.latitude},${place.longitude}`
                : '',
            image: place.imagePath || '',         // DB imagePath -> JSON image
            address: place.location || '',        // DB location -> JSON address
            opening_hours: place.openingHours ? { text: place.openingHours } : null,
            rating: place.rating || 4.5,
            phone: place.phone || null,

            // ========== REVIEWS ==========
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

        // Count reviews
        const totalReviews = places.reduce((sum, p) => sum + p.reviews.length, 0);

        console.log(`✅ SUCCESS! Exported ${locations.length} places with ${totalReviews} reviews`);
        console.log(`📁 File saved at: ${outputPath}`);

        // Log sample to verify
        console.log('\n📋 Sample (first item):');
        console.log(`   name: "${locations[0].name}"`);
        console.log(`   lat: ${locations[0].lat}`);
        console.log(`   lng: ${locations[0].lng}`);
        console.log(`   price_range: "${locations[0].price_range?.substring(0, 50)}..."`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

restoreData();
