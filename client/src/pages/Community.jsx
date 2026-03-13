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
    Calendar,
    Languages, // 번역 아이콘 추가
    Loader2   // 로딩 아이콘 추가
} from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 사용자의 현재 언어를 알기 위해 추가
import { reviewsPart1, reviewsPart2 } from '../data/mockReviews';
import { useAuth } from '../context/AuthContext';
import LoginModal from '../components/LoginModal';
import WritePostModal from '../components/WritePostModal';

// =============================================================================
// Constants
// =============================================================================

// 백엔드 API 주소 (환경에 맞게 수정)
const API_BASE = 'https://dalat-vibe.onrender.com/api';
const ITEMS_PER_PAGE = 12;
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
    const { i18n } = useTranslation(); // 현재 UI 언어 가져오기
    const ratingNum = getRatingNumber(review.rating);
    const [isExpanded, setIsExpanded] = useState(false);

    // 번역 관련 상태 추가
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedText, setTranslatedText] = useState('');
    const [showTranslation, setShowTranslation] = useState(false);

    const isLongContent = review.content.length > 150;

    // 번역 API 호출 함수
    const handleTranslate = async (e) => {
        e.stopPropagation();

        // 1. 이미 번역본을 보고 있다면 원문으로 토글
        if (showTranslation) {
            setShowTranslation(false);
            return;
        }

        // 2. 이미 번역을 해둔 캐시 데이터가 있다면 API 호출 없이 바로 보여줌
        if (translatedText) {
            setShowTranslation(true);
            return;
        }

        // 3. 번역 API 호출
        setIsTranslating(true);
        try {
            const response = await fetch(`${API_BASE}/reviews/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: review.content,
                    targetLanguage: i18n.language || 'en' // 사용자의 현재 언어로 번역 요청
                })
            });

            const data = await response.json();
            if (data.translatedText) {
                setTranslatedText(data.translatedText);
                setShowTranslation(true);
            }
        } catch (error) {
            console.error('Translation error:', error);
        } finally {
            setIsTranslating(false);
        }
    };

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

                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 border border-white/5">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-white">{ratingNum}.0</span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 flex flex-col">
                    {review.title && (
                        <h4 className="font-tenor text-lg text-white mb-2 leading-snug">
                            {review.title}
                        </h4>
                    )}

                    <div className="relative">
                        <p className={`font-manrope text-sm text-white/80 leading-relaxed whitespace-pre-wrap ${!isExpanded && isLongContent ? 'line-clamp-3' : ''}`}>
                            {/* 상태에 따라 원문 또는 번역본 보여주기 */}
                            {showTranslation ? translatedText : review.content}
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

                    {/* Tags & Translate Button (하단 배치로 반응형 안 깨지게 설계) */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-4">
                        {/* Tags */}
                        {review.tags && review.tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {review.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 rounded-md bg-white/5 text-white/50 text-xs font-manrope border border-white/5"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        ) : <div />}

                        {/* Translate Button */}
                        <button
                            onClick={handleTranslate}
                            disabled={isTranslating}
                            className={`
                                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border
                                ${showTranslation
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30'
                                    : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80'
                                }
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {isTranslating ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Translating...</span>
                                </>
                            ) : (
                                <>
                                    <Languages className="w-3.5 h-3.5" />
                                    <span>{showTranslation ? 'View Original' : 'Translate'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-white/40">
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

// ... 아래의 Community 메인 컴포넌트, FilterButton, Pagination 코드는 원본과 100% 동일하게 유지 ...
// (분량상 생략 없이 하단에 그대로 이어 붙여주면 돼!)