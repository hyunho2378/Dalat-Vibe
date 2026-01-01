import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from './StarRating';

// =============================================================================
// WritePostModal - Antigravity Glass Modal for Writing Reviews
// =============================================================================

const WritePostModal = ({ isOpen, onClose, onSubmit, user }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5); // 1-5 stars
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('Please fill in all fields.');
            return;
        }

        if (rating < 1 || rating > 5) {
            alert('Please select a rating.');
            return;
        }

        setIsSubmitting(true);

        const newReview = {
            id: Date.now(),
            title: title.trim(),
            content: content.trim(),
            rating, // Now 1-5 stars
            author: user?.name || user?.username || 'Anonymous',
            authorAvatar: user?.avatar || null,
            date: new Date().toISOString(),
            language: 'en',
            tags: ['User Review'],
            isCustom: true
        };

        // Simulate a brief delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));

        onSubmit(newReview);

        // Reset form
        setTitle('');
        setContent('');
        setRating(5);
        setIsSubmitting(false);
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <h2 className="font-tenor text-xl text-white">Write a Review</h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-white/60" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Give your review a title..."
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors"
                                    maxLength={100}
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">
                                    Your Experience
                                </label>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your thoughts about Dalat..."
                                    rows={5}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-colors resize-none"
                                    maxLength={1000}
                                />
                                <p className="text-xs text-white/30 mt-1 text-right">
                                    {content.length}/1000
                                </p>
                            </div>

                            {/* Star Rating Selector */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-3">
                                    Your Rating
                                </label>
                                <div className="flex items-center gap-4">
                                    <StarRating
                                        rating={rating}
                                        onChange={setRating}
                                        size="lg"
                                    />
                                    <span className="text-white/50 text-sm font-manrope">
                                        {rating} / 5
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !title.trim() || !content.trim()}
                                className={`
                                    w-full py-3.5 rounded-xl font-medium
                                    transition-all duration-200
                                    ${isSubmitting || !title.trim() || !content.trim()
                                        ? 'bg-white/10 text-white/30 cursor-not-allowed'
                                        : 'bg-slate-800 hover:bg-slate-700 text-white active:scale-[0.98]'
                                    }
                                `}
                            >
                                {isSubmitting ? 'Posting...' : 'Post Review'}
                            </button>
                        </form>

                        {/* Author Preview */}
                        <div className="px-6 pb-6">
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {user?.name?.charAt(0) || user?.username?.charAt(0) || '?'}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-white font-medium">{user?.name || user?.username || 'Anonymous'}</p>
                                    <p className="text-xs text-white/40">Posting as</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WritePostModal;
