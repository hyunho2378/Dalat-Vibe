import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Check, LogIn, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import SearchBar from './SearchBar';

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
// Avatar Dropdown Component
// =============================================================================

const AvatarDropdown = ({ user, onLogout }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-slate-400/50 transition-all flex items-center justify-center bg-slate-700"
            >
                {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <User className="w-5 h-5 text-white" strokeWidth={1.5} />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 py-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-[100]">
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="font-medium text-white text-sm">{user.name || user.username}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                        <button
                            onClick={() => { setIsOpen(false); navigate('/profile'); }}
                            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <User className="w-4 h-4" /> {t('auth.profile') || 'Profile'}
                        </button>
                        <button
                            onClick={() => { setIsOpen(false); onLogout(); navigate('/'); }}
                            className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> {t('auth.logout') || 'Logout'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// Navbar Component
// =============================================================================

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const langRef = useRef(null);

    // Nav Links
    const navLinks = [
        { key: 'nav.home', label: t('nav.home') || 'Home', to: "/" },
        { key: 'nav.weather', label: t('nav.weather') || 'Weather', to: "/weather" },
        { key: 'nav.intro', label: t('nav.intro') || 'Dalat', to: "/intro" },
        { key: 'nav.recs', label: t('nav.recs') || 'Curation', to: "/ai-recs" },
        { key: 'nav.local', label: t('nav.local') || 'Dining', to: "/local-eats" },
        { key: 'nav.community', label: t('nav.community') || 'Community', to: "/community" },
    ];

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    useEffect(() => {
        const onClick = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) {
                setLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    const handleLanguageChange = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('dalat_lang', code);
        setLangMenuOpen(false);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-slate-950/95 backdrop-blur-md shadow-lg shadow-black/10'
                    : 'bg-gradient-to-b from-black/60 to-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

                    {/* ===== LOGO ===== */}
                    <Link
                        to="/"
                        className="font-tenor text-xl md:text-2xl transition-colors text-white z-50"
                    >
                        Dalat Vibe
                    </Link>

                    {/* ===== DESKTOP NAV ===== */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) => `
                                    relative text-sm font-medium py-1 transition-colors
                                    text-white/80 hover:text-white
                                    ${isActive ? 'text-white font-bold' : ''}
                                `}
                            >
                                {({ isActive }) => (
                                    <>
                                        {link.label}
                                        <span className={`
                                            absolute bottom-0 left-0 right-0 h-0.5 rounded-full
                                            transition-transform duration-300 origin-left bg-white
                                            ${isActive ? 'scale-x-100' : 'scale-x-0'}
                                        `} />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* ===== RIGHT CONTROLS ===== */}
                    <div className="flex items-center gap-3 z-50">
                        {/* Search Bar - Desktop */}
                        <div className="hidden md:block">
                            <SearchBar scrolled={scrolled} />
                        </div>

                        {/* Language Toggle */}
                        <div ref={langRef} className="relative hidden md:block">
                            <button
                                onClick={() => setLangMenuOpen(!langMenuOpen)}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                    font-manrope text-xs font-medium transition-all
                                    bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm
                                `}
                            >
                                <Globe className="w-3.5 h-3.5" />
                                <span>{i18n.language.toUpperCase()}</span>
                            </button>
                            {langMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-slate-900 border border-white/20 rounded-xl shadow-2xl z-[100]">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={`w-full px-4 py-2.5 flex items-center justify-between text-sm transition-colors ${i18n.language === lang.code
                                                ? 'text-white bg-white/15'
                                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{lang.flag}</span>
                                                <span>{lang.label}</span>
                                            </div>
                                            {i18n.language === lang.code && <Check className="w-4 h-4 text-slate-400" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Auth */}
                        <div className="hidden md:block">
                            {isAuthenticated && user ? (
                                <AvatarDropdown user={user} onLogout={logout} />
                            ) : (
                                <button
                                    onClick={() => setLoginModalOpen(true)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-medium
                                        transition-all active:scale-95
                                        bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm
                                    `}
                                >
                                    {t('auth.login') || 'Login'}
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* ===== MOBILE MENU OVERLAY ===== */}
            <div className={`
                fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-950 z-[60] lg:hidden
                flex flex-col pt-24 pb-8 px-8 overflow-y-auto
                transition-all duration-300 ease-in-out
                ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
            `}>
                {/* Close button */}
                <button
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    aria-label="Close menu"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Logo */}
                <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="absolute top-4 left-8 font-tenor text-xl text-white"
                >
                    Dalat Vibe
                </Link>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) => `
                                text-lg font-medium py-4 px-4 rounded-xl transition-all
                                ${isActive 
                                    ? 'text-white bg-white/10' 
                                    : 'text-white/70 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Divider */}
                <div className="my-6 border-t border-white/10" />

                {/* Mobile Auth & Language */}
                <div className="space-y-6">
                    {/* Language Selector */}
                    <div className="bg-white/5 rounded-2xl p-4">
                        <p className="text-sm text-white/50 mb-3">Language</p>
                        <div className="flex flex-wrap gap-2">
                            {languages.map(lang => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${
                                        i18n.language === lang.code 
                                            ? 'bg-white text-slate-900 font-semibold' 
                                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                                    }`}
                                >
                                    <span>{lang.flag}</span>
                                    <span>{lang.code.toUpperCase()}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Section */}
                    {isAuthenticated && user ? (
                        <div className="bg-white/5 rounded-2xl p-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                                    ) : (
                                        <User className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white truncate">{user.name}</p>
                                    <p className="text-sm text-white/50 truncate">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => { logout(); setMenuOpen(false); }}
                                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white flex items-center justify-center gap-2 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setLoginModalOpen(true); setMenuOpen(false); }}
                            className="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold text-lg hover:bg-white/90 transition-colors"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>

            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onSwitchToRegister={() => { setLoginModalOpen(false); setRegisterModalOpen(true); }}
            />
            <RegisterModal
                isOpen={registerModalOpen}
                onClose={() => setRegisterModalOpen(false)}
                onSwitchToLogin={() => { setRegisterModalOpen(false); setLoginModalOpen(true); }}
            />
        </>
    );
};

export default Navbar;
