import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Utensils,
    MapPin,
    Star,
    ArrowLeft,
    Clock,
    Loader2
} from 'lucide-react';

// =============================================================================
// API Configuration
// =============================================================================
const API_BASE = 'http://localhost:3001/api';

// =============================================================================
// Animation Variants
// =============================================================================

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

// =============================================================================
// Restaurant Card Component
// =============================================================================

const RestaurantCard = ({ restaurant, isVietnamese }) => {
    const name = isVietnamese && restaurant.titleVi ? restaurant.titleVi : restaurant.title;
    const description = isVietnamese && restaurant.descriptionVi ? restaurant.descriptionVi : restaurant.description;
    const location = isVietnamese && restaurant.locationVi ? restaurant.locationVi : restaurant.location;

    return (
        <Link to={`/place/${restaurant.id}`}>
            <motion.div
                variants={fadeInUp}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer"
            >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={restaurant.imagePath}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="font-manrope font-bold text-sm text-slate-900">
                            {restaurant.category?.name || 'Restaurant'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-tenor text-xl text-white mb-2">
                        {name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-manrope text-sm text-white/70">{restaurant.rating || 4.5}</span>
                    </div>

                    {/* Description */}
                    <p className="font-manrope text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">
                        {description}
                    </p>

                    {/* Meta */}
                    <div className="space-y-2 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-white/40">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="font-manrope text-xs">{location}</span>
                        </div>
                        {restaurant.openingHours && (
                            <div className="flex items-center gap-2 text-white/40">
                                <Clock className="w-3.5 h-3.5" />
                                <span className="font-manrope text-xs">{restaurant.openingHours}</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

// =============================================================================
// Main Page Component
// =============================================================================

const LocalEats = () => {
    const { t, i18n } = useTranslation();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const isVietnamese = i18n.language === 'vi';

    // Fetch restaurant/food places from API
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                setLoading(true);
                // Fetch all places and filter for food-related categories
                const response = await fetch(`${API_BASE}/places`);
                const data = await response.json();

                // Filter for restaurants and street food
                const foodCategories = ['Restaurant', 'Street Food', 'Café'];
                const foodPlaces = data.filter(place =>
                    foodCategories.includes(place.category?.name)
                );

                setPlaces(foodPlaces);
            } catch (error) {
                console.error('Failed to fetch places:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    return (
        <article className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-950/20 via-slate-950 to-slate-950" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Link */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-manrope text-sm">{t('aiRecs.backToHome')}</span>
                    </Link>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                    >
                        {/* Eyebrow */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex items-center gap-3 mb-4"
                        >
                            <Utensils className="w-5 h-5 text-white/60" />
                            <span className="font-manrope text-sm text-white/50 uppercase tracking-[0.3em]">
                                {t('localEats.eyebrow')}
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            variants={fadeInUp}
                            className="font-tenor text-4xl md:text-5xl lg:text-6xl leading-tight mb-6"
                        >
                            {t('localEats.title')}
                            <span className="block text-white/60">{t('localEats.subtitle')}</span>
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="font-manrope font-light text-lg text-slate-400 max-w-2xl"
                        >
                            {t('localEats.description')}
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Results Grid */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    ) : (
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {places.map((restaurant) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                    isVietnamese={isVietnamese}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </article>
    );
};

export default LocalEats;
