import { useState } from 'react';
import { Star } from 'lucide-react';

// =============================================================================
// StarRating Component - Interactive 1-5 star rating
// =============================================================================

const StarRating = ({ rating = 0, onChange, size = 'md', readonly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const sizeClass = sizes[size] || sizes.md;

    const handleClick = (value) => {
        if (!readonly && onChange) {
            onChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (!readonly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (!readonly) {
            setHoverRating(0);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div
            className="flex gap-1"
            onMouseLeave={handleMouseLeave}
        >
            {[1, 2, 3, 4, 5].map((value) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => handleClick(value)}
                    onMouseEnter={() => handleMouseEnter(value)}
                    disabled={readonly}
                    className={`
                        transition-all duration-150
                        ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                        ${!readonly && 'active:scale-95'}
                    `}
                    aria-label={`Rate ${value} stars`}
                >
                    <Star
                        className={`
                            ${sizeClass}
                            transition-colors duration-150
                            ${value <= displayRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-transparent text-white/30'
                            }
                        `}
                        strokeWidth={1.5}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRating;
