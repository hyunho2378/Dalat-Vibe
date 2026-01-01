import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, X, MapPin, Utensils, Coffee, Building2, TreePine } from 'lucide-react';

// =============================================================================
// Smart Search Bar Component
// Glassmorphism design with animated expand/collapse and real-time search
// =============================================================================

const SearchBar = ({ scrolled }) => {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [allPlaces, setAllPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const isVietnamese = i18n.language === 'vi';

    // Fetch all places on mount
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await fetch('/api/places');
                if (response.ok) {
                    const data = await response.json();
                    setAllPlaces(data);
                }
            } catch (err) {
                console.error('Failed to fetch places for search:', err);
            }
        };
        fetchPlaces();
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                setQuery('');
                setResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
                setResults([]);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Real-time search filtering
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        const searchQuery = query.toLowerCase().trim();

        const filtered = allPlaces.filter((place) => {
            const title = (place.title || '').toLowerCase();
            const titleVi = (place.titleVi || '').toLowerCase();
            const description = (place.description || '').toLowerCase();
            const descriptionVi = (place.descriptionVi || '').toLowerCase();
            const location = (place.location || '').toLowerCase();
            const locationVi = (place.locationVi || '').toLowerCase();
            const category = (place.category?.name || '').toLowerCase();

            return (
                title.includes(searchQuery) ||
                titleVi.includes(searchQuery) ||
                description.includes(searchQuery) ||
                descriptionVi.includes(searchQuery) ||
                location.includes(searchQuery) ||
                locationVi.includes(searchQuery) ||
                category.includes(searchQuery)
            );
        });

        setResults(filtered.slice(0, 8)); // Limit to 8 results
        setLoading(false);
    }, [query, allPlaces]);

    // Get category icon
    const getCategoryIcon = (categoryName) => {
        const name = (categoryName || '').toLowerCase();
        if (name.includes('restaurant') || name.includes('street food')) {
            return <Utensils className="w-4 h-4" />;
        }
        if (name.includes('café') || name.includes('cafe')) {
            return <Coffee className="w-4 h-4" />;
        }
        if (name.includes('architecture') || name.includes('historic')) {
            return <Building2 className="w-4 h-4" />;
        }
        if (name.includes('nature') || name.includes('waterfall') || name.includes('lake')) {
            return <TreePine className="w-4 h-4" />;
        }
        return <MapPin className="w-4 h-4" />;
    };

    // Handle result click
    const handleResultClick = (place) => {
        navigate(`/place/${place.id}`);
        setIsOpen(false);
        setQuery('');
        setResults([]);
    };

    // Toggle search
    const handleToggle = () => {
        if (isOpen) {
            setIsOpen(false);
            setQuery('');
            setResults([]);
        } else {
            setIsOpen(true);
        }
    };

    return (
        <div ref={containerRef} className="relative">
            {/* Search Button / Expanded Input */}
            <div className={`
                flex items-center gap-2
                transition-all duration-300 ease-out
                ${isOpen
                    ? `w-64 md:w-80 px-4 py-2 rounded-full ${scrolled
                        ? 'bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg'
                        : 'bg-white/15 backdrop-blur-md border border-white/20 shadow-lg'
                    }`
                    : ''
                }
            `}>
                {/* Search Icon / Button */}
                <button
                    onClick={handleToggle}
                    className={`
                        flex items-center justify-center
                        transition-all duration-300
                        ${isOpen
                            ? 'w-5 h-5'
                            : `w-9 h-9 rounded-full ${scrolled
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                            }`
                        }
                    `}
                    aria-label={isOpen ? 'Close search' : 'Open search'}
                >
                    <Search className={`
                        transition-all duration-300
                        ${isOpen
                            ? `w-4 h-4 ${scrolled ? 'text-slate-500' : 'text-white/70'}`
                            : 'w-4 h-4'
                        }
                    `} strokeWidth={1.5} />
                </button>

                {/* Input Field (visible when open) */}
                {isOpen && (
                    <>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={isVietnamese ? 'Tìm kiếm địa điểm...' : 'Search places...'}
                            className={`
                                flex-1 bg-transparent outline-none
                                font-manrope text-sm
                                ${scrolled ? 'text-slate-800 placeholder:text-slate-400' : 'text-white placeholder:text-white/50'}
                            `}
                        />

                        {/* Clear / Close Button */}
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery('');
                                    setResults([]);
                                    inputRef.current?.focus();
                                }}
                                className={`
                                    p-1 rounded-full transition-colors
                                    ${scrolled ? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white/10 text-white/60'}
                                `}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Search Results Dropdown - Glassmorphism */}
            {isOpen && results.length > 0 && (
                <div className={`
                    absolute top-full left-0 right-0 mt-2
                    max-h-80 overflow-y-auto
                    rounded-2xl
                    backdrop-blur-xl
                    border shadow-2xl
                    animate-fade-in-up
                    ${scrolled
                        ? 'bg-white/90 border-slate-200/50'
                        : 'bg-slate-900/80 border-white/20'
                    }
                `}>
                    {results.map((place) => {
                        const title = isVietnamese && place.titleVi ? place.titleVi : place.title;
                        const location = isVietnamese && place.locationVi ? place.locationVi : place.location;

                        return (
                            <button
                                key={place.id}
                                onClick={() => handleResultClick(place)}
                                className={`
                                    w-full flex items-center gap-3 p-3
                                    transition-colors text-left
                                    first:rounded-t-2xl last:rounded-b-2xl
                                    ${scrolled
                                        ? 'hover:bg-slate-100/80 border-b border-slate-100 last:border-b-0'
                                        : 'hover:bg-white/10 border-b border-white/10 last:border-b-0'
                                    }
                                `}
                            >
                                {/* Place Image */}
                                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                                    <img
                                        src={place.imagePath}
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Place Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className={`
                                        font-manrope font-medium text-sm truncate
                                        ${scrolled ? 'text-slate-800' : 'text-white'}
                                    `}>
                                        {title}
                                    </h4>
                                    <div className={`
                                        flex items-center gap-1.5 mt-0.5
                                        ${scrolled ? 'text-slate-500' : 'text-white/60'}
                                    `}>
                                        {getCategoryIcon(place.category?.name)}
                                        <span className="font-manrope text-xs truncate">
                                            {place.category?.name || 'Attraction'} • {location}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* No Results State */}
            {isOpen && query && results.length === 0 && !loading && (
                <div className={`
                    absolute top-full left-0 right-0 mt-2
                    p-4 rounded-2xl text-center
                    backdrop-blur-xl border shadow-2xl
                    ${scrolled
                        ? 'bg-white/90 border-slate-200/50 text-slate-500'
                        : 'bg-slate-900/80 border-white/20 text-white/60'
                    }
                `}>
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-manrope text-sm">
                        {isVietnamese ? 'Không tìm thấy kết quả' : 'No results found'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
