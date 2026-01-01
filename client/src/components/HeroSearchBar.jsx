import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';

const HeroSearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch?.(query);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`
                relative flex items-center gap-3 px-6 md:px-8 py-4 md:py-5
                bg-white rounded-full shadow-xl
                transition-all duration-300 ease-out
                ${isFocused ? 'shadow-2xl scale-[1.01]' : 'shadow-xl'}
            `}
            role="search"
            aria-label="Search destinations"
        >
            <Search
                className={`
                    w-5 h-5 md:w-6 md:h-6 transition-colors duration-300
                    ${isFocused ? 'text-primary' : 'text-foreground/40'}
                `}
                strokeWidth={1.5}
            />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Where does your heart want to go?"
                className="
                    flex-1 bg-transparent outline-none
                    font-manrope text-base md:text-lg text-foreground
                    placeholder:text-foreground/40 placeholder:font-light
                "
                aria-label="Search destinations"
            />
            {query && (
                <button
                    type="submit"
                    className="
                        p-2.5 rounded-full bg-primary/10 
                        hover:bg-primary/20 transition-colors
                    "
                    aria-label="Search"
                >
                    <ChevronRight className="w-5 h-5 text-primary" strokeWidth={2} />
                </button>
            )}
        </form>
    );
};

export default HeroSearchBar;
