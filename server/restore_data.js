import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function restoreData() {
    console.log('🔄 Starting data export from Prisma database...');

    try {
        // Fetch all places with their categories and reviews
        const places = await prisma.place.findMany({
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: { id: true, username: true }
                        }
                    }
                }
            }
        });

        console.log(`📦 Found ${places.length} places in database`);

        // Count total reviews
        const totalReviews = places.reduce((sum, p) => sum + p.reviews.length, 0);
        console.log(`📝 Found ${totalReviews} reviews in database`);

        // Transform to data.json format
        const locations = places.map((place, index) => ({
            id: index + 1,
            name: place.title,
            name_vi: place.titleVi || place.title,
            type: mapCategoryToType(place.category?.name),
            description: place.descriptionVi || place.description,
            opening_hours: parseOpeningHours(place.openingHours),
            lat: place.latitude,
            lng: place.longitude,
            google_map_link: place.latitude && place.longitude
                ? `https://maps.google.com/?q=${place.latitude},${place.longitude}`
                : null,
            best_weather: getBestWeather(place.category?.name, place.indoorSuitable),
            image: place.imagePath,
            address: place.location,
            phone: place.phone,
            price_range: place.designerTip?.replace('Price: ', '') || null,
            rating: place.rating,
            reviewCount: place.reviewCount,
            // Include reviews array
            reviews: place.reviews.map(review => ({
                id: review.id,
                title: review.title,
                content: review.content,
                rating: review.rating,
                language: review.language,
                helpful: review.helpful,
                username: review.user?.username || 'Anonymous',
                createdAt: review.createdAt
            }))
        }));

        // Write to data.json
        const outputPath = path.resolve(__dirname, 'data.json');
        const jsonData = {
            locations: locations
        };

        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 4), 'utf-8');

        console.log(`✅ Successfully exported ${locations.length} locations to data.json`);
        console.log(`📁 File saved at: ${outputPath}`);

    } catch (error) {
        console.error('❌ Export failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Helper: Map category name to type
function mapCategoryToType(categoryName) {
    const typeMap = {
        'Indoor': 'indoor',
        'Outdoor': 'outdoor',
        'Nature': 'viewpoint',
        'Lake': 'viewpoint',
        'Café': 'cafe',
        'Waterfall': 'waterfall',
        'Street': 'outdoor',
        'Architecture': 'indoor',
        'Historic Stay': 'indoor',
        'Adventure': 'adventure',
        'Park': 'outdoor',
        'Local Experience': 'outdoor',
        'Scenic': 'viewpoint',
        'Restaurant': 'restaurant',
        'Street Food': 'restaurant',
        'Temple': 'indoor',
        'Garden': 'garden'
    };
    return typeMap[categoryName] || 'outdoor';
}

// Helper: Parse opening hours string to object
function parseOpeningHours(hoursString) {
    if (!hoursString) return null;

    // Handle "Open 24 hours" case
    if (hoursString.toLowerCase().includes('24')) {
        return { start: '00:00', end: '23:59' };
    }

    // Parse "HH:MM AM/PM - HH:MM AM/PM" or "HH:MM - HH:MM" format
    const parts = hoursString.split(' - ');
    if (parts.length === 2) {
        return {
            start: convertTo24Hour(parts[0].trim()),
            end: convertTo24Hour(parts[1].trim())
        };
    }

    return null;
}

// Helper: Convert 12-hour to 24-hour format
function convertTo24Hour(timeStr) {
    // Already in 24-hour format
    if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
        return timeStr;
    }

    const isPM = timeStr.includes('PM');
    const time = timeStr.replace(/\s*(AM|PM)/i, '');
    const [hours, minutes] = time.split(':').map(Number);

    let hour24 = hours;
    if (isPM && hours !== 12) hour24 += 12;
    if (!isPM && hours === 12) hour24 = 0;

    return `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Helper: Determine best weather based on category
function getBestWeather(categoryName, indoorSuitable) {
    if (indoorSuitable) {
        return ['rainy', 'cloudy', 'sunny', 'clear'];
    }

    const outdoorCategories = ['Nature', 'Lake', 'Waterfall', 'Outdoor', 'Adventure', 'Park', 'Scenic'];
    if (outdoorCategories.includes(categoryName)) {
        return ['sunny', 'clear', 'cloudy'];
    }

    return ['sunny', 'clear', 'cloudy', 'rainy'];
}

// Run the export
restoreData();
