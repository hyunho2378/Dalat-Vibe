import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smile,
    Meh,
    Frown,
    ChevronLeft,
    ChevronRight,
    ThumbsUp,
    Globe,
    Star,
    PenLine,
    MessageCircle,
    Share2,
    Calendar
} from 'lucide-react';
import { reviewsPart1, reviewsPart2 } from '../data/mockReviews';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import WritePostModal from '../components/WritePostModal';

// =============================================================================
// Constants
// =============================================================================

const ITEMS_PER_PAGE = 12; // Adjusted for grid layout
const CUSTOM_REVIEWS_KEY = 'dalat_custom_reviews';

const staticReviews = [...reviewsPart1, ...reviewsPart2];

const FILTERS = {
    ALL: 'all',
    POSITIVE: 'positive',
    NEUTRAL: 'neutral',
    CRITICAL: 'critical'
};

// =============================================================================
// Helper Functions
// =============================================================================

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
// Components
// =============================================================================

const ReviewCard = ({ review }) => {
    const ratingNum = getRatingNumber(review.rating);
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongContent = review.content.length > 150;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors duration-300 flex flex-col h-full"
        >
            <div className="p-5 flex flex-col h-full">
                {/* Header: Author & Rating */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        {review.avatar || review.authorAvatar ? (
                            <img
                                src={review.avatar || review.authorAvatar}
                                alt={review.author}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-2 ring-white/10">
                                <span className="text-white font-medium">
                                    {review.author?.charAt(0) || '?'}
                                </span>
                            </div>
                        )}

                        <div>
                            <h3 className="font-manrope font-semibold text-white text-sm">
                                {review.author}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-white/40">
                                <span className="flex items-center gap-1">
                                    <Globe className="w-3 h-3" />
                                    {(review.language || 'en').toUpperCase()}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(review.date)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/5">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-white">{ratingNum}.0</span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1">
                    {review.title && (
                        <h4 className="font-tenor text-lg text-white mb-2 leading-snug">
                            {review.title}
                        </h4>
                    )}

                    <div className="relative">
                        <p className={`font-manrope text-sm text-white/80 leading-relaxed ${!isExpanded && isLongContent ? 'line-clamp-3' : ''}`}>
                            {review.content}
                        </p>
                        {isLongContent && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsExpanded(!isExpanded);
                                }}
                                className="text-xs text-blue-400 hover:text-blue-300 font-medium mt-1 inline-block"
                            >
                                {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                        )}
                    </div>

                    {/* Tags */}
                    {review.tags && review.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {review.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 rounded-md bg-white/5 text-white/50 text-xs font-manrope border border-white/5"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-white/40">
                    <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors group">
                        <ThumbsUp className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                        <span>{review.helpful || 0}</span>
                    </button>

                    <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>Reply</span>
                    </button>

                    <button className="flex items-center gap-1.5 text-xs hover:text-white transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const FilterButton = ({ icon: Icon, label, count, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border
                ${isActive
                    ? 'bg-white text-slate-900 border-white shadow-lg shadow-white/10 font-medium'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }
            `}
        >
            <Icon className="w-4 h-4" />
            <span className="font-manrope text-sm">
                {label} <span className="opacity-50 ml-1 text-xs">({count})</span>
            </span>
        </button>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/10"
            >
                <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-2">
                {pages.map((page) => {
                    // Logic to show limited pages if too many
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`
                                    w-10 h-10 rounded-xl font-manrope text-sm font-medium transition-all border
                                    ${currentPage === page
                                        ? 'bg-white text-slate-900 border-white shadow-lg shadow-white/20'
                                        : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                            >
                                {page}
                            </button>
                        );
                    } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                    ) {
                        return <span key={page} className="text-white/30 px-1">...</span>;
                    }
                    return null;
                })}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/10"
            >
                <ChevronRight className="w-5 h-5 text-white" />
            </button>
        </div>
    );
};

// =============================================================================
// Main Community Page
// =============================================================================

