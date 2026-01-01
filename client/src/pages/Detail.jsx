import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft,
    Star,
    Phone,
    Share2,
    Bookmark,
    Clock,
    MapPin,
    Sparkles,
    Navigation,
    Loader2
} from 'lucide-react';

// =============================================================================
// API Configuration
// =============================================================================
const API_BASE = 'http://localhost:3001/api';

// =============================================================================
// COMPONENT: DetailPage
// =============================================================================

const DetailPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const isVietnamese = i18n.language === 'vi';

    // Fetch place data from API
    useEffect(() => {
        const fetchPlace = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/places/${id}`);
                if (!response.ok) {
                    throw new Error('Place not found');
                }
                const data = await response.json();
                setPlace(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
        window.scrollTo(0, 0);
    }, [id]);

    // Render star rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={`full-${i}`}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                    strokeWidth={1}
                />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Star
                    key="half"
                    className="w-4 h-4 fill-amber-400/50 text-amber-400"
                    strokeWidth={1}
                />
            );
        }

        return stars;
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="font-manrope text-gray-600">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !place) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="font-manrope text-gray-600 mb-4">
                        {isVietnamese ? 'Không tìm thấy địa điểm' : 'Place not found'}
                    </p>
                    <Link
                        to="/"
                        className="font-manrope text-primary hover:underline"
                    >
                        {t('aiRecs.backToHome')}
                    </Link>
                </div>
            </div>
        );
    }

    // Get localized content
    const title = isVietnamese && place.titleVi ? place.titleVi : place.title;
    const description = isVietnamese && place.descriptionVi ? place.descriptionVi : place.description;
    const location = isVietnamese && place.locationVi ? place.locationVi : place.location;

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* ================================================================= */}
            {/* IMMERSIVE HERO SECTION */}
            {/* ================================================================= */}
            <section className="relative w-full h-[50vh] md:h-[60vh]">
                {/* Skeleton loader */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/20 animate-pulse" />
                )}

                {/* Hero Image */}
                <img
                    src={place.imagePath}
                    alt={title}
                    onLoad={() => setImageLoaded(true)}
                    className={`
                        absolute inset-0 w-full h-full object-cover
                        transition-opacity duration-500
                        ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                    `}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Glassmorphism Back Button */}
                <Link
                    to="/"
                    className="
                        absolute top-5 left-5 z-10
                        p-3 rounded-full
                        bg-white/30 backdrop-blur-md
                        hover:bg-white/50 active:scale-95
                        transition-all duration-200
                        shadow-lg
                    "
                    aria-label="Go back to home"
                >
                    <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2} />
                </Link>

                {/* Title & Meta - Inside Hero Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
                    <div className="max-w-4xl">
                        {/* Rating Stars */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-0.5">
                                {renderStars(place.rating || 4.5)}
                            </div>
                            <span className="text-sm font-manrope text-white/90">
                                {place.rating || 4.5} ({(place.reviewCount || 0).toLocaleString()} {isVietnamese ? 'đánh giá' : 'reviews'})
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="font-tenor text-3xl md:text-4xl lg:text-5xl text-white leading-tight drop-shadow-lg">
                            {title}
                        </h1>
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* REFINED INFO & ACTION BAR */}
            {/* ================================================================= */}
            <section className="px-6 py-6 border-b border-gray-100">
                <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    {/* Status & Category */}
                    <div className="flex items-center gap-4">
                        {/* Open Status */}
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-manrope font-medium uppercase tracking-wide text-gray-600">
                                {t('detail.openNow')}
                            </span>
                        </div>

                        {/* Divider */}
                        <span className="text-gray-300">|</span>

                        {/* Category */}
                        <span className="text-xs font-manrope font-medium uppercase tracking-wide text-gray-600">
                            {place.category?.name || 'Attraction'}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {/* Call Button */}
                        {place.phone && (
                            <a
                                href={`tel:${place.phone}`}
                                className="
                                    p-3 rounded-full bg-white
                                    shadow-sm hover:shadow-md
                                    hover:scale-105 active:scale-95
                                    transition-all duration-200
                                "
                                aria-label={t('detail.call')}
                            >
                                <Phone className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                            </a>
                        )}

                        {/* Share Button */}
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: title,
                                        url: window.location.href
                                    });
                                }
                            }}
                            className="
                                p-3 rounded-full bg-white
                                shadow-sm hover:shadow-md
                                hover:scale-105 active:scale-95
                                transition-all duration-200
                            "
                            aria-label={t('detail.share')}
                        >
                            <Share2 className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
                        </button>

                        {/* Save Button */}
                        <button
                            onClick={() => setIsSaved(!isSaved)}
                            className={`
                                p-3 rounded-full
                                shadow-sm hover:shadow-md
                                hover:scale-105 active:scale-95
                                transition-all duration-200
                                ${isSaved ? 'bg-primary' : 'bg-white'}
                            `}
                            aria-label={isSaved ? t('detail.saved') : t('detail.save')}
                        >
                            <Bookmark
                                className={`w-5 h-5 transition-colors ${isSaved ? 'text-white fill-white' : 'text-gray-600'}`}
                                strokeWidth={1.5}
                            />
                        </button>
                    </div>
                </div>
            </section>

            {/* ================================================================= */}
            {/* CONTENT SECTIONS */}
            {/* ================================================================= */}
            <div className="px-6 md:px-8 lg:px-12 py-8 md:py-12 max-w-4xl mx-auto space-y-12">

                {/* Location & Hours Info */}
                <section className="flex flex-col md:flex-row gap-6 md:gap-12">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                        <div>
                            <p className="text-xs font-manrope font-medium uppercase tracking-wide text-gray-400 mb-1">
                                {t('detail.location')}
                            </p>
                            <p className="font-manrope text-gray-700 leading-relaxed">
                                {location}
                            </p>
                        </div>
                    </div>

                    {place.openingHours && (
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                            <div>
                                <p className="text-xs font-manrope font-medium uppercase tracking-wide text-gray-400 mb-1">
                                    {t('detail.hours')}
                                </p>
                                <p className="font-manrope text-gray-700 leading-relaxed">
                                    {place.openingHours}
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {/* Description */}
                <section>
                    <h2 className="font-tenor text-xl md:text-2xl text-gray-900 mb-4">
                        {t('detail.about')}
                    </h2>
                    <p className="font-manrope text-gray-700 leading-relaxed text-base md:text-lg">
                        {description}
                    </p>
                </section>

                {/* ============================================================= */}
                {/* AI'S TIP FEATURE BOX */}
                {/* ============================================================= */}
                {place.designerTip && (
                    <section className="bg-blue-700/10 rounded-2xl p-6 md:p-8">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/20 flex-shrink-0">
                                <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-tenor text-lg text-gray-900 mb-2">
                                    {t('detail.aiTip')}
                                </h3>
                                <p className="font-manrope font-medium text-gray-700 leading-relaxed">
                                    {place.designerTip}
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {/* ============================================================= */}
                {/* MAP SECTION */}
                {/* ============================================================= */}
                {place.latitude && place.longitude && (
                    <section>
                        <h2 className="font-tenor text-xl md:text-2xl text-gray-900 mb-4">
                            {t('detail.location')}
                        </h2>
                        <div className="rounded-3xl overflow-hidden shadow-lg">
                            <iframe
                                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.123456789!2d${place.longitude}!3d${place.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDU2JzMwLjAiTiAxMDjCsDI2JzE3LjAiRQ!5e1!3m2!1sen!2s!4v1703462400000!5m2!1sen!2s`}
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Map of ${title}`}
                                className="w-full h-72 md:h-80"
                            />
                        </div>
                    </section>
                )}

                {/* ============================================================= */}
                {/* REVIEWS SECTION */}
                {/* ============================================================= */}
                {place.reviews && place.reviews.length > 0 && (
                    <section>
                        <h2 className="font-tenor text-xl md:text-2xl text-gray-900 mb-4">
                            {t('detail.reviews')} ({place.reviews.length})
                        </h2>
                        <div className="space-y-4">
                            {place.reviews.map((review) => (
                                <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-xs font-medium text-gray-600">
                                                {review.user?.username?.[0]?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-manrope font-medium text-sm text-gray-800">
                                                {review.user?.username || 'Anonymous'}
                                            </p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {review.title && (
                                        <p className="font-manrope font-medium text-gray-800 mb-1">
                                            {review.title}
                                        </p>
                                    )}
                                    <p className="font-manrope text-sm text-gray-600">
                                        {review.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* ================================================================= */}
            {/* FIXED BOTTOM BUTTON */}
            {/* ================================================================= */}
            {place.latitude && place.longitude && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    <div className="max-w-4xl mx-auto">
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                w-full py-4 px-6 rounded-2xl
                                bg-[#2C3E50] hover:bg-[#34495E]
                                text-white font-manrope font-semibold text-base
                                flex items-center justify-center gap-2
                                transition-colors duration-200
                                active:scale-[0.98]
                            "
                            aria-label={t('detail.getDirections')}
                        >
                            <Navigation className="w-5 h-5" strokeWidth={1.5} />
                            {t('detail.getDirections')}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailPage;
