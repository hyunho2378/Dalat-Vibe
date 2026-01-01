import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    Wind,
    Thermometer,
    ChevronDown,
    ChevronUp,
    Clock,
    Shirt,
    MapPin,
    Coffee,
    TreePine,
    Camera,
    Sparkles,
    Flame,
    Snowflake,
    Minus
} from 'lucide-react';

// API requests are proxied through backend to protect API keys
const API_BASE = 'http://localhost:3001/api';

// =============================================================================
// Helper Functions
// =============================================================================

const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const getDayName = (dateString, index, isVi = false) => {
    if (index === 0) return isVi ? 'Hôm nay' : 'Today';
    if (index === 1) return isVi ? 'Ngày mai' : 'Tomorrow';
    const date = new Date(dateString);
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysVi = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    return isVi ? daysVi[date.getDay()] : daysEn[date.getDay()];
};

const formatHour = (dtTxt) => {
    const time = dtTxt.split(' ')[1];
    const hour = parseInt(time.split(':')[0], 10);
    // Cap at 23:00, never show 24:00
    const displayHour = hour >= 24 ? 0 : hour;
    return `${displayHour.toString().padStart(2, '0')}:00`;
};

const getTimePeriod = (hour, isVi = false) => {
    if (hour < 6) return isVi ? 'Đêm' : 'Night';
    if (hour < 12) return isVi ? 'Sáng' : 'Morning';
    if (hour < 17) return isVi ? 'Chiều' : 'Afternoon';
    if (hour < 21) return isVi ? 'Tối' : 'Evening';
    return isVi ? 'Đêm' : 'Night';
};

const getWeatherIcon = (weatherId, size = 'medium') => {
    const sizeClasses = {
        tiny: 'w-5 h-5',
        small: 'w-8 h-8',
        medium: 'w-12 h-12',
        large: 'w-16 h-16',
        huge: 'w-24 h-24 md:w-32 md:h-32',
        giant: 'w-32 h-32 md:w-40 md:h-40'
    };

    const iconClass = `${sizeClasses[size]} text-white drop-shadow-lg`;

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

const isRainyWeather = (weatherId) => {
    return (weatherId >= 200 && weatherId < 700);
};

// =============================================================================
// OOTD Logic - 3-Part Outfit Guide with Preferences
// =============================================================================

const getDetailedOOTD = (temp, weatherId, preference = 'standard') => {
    // Adjust effective temperature based on preference
    let effectiveTemp = temp;
    if (preference === 'warmer') {
        effectiveTemp -= 4; // Dress as if it's 4 degrees colder
    } else if (preference === 'cooler') {
        effectiveTemp += 4; // Dress as if it's 4 degrees warmer
    }

    // Rainy weather override
    if (isRainyWeather(weatherId)) {
        if (preference === 'warmer') {
            return {
                title: "Extra Rain Protection",
                outerwear: "Heavy Waterproof Jacket",
                top: "Warm Fleece Layer",
                bottom: "Waterproof Pants"
            };
        } else if (preference === 'cooler') {
            return {
                title: "Light Rain Gear",
                outerwear: "Light Rain Shell",
                top: "Breathable Tee",
                bottom: "Quick-dry Shorts"
            };
        }
        return {
            title: "Rain Ready",
            outerwear: "Waterproof Jacket",
            top: "Light Sweater",
            bottom: "Quick-dry Pants"
        };
    }

    // Temperature-based recommendations with preference adjustments
    if (effectiveTemp < 14) {
        return {
            title: "Full Winter Mode",
            outerwear: "Heavy Coat with Scarf",
            top: "Thick Knitwear",
            bottom: "Insulated Pants"
        };
    } else if (effectiveTemp < 18) {
        return {
            title: "Cozy Layers",
            outerwear: "Warm Jacket",
            top: "Hoodie or Sweater",
            bottom: "Thick Jeans"
        };
    } else if (effectiveTemp < 22) {
        return {
            title: "Balanced Comfort",
            outerwear: "Light Cardigan",
            top: "Long Sleeve Shirt",
            bottom: "Jeans or Chinos"
        };
    } else if (effectiveTemp < 26) {
        return {
            title: "Light and Breezy",
            outerwear: "Optional Layer",
            top: "T-shirt or Blouse",
            bottom: "Light Pants"
        };
    } else {
        return {
            title: "Stay Cool",
            outerwear: "None Needed",
            top: "Sleeveless or Tank",
            bottom: "Shorts or Skirt"
        };
    }
};

// =============================================================================
// Component: Outfit Icon (Monochrome White)
// =============================================================================

const OutfitIcon = ({ type }) => {
    const iconClass = "w-8 h-8 text-white drop-shadow-md";

    switch (type) {
        case 'outerwear':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3L8 7H4v12h16V7h-4L12 3z" />
                    <path d="M8 7v12M16 7v12" />
                </svg>
            );
        case 'top':
            return <Shirt className={iconClass} />;
        case 'bottom':
            return (
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M6 4h12v6l-2 10H8L6 10V4z" />
                    <path d="M6 10h12" />
                    <path d="M12 10v10" />
                </svg>
            );
        default:
            return <Shirt className={iconClass} />;
    }
};