const Community = () => {
    const { user, isAuthenticated } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState(FILTERS.ALL);
    const [customReviews, setCustomReviews] = useState([]);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [writeModalOpen, setWriteModalOpen] = useState(false);

    // Load custom reviews
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

    // Merge reviews
    const allReviews = useMemo(() => {
        return [...customReviews, ...staticReviews];
    }, [customReviews]);

    // Counts
    const reviewCounts = useMemo(() => ({
        all: allReviews.length,
        positive: allReviews.filter(r => getRatingNumber(r.rating) >= 4).length,
        neutral: allReviews.filter(r => getRatingNumber(r.rating) === 3).length,
        critical: allReviews.filter(r => getRatingNumber(r.rating) <= 2).length
    }), [allReviews]);

    // Filter Logic
    const filteredReviews = useMemo(() => {
        switch (activeFilter) {
            case FILTERS.POSITIVE:
                return allReviews.filter(r => getRatingNumber(r.rating) >= 4);
            case FILTERS.NEUTRAL:
                return allReviews.filter(r => getRatingNumber(r.rating) === 3);
            case FILTERS.CRITICAL:
                return allReviews.filter(r => getRatingNumber(r.rating) <= 2);
            default:
                return allReviews;
        }
    }, [activeFilter, allReviews]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentReviews = filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNewReview = (newReview) => {
        const updatedReviews = [newReview, ...customReviews];
        setCustomReviews(updatedReviews);
        localStorage.setItem(CUSTOM_REVIEWS_KEY, JSON.stringify(updatedReviews));
        setCurrentPage(1);
        setActiveFilter(FILTERS.ALL);
    };

    const handleWriteClick = () => {
        if (!isAuthenticated || !user) {
            setLoginModalOpen(true);
            return;
        }
        setWriteModalOpen(true);
    };

    return (
        <>
            <article className="min-h-screen bg-slate-950 text-white pt-20 pb-16">

                {/* Hero / Header Section */}
                <div className="relative bg-[#0B1026] border-b border-white/5 pb-12 pt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                                    <MessageCircle className="w-3 h-3" />
                                    Community Feed
                                </div>
                                <h1 className="font-tenor text-4xl md:text-5xl leading-tight mb-4">
                                    Traveler Stories
                                </h1>
                                <p className="font-manrope text-white/60 max-w-xl text-lg">
                                    Discover hidden gems, honest reviews, and unforgettable moments shared by the Dalat Vibe community.
                                </p>
                            </div>

                            <button
                                onClick={handleWriteClick}
                                className="
                                    group inline-flex items-center gap-3
                                    px-6 py-4 rounded-2xl
                                    bg-white text-slate-950 font-bold
                                    shadow-xl shadow-white/5
                                    hover:shadow-white/10 hover:scale-[1.02]
                                    transition-all duration-300
                                "
                            >
                                <PenLine className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                <span>Write a Review</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                    {/* Filter Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div className="flex flex-wrap items-center gap-3">
                            <FilterButton
                                icon={Globe}
                                label="All Reviews"
                                count={reviewCounts.all}
                                isActive={activeFilter === FILTERS.ALL}
                                onClick={() => setActiveFilter(FILTERS.ALL)}
                            />
                            <div className="w-px h-6 bg-white/10 hidden sm:block mx-1" />
                            <FilterButton
                                icon={Smile}
                                label="Positive"
                                count={reviewCounts.positive}
                                isActive={activeFilter === FILTERS.POSITIVE}
                                onClick={() => setActiveFilter(FILTERS.POSITIVE)}
                            />
                            <FilterButton
                                icon={Meh}
                                label="Neutral"
                                count={reviewCounts.neutral}
                                isActive={activeFilter === FILTERS.NEUTRAL}
                                onClick={() => setActiveFilter(FILTERS.NEUTRAL)}
                            />
                            <FilterButton
                                icon={Frown}
                                label="Critical"
                                count={reviewCounts.critical}
                                isActive={activeFilter === FILTERS.CRITICAL}
                                onClick={() => setActiveFilter(FILTERS.CRITICAL)}
                            />
                        </div>
                    </div>

                    {/* Grid Layout */}
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {currentReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {currentReviews.length === 0 && (
                        <div className="py-20 text-center bg-white/5 rounded-3xl border border-white/5">
                            <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <h3 className="font-tenor text-xl text-white mb-2">No reviews found</h3>
                            <p className="font-manrope text-white/40">Try adjusting your filters to see more stories.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </article>

            {/* Modals */}
            <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
            <WritePostModal
                isOpen={writeModalOpen}
                onClose={() => setWriteModalOpen(false)}
                onSubmit={handleNewReview}
                user={user}
            />
        </>
    );
};

export default Community;
