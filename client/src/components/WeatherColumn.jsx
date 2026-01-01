import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Sun,
    Cloud,
    CloudSun,
    CloudRain,
    CloudSnow,
    CloudLightning,
    CloudFog,
    Droplets,
    Wind
} from 'lucide-react';

const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const WeatherColumn = () => {
    const { t, i18n } = useTranslation();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get weather tip based on weather ID and language
    const getWeatherTipTranslated = (weatherId) => {
        const isVi = i18n.language === 'vi';
        if (weatherId >= 200 && weatherId < 300) {
            return isVi ? "Có giông bão. Nên ở trong nhà nếu có thể." : "Thunderstorms expected. Stay indoors if possible.";
        } else if (weatherId >= 300 && weatherId < 400) {
            return isVi ? "Mưa phùn nhẹ. Một áo khoác nhẹ là đủ." : "Light drizzle. A light jacket should suffice.";
        } else if (weatherId >= 500 && weatherId < 600) {
            return isVi ? "Đừng quên mang ô." : "Don't forget your umbrella.";
        } else if (weatherId >= 600 && weatherId < 700) {
            return isVi ? "Tuyết hiếm ở Đà Lạt! Mặc thật ấm." : "Rare snow in Dalat! Bundle up warmly.";
        } else if (weatherId >= 700 && weatherId < 800) {
            return isVi ? "Sương mù. Lái xe cẩn thận." : "Misty conditions. Drive carefully.";
        } else if (weatherId === 800) {
            return isVi ? "Ngày đẹp để đi dạo hoặc khám phá." : "Great day for a walk or outdoor exploration.";
        } else if (weatherId > 800) {
            return isVi ? "Trời nhiều mây. Hoàn hảo để tham quan." : "Partly cloudy. Perfect for sightseeing.";
        }
        return isVi ? "Chúc bạn có chuyến thăm Đà Lạt vui vẻ!" : "Enjoy your visit to Dalat!";
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Fetch through backend proxy to protect API key
                const response = await fetch('/api/weather');
                if (!response.ok) throw new Error('Weather data unavailable');
                const data = await response.json();
                setWeather({
                    temp: data.temp,
                    humidity: data.humidity,
                    windSpeed: data.windSpeed,
                    description: capitalizeWords(data.description),
                    weatherId: data.weatherId
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    // Loading skeleton
    if (loading) {
        return (
            <div className="flex flex-col items-center text-center space-y-4 animate-pulse">
                <div className="w-16 h-16 bg-white/20 rounded-full" />
                <div className="h-16 w-24 bg-white/20 rounded-lg" />
                <div className="h-5 w-32 bg-white/20 rounded" />
            </div>
        );
    }

    // Error/fallback state
    if (error || !weather) {
        return (
            <div className="flex flex-col items-center text-center space-y-2">
                <CloudSun className="w-16 h-16 text-white/50" strokeWidth={1} />
                <p className="font-tenor text-5xl text-white/50">--°C</p>
                <p className="font-manrope text-sm text-white/50 uppercase tracking-widest">
                    {t('weather.unavailable')}
                </p>
            </div>
        );
    }

    // Get large weather icon
    const getLargeWeatherIcon = (weatherId) => {
        const iconClass = "w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-lg";
        if (weatherId >= 200 && weatherId < 300) {
            return <CloudLightning className={iconClass} strokeWidth={1} />;
        } else if (weatherId >= 300 && weatherId < 400) {
            return <CloudRain className={iconClass} strokeWidth={1} />;
        } else if (weatherId >= 500 && weatherId < 600) {
            return <CloudRain className={iconClass} strokeWidth={1} />;
        } else if (weatherId >= 600 && weatherId < 700) {
            return <CloudSnow className={iconClass} strokeWidth={1} />;
        } else if (weatherId >= 700 && weatherId < 800) {
            return <CloudFog className={iconClass} strokeWidth={1} />;
        } else if (weatherId === 800) {
            return <Sun className={iconClass} strokeWidth={1} />;
        } else if (weatherId > 800 && weatherId <= 802) {
            return <CloudSun className={iconClass} strokeWidth={1} />;
        } else {
            return <Cloud className={iconClass} strokeWidth={1} />;
        }
    };

    return (
        <div className="
            relative flex flex-col items-center text-center
            pl-8 md:pl-12 
            border-l border-white/20
            bg-white/5 backdrop-blur-sm
            py-8 px-6 md:px-10 rounded-2xl
            animate-fade-in-up
        ">
            {/* Top: Huge Icon + Temperature */}
            <div className="flex flex-col items-center mb-6">
                <div className="animate-float mb-3">
                    {getLargeWeatherIcon(weather.weatherId)}
                </div>
                <p className="font-tenor text-6xl md:text-7xl lg:text-8xl text-white drop-shadow-lg">
                    {weather.temp}°C
                </p>
            </div>

            {/* Middle: Uppercase Description */}
            <p className="
                font-manrope text-sm md:text-base text-white/90
                uppercase tracking-[0.25em] font-medium
                mb-6
            ">
                {weather.description}
            </p>

            {/* Bottom: Vertical Details List */}
            <div className="flex flex-col items-center space-y-3 text-white/80">
                <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-manrope text-sm">
                        {weather.humidity}% {t('weather.humidity')}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-manrope text-sm">
                        {weather.windSpeed} m/s {t('weather.wind')}
                    </span>
                </div>
            </div>

            {/* Weather Tip */}
            <p className="
                font-manrope text-xs text-white/60 italic
                mt-6 max-w-[200px]
            ">
                {getWeatherTipTranslated(weather.weatherId)}
            </p>
        </div>
    );
};

export default WeatherColumn;