// =============================================================================
// Component: Detailed OOTD Card with Preference Tabs
// =============================================================================

const OOTDCard = ({ temp, weatherId }) => {
    const { t, i18n } = useTranslation();
    const [preference, setPreference] = useState('standard');
    const ootd = getDetailedOOTD(temp, weatherId, preference);
    const isVi = i18n.language === 'vi';

    // Translate outfit title based on language
    const getTranslatedTitle = (title) => {
        const titleMap = {
            'Extra Rain Protection': isVi ? 'Bảo vệ Mưa Tối đa' : title,
            'Light Rain Gear': isVi ? 'Trang phục Mưa Nhẹ' : title,
            'Rain Ready': isVi ? 'Sẵn sàng Mưa' : title,
            'Full Winter Mode': isVi ? 'Chế độ Đông Đầy đủ' : title,
            'Cozy Layers': isVi ? 'Lớp Ấm Áp' : title,
            'Balanced Comfort': isVi ? 'Thoải mái Cân bằng' : title,
            'Light and Breezy': isVi ? 'Nhẹ nhàng Thoáng mát' : title,
            'Stay Cool': isVi ? 'Giữ Mát' : title
        };
        return titleMap[title] || title;
    };

    const PreferenceTab = ({ value, icon: Icon, label }) => (
        <button
            onClick={() => setPreference(value)}
            className={`
                flex-1 flex items-center justify-center gap-2
                py-2.5 px-3 rounded-xl
                font-manrope text-xs font-medium
                transition-all duration-200
                ${preference === value
                    ? 'bg-white/25 text-white border border-white/30'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'
                }
            `}
        >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    const OutfitRow = ({ type, label, value }) => (
        <div className="flex items-center gap-5 py-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <OutfitIcon type={type} />
            </div>
            <div className="flex-1">
                <p className="font-manrope text-xs text-white/50 uppercase tracking-wider mb-1">
                    {label}
                </p>
                <p className="font-manrope text-base md:text-lg text-white font-medium">
                    {value}
                </p>
            </div>
        </div>
    );

    return (
        <div className="
            h-full
            bg-white/15 backdrop-blur-xl
            border border-white/20
            rounded-3xl p-6 md:p-8
            flex flex-col
        ">
            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Shirt className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <div>
                    <span className="font-manrope text-xs text-white/50 uppercase tracking-widest block mb-1">
                        {t('weather.outfitGuide')}
                    </span>
                    <h3 className="font-tenor text-2xl text-white">{getTranslatedTitle(ootd.title)}</h3>
                </div>
            </div>

            {/* Preference Tabs */}
            <div className="flex gap-2 mb-6">
                <PreferenceTab value="warmer" icon={Flame} label={t('weather.warmer')} />
                <PreferenceTab value="standard" icon={Minus} label={t('weather.standard')} />
                <PreferenceTab value="cooler" icon={Snowflake} label={t('weather.cooler')} />
            </div>

            {/* 3-Part Outfit List */}
            <div className="flex-1 flex flex-col justify-evenly divide-y divide-white/10">
                <OutfitRow type="outerwear" label={t('weather.outerwear')} value={ootd.outerwear} />
                <OutfitRow type="top" label={t('weather.top')} value={ootd.top} />
                <OutfitRow type="bottom" label={t('weather.bottom')} value={ootd.bottom} />
            </div>
        </div>
    );
};

// =============================================================================
// Component: Hourly Detail Row
// =============================================================================

const HourlyRow = ({ hour }) => {
    const { i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    const period = getTimePeriod(hour.hour, isVi);

    return (
        <div className="
            flex items-center justify-between
            py-3 px-4
            bg-white/5 rounded-xl
            border border-white/10
        ">
            <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-white/50" />
                <span className="font-manrope text-sm text-white/80 w-14">{hour.time}</span>
                <span className="font-manrope text-xs text-white/40 hidden sm:inline">
                    {period}
                </span>
            </div>
            <div className="flex items-center gap-4">
                {getWeatherIcon(hour.weatherId, 'small')}
                <span className="font-tenor text-lg text-white w-12 text-right">
                    {hour.temp}°
                </span>
            </div>
        </div>
    );
};

// =============================================================================
// Component: Day Forecast Card (Expandable)
// =============================================================================

const DayForecastCard = ({ day, isExpanded, onToggle, hourlyData }) => {
    const { t, i18n } = useTranslation();
    const isVi = i18n.language === 'vi';
    const dayName = getDayName(day.date, day.index, isVi);

    return (
        <div className="
            bg-white/10 backdrop-blur-md
            border border-white/15
            rounded-2xl
            overflow-hidden
            transition-all duration-300
        ">
            {/* Main Day Row - Clickable */}
            <button
                onClick={onToggle}
                className="
                    w-full flex items-center justify-between
                    p-5 md:p-6
                    hover:bg-white/5 transition-colors
                    text-left
                "
            >
                <div className="flex items-center gap-4 md:gap-6">
                    {getWeatherIcon(day.weatherId, 'medium')}
                    <div>
                        <h3 className="font-tenor text-lg md:text-xl text-white">
                            {dayName}
                        </h3>
                        <p className="font-manrope text-sm text-white/60">
                            {day.condition}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                        <p className="font-tenor text-2xl text-white">{day.maxTemp}°</p>
                        <p className="font-manrope text-sm text-white/50">{day.minTemp}°</p>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white/60" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-white/40" />
                    )}
                </div>
            </button>

            {/* Expanded Hourly Details */}
            <div className={`
                overflow-hidden transition-all duration-500 ease-out
                ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
            `}>
                <div className="px-5 pb-5 space-y-2 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-white/50" />
                        <span className="font-manrope text-xs text-white/50 uppercase tracking-wider">
                            {t('weather.hourlyBreakdown')}
                        </span>
                    </div>
                    {hourlyData.length > 0 ? (
                        hourlyData.map((hour, idx) => (
                            <HourlyRow key={idx} hour={hour} />
                        ))
                    ) : (
                        <p className="text-white/40 text-sm font-manrope py-4 text-center">
                            {t('weather.loading')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// =============================================================================
// Component: Recommendation Card
// =============================================================================

const RecommendationCard = ({ place, isVietnamese }) => {
    const title = isVietnamese && place.titleVi ? place.titleVi : place.title;
    const location = isVietnamese && place.locationVi ? place.locationVi : place.location;
    const categoryName = place.category?.name || 'Attraction';

    return (
        <Link
            to={`/place/${place.id}`}
            className="
                group relative
                bg-white/10 backdrop-blur-md
                border border-white/15
                rounded-2xl
                overflow-hidden
                hover:bg-white/15 hover:border-white/25
                transition-all duration-300
                block
            "
        >
            {/* Image */}
            <div className="aspect-[16/9] relative overflow-hidden">
                <img
                    src={place.imagePath || place.image}
                    alt={title}
                    className="
                        w-full h-full object-cover
                        group-hover:scale-105 transition-transform duration-500
                    "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category Badge */}
                <div className="
                    absolute top-3 left-3
                    px-3 py-1 rounded-full
                    bg-white/20 backdrop-blur-sm
                    text-xs font-manrope text-white
                ">
                    {categoryName}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h4 className="font-tenor text-lg text-white mb-1">{title}</h4>
                <div className="flex items-center gap-1.5 text-white/60">
                    <MapPin className="w-3 h-3" />
                    <span className="font-manrope text-xs">{location || place.subtitle}</span>
                </div>
            </div>
        </Link>
    );
};

// =============================================================================
// Main Weather Page Component
// =============================================================================

const Weather = () => {
    const { t, i18n } = useTranslation();
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [hourlyByDay, setHourlyByDay] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedDay, setExpandedDay] = useState(null);
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);
    const [isIndoorWeather, setIsIndoorWeather] = useState(false);

    const isVietnamese = i18n.language === 'vi';

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                // Fetch current weather via backend proxy
                const currentResponse = await fetch('/api/weather');
                if (!currentResponse.ok) throw new Error('Weather data unavailable');
                const currentData = await currentResponse.json();

                setCurrentWeather({
                    temp: Math.round(currentData.temp),
                    feelsLike: currentData.feelsLike ? Math.round(currentData.feelsLike) : Math.round(currentData.temp),
                    humidity: currentData.humidity,
                    windSpeed: currentData.windSpeed,
                    description: capitalizeWords(currentData.description),
                    weatherId: currentData.weatherId
                });

                // Fetch 5-day/3-hour forecast via backend proxy
                const forecastResponse = await fetch('/api/weather/forecast-detailed');
                if (!forecastResponse.ok) throw new Error('Forecast unavailable');
                const forecastData = await forecastResponse.json();

                // Process data
                const dailyMap = new Map();
                const hourlyMap = {};

                forecastData.list.forEach((item) => {
                    const date = item.dt_txt.split(' ')[0];
                    const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0], 10);

                    // Skip if hour is 24 or beyond (edge case)
                    if (hour >= 24) return;

                    // Daily summary
                    if (!dailyMap.has(date)) {
                        dailyMap.set(date, {
                            date,
                            temps: [],
                            weatherIds: [],
                            conditions: []
                        });
                    }

                    const dayData = dailyMap.get(date);
                    dayData.temps.push(item.main.temp);
                    dayData.weatherIds.push(item.weather[0].id);
                    dayData.conditions.push(item.weather[0].main);

                    // Hourly data - include all times up to 23:00
                    if (!hourlyMap[date]) {
                        hourlyMap[date] = [];
                    }

                    hourlyMap[date].push({
                        time: formatHour(item.dt_txt),
                        hour: hour,
                        temp: Math.round(item.main.temp),
                        weatherId: item.weather[0].id
                    });
                });

                const dailyForecast = Array.from(dailyMap.values())
                    .slice(0, 5)
                    .map((day, index) => ({
                        date: day.date,
                        index: index,
                        maxTemp: Math.round(Math.max(...day.temps)),
                        minTemp: Math.round(Math.min(...day.temps)),
                        weatherId: day.weatherIds[Math.floor(day.weatherIds.length / 2)],
                        condition: capitalizeWords(day.conditions[Math.floor(day.conditions.length / 2)])
                    }));

                setForecast(dailyForecast);
                setHourlyByDay(hourlyMap);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);

    // Fetch weather-based recommendations when weather is loaded
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!currentWeather) return;

            try {
                const response = await fetch(`${API_BASE}/places/weather-recommendations?weatherId=${currentWeather.weatherId}&limit=6`);
                if (response.ok) {
                    const data = await response.json();
                    setRecommendedPlaces(data.places || []);
                    setIsIndoorWeather(data.isIndoor || false);
                }
            } catch (err) {
                console.error('Failed to fetch recommendations:', err);
                // Fallback: fetch all places
                try {
                    const fallbackRes = await fetch(`${API_BASE}/places?limit=6`);
                    if (fallbackRes.ok) {
                        const fallbackData = await fallbackRes.json();
                        setRecommendedPlaces(fallbackData);
                    }
                } catch (e) {
                    console.error('Fallback fetch also failed:', e);
                }
            }
        };

        fetchRecommendations();
    }, [currentWeather]);

    const getRecommendationTitle = () => {
        if (!currentWeather) return t('weather.outdoorAdventures');
        return isIndoorWeather
            ? t('weather.cozyIndoorRetreats')
            : t('weather.outdoorAdventures');
    };

    const getRecommendationIcon = () => {
        if (!currentWeather) return <Camera className="w-5 h-5 text-white/70" />;
        return isIndoorWeather
            ? <Coffee className="w-5 h-5 text-white/70" />
            : <TreePine className="w-5 h-5 text-white/70" />;
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="animate-spin w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4" />
                        <p className="font-manrope text-white">Loading weather data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-slate-950">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <CloudFog className="w-16 h-16 text-white/50 mx-auto mb-4" />
                        <p className="font-tenor text-2xl text-white mb-2">Weather Unavailable</p>
                        <p className="font-manrope text-white/60">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Main Content - Full Width Layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

                {/* ============================================================= */}
                {/* SECTION 1: Current Weather and OOTD */}
                {/* ============================================================= */}
                <section className="mb-12 md:mb-16">
                    {/* Section Header - Subtle and Elegant */}
                    <div className="mb-8">
                        <p className="font-manrope text-xs text-white/50 uppercase tracking-[0.3em] mb-2">
                            {t('weather.dalatHighlands')}
                        </p>
                        <h1 className="font-tenor text-2xl md:text-3xl text-white">
                            {t('weather.currentConditions')}
                        </h1>
                    </div>

                    {/* Current Weather and OOTD - Equal Height Grid */}
                    {currentWeather && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Main Weather Card */}
                            <div className="
                                h-full
                                bg-white/10 backdrop-blur-xl
                                border border-white/15
                                rounded-3xl
                                p-8 md:p-10
                                flex flex-col justify-center
                            ">
                                <div className="flex flex-col items-center text-center">
                                    {/* Icon */}
                                    <div className="animate-float mb-6">
                                        {getWeatherIcon(currentWeather.weatherId, 'giant')}
                                    </div>

                                    {/* Temperature */}
                                    <p className="font-tenor text-8xl md:text-9xl text-white drop-shadow-lg">
                                        {currentWeather.temp}°
                                    </p>
                                    <p className="font-manrope text-lg md:text-xl text-white/80 uppercase tracking-widest mt-2">
                                        {currentWeather.description}
                                    </p>

                                    {/* Stats Row */}
                                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/70">
                                        <div className="flex items-center gap-2">
                                            <Thermometer className="w-4 h-4" />
                                            <span className="font-manrope text-sm">
                                                {t('weather.feelsLike')} {currentWeather.feelsLike}°
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Droplets className="w-4 h-4" />
                                            <span className="font-manrope text-sm">
                                                {currentWeather.humidity}% {t('weather.humidity')}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Wind className="w-4 h-4" />
                                            <span className="font-manrope text-sm">
                                                {t('weather.wind')} {currentWeather.windSpeed} m/s
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* OOTD Card - Same Height */}
                            <OOTDCard
                                temp={currentWeather.temp}
                                weatherId={currentWeather.weatherId}
                            />
                        </div>
                    )}
                </section>

                {/* ============================================================= */}
                {/* SECTION 2: Day Forecast */}
                {/* ============================================================= */}
                <section className="mb-12 md:mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock className="w-5 h-5 text-white/70" />
                        <h2 className="font-tenor text-xl text-white">{t('weather.dayForecast')}</h2>
                    </div>
                    <p className="font-manrope text-sm text-white/50 mb-6">
                        {t('weather.tapToSeeHourly')}
                    </p>

                    <div className="space-y-3">
                        {forecast.map((day) => (
                            <DayForecastCard
                                key={day.date}
                                day={day}
                                isExpanded={expandedDay === day.date}
                                onToggle={() => setExpandedDay(
                                    expandedDay === day.date ? null : day.date
                                )}
                                hourlyData={hourlyByDay[day.date] || []}
                            />
                        ))}
                    </div>
                </section>

                {/* ============================================================= */}
                {/* SECTION 3: Smart Recommendations */}
                {/* ============================================================= */}
                <section>
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-5 h-5 text-white/70" />
                        <span className="font-manrope text-xs text-white/60 uppercase tracking-wider">
                            {t('weather.smartSuggestions')}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        {getRecommendationIcon()}
                        <h2 className="font-tenor text-xl text-white">
                            {getRecommendationTitle()}
                        </h2>
                    </div>
                    <p className="font-manrope text-sm text-white/50 mb-8">
                        {t('weather.perfectDestinations')}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedPlaces.map((place) => (
                            <RecommendationCard key={place.id} place={place} isVietnamese={isVietnamese} />
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Weather;
