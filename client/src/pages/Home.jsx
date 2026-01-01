import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, Map, Heart, ChevronRight } from 'lucide-react';
import PlaceCard from '../components/PlaceCard';
import WeatherColumn from '../components/WeatherColumn';
import HeroSearchBar from '../components/HeroSearchBar';

// =============================================================================
// COMPONENT: HeroSection (Cinematic Split-Layout: Text Left, Weather Right)
// =============================================================================

const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <section
            className="relative w-full"
            aria-labelledby="hero-title"
        >
            {/* Full-Width Background Image */}
            <div className="relative w-full h-[85vh] md:h-[90vh] lg:h-[95vh] min-h-[600px]">
                <img
                    src="https://antimatter.vn/wp-content/uploads/2022/06/hinh-anh-da-lat.jpg"
                    alt="Dalat, Vietnam"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Strong Dark Overlay for maximum text readability */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Cool Misty Gradient - Deep blue tone */}
                <div className="
                    absolute inset-0 
                    bg-gradient-to-br from-slate-900/30 via-blue-900/20 to-transparent
                    mix-blend-multiply
                " />

                {/* Content Container - Aligned with Header */}
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Split Layout: Text Left | Weather Right */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 pt-20 md:pt-0">

                            {/* LEFT SIDE: The Slogan (Majestic & Clean) */}
                            <div className="flex-1 max-w-2xl order-2 md:order-1">
                                <h1
                                    id="hero-title"
                                    className="
                                        font-tenor text-4xl md:text-6xl lg:text-7xl xl:text-8xl 
                                        leading-[1.1] text-white
                                        whitespace-pre-line
                                        animate-fade-in-up
                                        drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]
                                    "
                                    style={{ animationDelay: '0.1s' }}
                                >
                                    {t('hero.title')}
                                </h1>

                                <p
                                    className="
                                        font-manrope font-light text-base md:text-xl text-white/85 
                                        mt-6 md:mt-8 leading-relaxed
                                        max-w-lg
                                        animate-fade-in-up
                                        drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]
                                    "
                                    style={{ animationDelay: '0.2s' }}
                                >
                                    {t('hero.subtitle')}
                                </p>
                            </div>

                            {/* RIGHT SIDE: The Weather Column (Vertical & Bold) - Clickable */}
                            <Link
                                to="/weather"
                                className="
                                    flex-shrink-0 order-1 md:order-2
                                    hover:scale-105 transition-transform duration-300
                                    cursor-pointer
                                "
                                style={{ animationDelay: '0.3s' }}
                                aria-label="View detailed weather forecast"
                            >
                                <WeatherColumn />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// =============================================================================
// COMPONENT: CuratedSection
// =============================================================================

