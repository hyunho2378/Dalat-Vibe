import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, MapPin } from 'lucide-react';

const PlaceCard = ({ place }) => {
    const { i18n } = useTranslation();
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const isVietnamese = i18n.language === 'vi';

    // Get translated title and location
    const title = isVietnamese && place.titleVi ? place.titleVi : place.title;
    const location = isVietnamese && place.locationVi ? place.locationVi : place.location;

    return (
        <Link
            to={`/place/${place.id}`}
            className="
                relative flex-shrink-0 w-[280px] md:w-[320px]
                snap-start scroll-ml-5
                group cursor-pointer
                block
            "
        >
            {/* Image Container with 3:4 Aspect Ratio */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-primary/5">
                {/* Skeleton loader */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/10 animate-pulse" />
                )}

                <img
                    src={place.image || place.imagePath}
                    alt={title}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className={`
                        absolute inset-0 w-full h-full object-cover
                        transition-all duration-500 ease-out
                        ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                        group-hover:scale-105 group-active:scale-105
                    `}
                />

                {/* Gradient Overlay */}
                <div className="
                    absolute inset-0 
                    bg-gradient-to-t from-foreground/60 via-transparent to-transparent
                    opacity-70 group-hover:opacity-90 transition-opacity duration-300
                " />

                {/* Category Tag */}
                <div className="
                    absolute top-4 left-4 
                    px-3 py-1.5 rounded-full
                    bg-white/80 backdrop-blur-sm
                    text-xs font-manrope font-medium text-foreground/80
                    z-10
                ">
                    {place.category?.name || place.category}
                </div>

                {/* Like Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsLiked(!isLiked);
                    }}
                    className="
                        absolute top-4 right-4 
                        p-2 rounded-full
                        bg-white/80 backdrop-blur-sm
                        hover:bg-white transition-colors duration-200
                        z-10
                    "
                    aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart
                        className={`
                            w-4 h-4 transition-all duration-300
                            ${isLiked ? 'fill-accent text-accent scale-110' : 'text-foreground/60'}
                        `}
                        strokeWidth={1.5}
                    />
                </button>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="font-tenor text-lg text-white mb-1 leading-tight">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/80">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span className="text-xs font-manrope font-light">
                            {location}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PlaceCard;
