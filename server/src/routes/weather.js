import express from 'express';

const router = express.Router();

// Dalat coordinates
const DALAT_LAT = 11.94;
const DALAT_LON = 108.43;

// =============================================================================
// GET /api/weather - Get Current Weather (Proxy to OpenWeatherMap)
// =============================================================================

router.get('/', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Weather API not configured' });
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${DALAT_LAT}&lon=${DALAT_LON}&units=metric&lang=en&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error('Weather API error');
        }

        const data = await response.json();

        // Return simplified weather data
        res.json({
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            description: data.weather[0].description,
            weatherId: data.weather[0].id,
            icon: data.weather[0].icon,
            city: data.name,
            country: data.sys.country
        });
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// =============================================================================
// GET /api/weather/forecast - Get 5-Day Forecast
// =============================================================================

router.get('/forecast', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Weather API not configured' });
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${DALAT_LAT}&lon=${DALAT_LON}&units=metric&lang=en&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error('Weather API error');
        }

        const data = await response.json();

        // Simplify forecast data - get one entry per day at noon
        const dailyForecasts = [];
        const seenDates = new Set();

        for (const item of data.list) {
            const date = item.dt_txt.split(' ')[0];
            if (!seenDates.has(date) && item.dt_txt.includes('12:00:00')) {
                seenDates.add(date);
                dailyForecasts.push({
                    date,
                    temp: Math.round(item.main.temp),
                    tempMin: Math.round(item.main.temp_min),
                    tempMax: Math.round(item.main.temp_max),
                    humidity: item.main.humidity,
                    description: item.weather[0].description,
                    weatherId: item.weather[0].id,
                    icon: item.weather[0].icon
                });
            }
        }

        res.json({ forecasts: dailyForecasts.slice(0, 5) });
    } catch (error) {
        console.error('Forecast API error:', error);
        res.status(500).json({ error: 'Failed to fetch forecast data' });
    }
});

// =============================================================================
// GET /api/weather/forecast-detailed - Get Detailed Forecast (raw data for client)
// =============================================================================

router.get('/forecast-detailed', async (req, res) => {
    try {
        const apiKey = process.env.OPENWEATHER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'Weather API not configured' });
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${DALAT_LAT}&lon=${DALAT_LON}&units=metric&lang=en&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error('Weather API error');
        }

        const data = await response.json();

        // Return the full forecast data for client-side processing
        res.json(data);
    } catch (error) {
        console.error('Detailed Forecast API error:', error);
        res.status(500).json({ error: 'Failed to fetch detailed forecast data' });
    }
});

export default router;