const CuratedSection = ({ title, subtitle, places, viewAllLink }) => {
    const { t } = useTranslation();

    return (
        <section
            className="py-10 md:py-16"
            aria-label={title}
            id="destinations"
        >
            {/* Section Header with View All Link */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6 md:mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-accent" strokeWidth={1.5} />
                            <span className="text-xs font-manrope font-medium text-accent uppercase tracking-wider">
                                {subtitle}
                            </span>
                        </div>
                        <h2 className="font-tenor text-2xl md:text-3xl text-foreground">
                            {title}
                        </h2>
                    </div>
                    {viewAllLink && (
                        <Link
                            to={viewAllLink}
                            className="font-manrope text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                            {t('sections.viewAllRecs')}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Horizontal Scroll Container - No See More Card */}
            <div
                className="
          flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory
          scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2
        "
                role="region"
                aria-label="Scroll through recommended places"
            >
                {places.map((place) => (
                    <PlaceCard key={place.id} place={place} />
                ))}
            </div>
        </section>
    );
};

// =============================================================================
// COMPONENT: LocalEatsSection (Static 3x2 Grid)
// =============================================================================

const LocalEatsSection = () => {
    const { t, i18n } = useTranslation();
    const [localEats, setLocalEats] = useState([]);
    const [loading, setLoading] = useState(true);
    const isVietnamese = i18n.language === 'vi';

    useEffect(() => {
        const fetchLocalEats = async () => {
            try {
                // Fetch all places and filter for food-related categories
                const response = await fetch('/api/places');
                if (response.ok) {
                    const data = await response.json();
                    // Filter for Street Food and Restaurant categories, limit to 6
                    const foodPlaces = data.filter(place =>
                        place.category?.name === 'Street Food' ||
                        place.category?.name === 'Restaurant'
                    ).slice(0, 6);
                    setLocalEats(foodPlaces);
                }
            } catch (err) {
                console.error('Failed to fetch local eats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLocalEats();
    }, []);

    if (loading) {
        return (
            <section className="py-10 md:py-16" aria-label="Local Hidden Gems">
                <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[4/3] rounded-2xl bg-gray-200 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-10 md:py-16" aria-label="Local Hidden Gems">
            {/* Section Header with View All Link */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6 md:mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Heart className="w-4 h-4 text-accent" strokeWidth={1.5} />
                            <span className="text-xs font-manrope font-medium text-accent uppercase tracking-wider">
                                {t('sections.localFavorites')}
                            </span>
                        </div>
                        <h2 className="font-tenor text-2xl md:text-3xl text-foreground">
                            {t('sections.localGemsTitle')}
                        </h2>
                    </div>
                    <Link
                        to="/local-eats"
                        className="font-manrope text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                        {t('sections.discoverLocalEats')}
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Dynamic Grid - Fetched from API */}
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {localEats.map((item) => (
                        <Link
                            key={item.id}
                            to={`/place/${item.id}`}
                            className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer block"
                        >
                            <img
                                src={item.imagePath}
                                alt={isVietnamese && item.titleVi ? item.titleVi : item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="font-tenor text-lg text-white mb-1">
                                    {isVietnamese && item.titleVi ? item.titleVi : item.title}
                                </h3>
                                <p className="font-manrope text-sm text-white/70">
                                    {(isVietnamese && item.descriptionVi ? item.descriptionVi : item.description)?.substring(0, 60)}...
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

// =============================================================================
// COMPONENT: MapSection
// =============================================================================

const MapSection = () => {
    const { t } = useTranslation();

    return (
        <section
            className="py-10 md:py-16"
            aria-label="Interactive Map"
            id="contact"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <Map className="w-4 h-4 text-accent" strokeWidth={1.5} />
                        <span className="text-xs font-manrope font-medium text-accent uppercase tracking-wider">
                            {t('sections.location')}
                        </span>
                    </div>
                    <h2 className="font-tenor text-2xl md:text-3xl text-foreground">
                        {t('sections.exploreCity')}
                    </h2>
                    <p className="font-manrope text-sm text-foreground/60 mt-2">
                        {t('sections.mapDescription')}
                    </p>
                </div>

                {/* Google Maps Embed - SATELLITE/HYBRID Mode for terrain texture */}
                <div className="rounded-xl overflow-hidden shadow-lg z-0 relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15624.246913578!2d108.4378!3d11.9404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317112d959f88991%3A0x9c30ef02c36e7b25!2sXuan%20Huong%20Lake!5e1!3m2!1sen!2s!4v1703462400000!5m2!1sen!2s"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Satellite Map of Dalat City Center, Vietnam"
                        className="w-full h-96 grayscale hover:grayscale-0 transition-all duration-500"
                    />
                </div>
            </div>
        </section>
    );
};

const Home = () => {
    const { t } = useTranslation();
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendedPlaces = async () => {
            try {
                const response = await fetch('/api/places');
                if (response.ok) {
                    const data = await response.json();
                    // Transform data to match PlaceCard expected format and take first 6
                    const transformed = data.slice(0, 6).map(place => ({
                        id: place.id,
                        title: place.title,
                        titleVi: place.titleVi,
                        location: place.location,
                        locationVi: place.locationVi,
                        image: place.imagePath,
                        description: place.description,
                        category: place.category?.name || 'Attraction'
                    }));
                    setRecommendedPlaces(transformed);
                }
            } catch (err) {
                console.error('Failed to fetch places:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendedPlaces();
    }, []);

    return (
        <main role="main">
            <HeroSection />

            {/* Section 1: Curated Recommendations (Weather-Based) */}
            <div className="mt-16 md:mt-20">
                {loading ? (
                    <section className="py-10 md:py-16">
                        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                            <div className="flex gap-4 md:gap-6 overflow-x-auto">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="flex-shrink-0 w-[280px] md:w-[320px] aspect-[3/4] rounded-2xl bg-gray-200 animate-pulse" />
                                ))}
                            </div>
                        </div>
                    </section>
                ) : (
                    <CuratedSection
                        title={t('sections.forecastCuration')}
                        subtitle={t('sections.aiPicks')}
                        places={recommendedPlaces}
                        viewAllLink="/ai-recs"
                    />
                )}
            </div>

            {/* Section 2: Local Hidden Gems (Dynamic from API) */}
            <LocalEatsSection />

            {/* Interactive Map Section */}
            <MapSection />
        </main>
    );
};

export default Home;
