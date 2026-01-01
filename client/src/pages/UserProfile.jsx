import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Heart, MessageSquare, MapPin, ArrowLeft, Star, Smile, Meh, Frown, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// =============================================================================
// Constants
// =============================================================================

const CUSTOM_REVIEWS_KEY = 'dalat_custom_reviews';

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
// Helper Functions
// =============================================================================

const getSentimentIcon = (rating) => {
    if (typeof rating === 'string') {
        if (rating === 'positive') return Smile;
        if (rating === 'neutral') return Meh;
        return Frown;
    }
    if (rating >= 4) return Smile;
    if (rating >= 3) return Meh;
    return Frown;
};

const getRatingNumber = (rating) => {
    if (typeof rating === 'number') return rating;
    if (rating === 'positive') return 5;
    if (rating === 'neutral') return 3;
    return 2;
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

// =============================================================================
// Review Card Component
// =============================================================================

const ReviewCard = ({ review, onDelete }) => {
    const SentimentIcon = getSentimentIcon(review.rating);
    const ratingNum = getRatingNumber(review.rating);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-colors"
        >
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                    <h3 className="font-tenor text-lg text-white mb-1">
                        {review.title || 'Untitled Review'}
                    </h3>
                    <p className="font-manrope text-xs text-white/40">
                        {formatDate(review.date)}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <SentimentIcon className="w-5 h-5 text-white/60" />
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < ratingNum ? 'text-white fill-white' : 'text-white/20'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <p className="font-manrope text-sm text-white/70 leading-relaxed mb-4 line-clamp-3">
                {review.content}
            </p>

            <div className="flex items-center justify-between">
                {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {review.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-0.5 rounded-full bg-white/5 text-white/40 text-xs"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => onDelete(review.id)}
                    className="p-2 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                    title="Delete review"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

// =============================================================================
// User Profile Page
// =============================================================================

const UserProfile = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const [customReviews, setCustomReviews] = useState([]);

    // Load custom reviews from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(CUSTOM_REVIEWS_KEY);
            if (stored) {
                setCustomReviews(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load custom reviews:', e);
        }
    }, []);

    // Filter reviews by current user
    const userReviews = useMemo(() => {
        if (!user) return [];
        return customReviews.filter(review => review.author === user.name);
    }, [customReviews, user]);

    // Redirect to home if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, isLoading, navigate]);

    // Handle delete review
    const handleDeleteReview = (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        const updatedReviews = customReviews.filter(r => r.id !== reviewId);
        setCustomReviews(updatedReviews);
        localStorage.setItem(CUSTOM_REVIEWS_KEY, JSON.stringify(updatedReviews));
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <article className="min-h-screen bg-slate-950 text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-manrope text-sm">Back</span>
                    </button>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="text-center"
                    >
                        {/* Avatar */}
                        <motion.div
                            variants={fadeInUp}
                            className="mb-6"
                        >
                            <div className="relative inline-block">
                                <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center border-4 border-white/20">
                                    <User className="w-16 h-16 text-white/70" strokeWidth={1.5} />
                                </div>
                                <div className="absolute inset-0 rounded-full ring-4 ring-white/10 ring-offset-4 ring-offset-slate-950" />
                            </div>
                        </motion.div>

                        {/* Name */}
                        <motion.h1
                            variants={fadeInUp}
                            className="font-tenor text-4xl md:text-5xl mb-3"
                        >
                            {user.name || user.username}
                        </motion.h1>

                        {/* Email */}
                        <motion.p
                            variants={fadeInUp}
                            className="font-manrope text-lg text-white/50"
                        >
                            {user.email}
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex items-center justify-center gap-8 mt-8"
                        >
                            <div className="text-center">
                                <p className="font-tenor text-2xl text-white">12</p>
                                <p className="font-manrope text-xs text-white/40 uppercase tracking-wider">Trips</p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <p className="font-tenor text-2xl text-white">47</p>
                                <p className="font-manrope text-xs text-white/40 uppercase tracking-wider">Saved</p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <p className="font-tenor text-2xl text-white">{userReviews.length}</p>
                                <p className="font-manrope text-xs text-white/40 uppercase tracking-wider">Reviews</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section: Saved Trips */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                        className="mb-12"
                    >
                        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-6">
                            <Heart className="w-5 h-5 text-white/60" />
                            <h2 className="font-tenor text-2xl">Saved Trips</h2>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center"
                        >
                            <MapPin className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <p className="font-manrope text-white/40">
                                Your saved destinations will appear here
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Section: My Reviews */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={stagger}
                    >
                        <motion.div variants={fadeInUp} className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-white/60" />
                                <h2 className="font-tenor text-2xl">My Reviews</h2>
                            </div>
                            <Link
                                to="/community"
                                className="font-manrope text-sm text-slate-400 hover:text-slate-300 transition-colors"
                            >
                                Write a Review →
                            </Link>
                        </motion.div>

                        {userReviews.length > 0 ? (
                            <motion.div
                                variants={fadeInUp}
                                className="grid gap-4"
                            >
                                {userReviews.map((review) => (
                                    <ReviewCard
                                        key={review.id}
                                        review={review}
                                        onDelete={handleDeleteReview}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={fadeInUp}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center"
                            >
                                <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-4" />
                                <p className="font-manrope text-white/40 mb-4">
                                    No reviews written yet
                                </p>
                                <Link
                                    to="/community"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors"
                                >
                                    Write Your First Review
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>
        </article>
    );
};

export default UserProfile;
