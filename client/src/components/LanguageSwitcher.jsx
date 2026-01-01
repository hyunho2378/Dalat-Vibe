import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

// =============================================================================
// Language Configuration
// =============================================================================

const languages = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
];

// =============================================================================
// Language Switcher Component - Premium Glass Button Design
// =============================================================================

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (langCode) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
        localStorage.setItem('dalat_lang', langCode);
    };

    return (
        <div ref={dropdownRef} className="relative">
            {/* Globe Trigger Button - HIGHLY VISIBLE */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    flex items-center justify-center gap-1.5
                    px-3 py-2 rounded-full
                    bg-gray-100 hover:bg-gray-200
                    text-gray-700 hover:text-gray-900
                    border border-gray-200
                    transition-all duration-200
                    shadow-sm
                "
                aria-label="Select language"
            >
                <Globe className="w-4 h-4" strokeWidth={2} />
                <span className="text-xs font-medium uppercase">{currentLanguage.code}</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="
                    absolute right-0 top-full mt-2
                    w-48 py-2
                    bg-slate-900/95 backdrop-blur-xl
                    border border-white/20 rounded-xl
                    shadow-2xl shadow-black/30
                    z-[100]
                ">
                    {/* Header */}
                    <div className="px-4 py-2.5 border-b border-white/10">
                        <p className="font-manrope text-xs text-white/50 uppercase tracking-wider">
                            Select Language
                        </p>
                    </div>

                    {/* Language Options */}
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`
                                    w-full px-4 py-2.5
                                    flex items-center justify-between
                                    font-manrope text-sm
                                    transition-colors duration-150
                                    ${i18n.language === lang.code
                                        ? 'text-white bg-white/15'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{lang.flag}</span>
                                    <span>{lang.label}</span>
                                </div>
                                {i18n.language === lang.code && (
                                    <Check className="w-4 h-4 text-emerald-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
