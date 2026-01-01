import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const exploreLinks = [
        { label: "Weather Curation", href: "/weather" },
        { label: "Hidden Spots", href: "/ai-recs" },
        { label: "Local Food", href: "/local-eats" },
        { label: "Accommodations", href: "/community" },
    ];

    const officialResources = [
        { label: "Visit Vietnam (Official)", href: "https://vietnam.travel", external: true },
        { label: "Dalat People's Committee", href: "https://dalat.lamdong.gov.vn", external: true },
        { label: "Lam Dong Tourism", href: "https://lamdong.gov.vn", external: true },
        { label: "Emergency Contacts", href: "#emergency", external: false },
    ];

    return (
        <footer
            className="bg-[#11163B] text-white z-10 relative" // Added z-index relative to ensure it stacks properly
            role="contentinfo"
        >
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-8 md:py-10">
                {/* Footer Grid - Compact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

                    {/* Column 1: Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link to="/" className="font-tenor text-xl text-white tracking-wide">
                            Dalat Vibe
                        </Link>
                        <p className="font-manrope text-xs text-white/60 mt-2 leading-relaxed max-w-xs">
                            Curated travel for the misty soul. Discover hidden gems and authentic experiences in Vietnam's enchanting highlands.
                        </p>
                    </div>

                    {/* Column 2: Explore */}
                    <div>
                        <h3 className="font-tenor text-sm text-white mb-3">
                            Explore
                        </h3>
                        <ul className="space-y-2">
                            {exploreLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="font-manrope text-xs text-white/60 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Official Resources */}
                    <div>
                        <h3 className="font-tenor text-sm text-white mb-3">
                            Official Resources
                        </h3>
                        <ul className="space-y-2">
                            {officialResources.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target={link.external ? "_blank" : undefined}
                                        rel={link.external ? "noopener noreferrer" : undefined}
                                        className="font-manrope text-xs text-white/60 hover:text-white transition-colors inline-flex items-center gap-1"
                                    >
                                        {link.label}
                                        {link.external && (
                                            <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Creator */}
                    <div>
                        <h3 className="font-tenor text-sm text-white mb-3">
                            Creator
                        </h3>
                        <p className="font-manrope text-xs text-white/60 leading-relaxed">
                            Designed & Developed by<br />
                            <span className="text-white/80">Dragon Ho</span>
                        </p>
                    </div>
                </div>

                {/* Bottom Bar - Tight */}
                <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <p className="font-manrope text-xs text-white/50">
                            © 2025 <span className="text-white/70">Dragon Ho</span>. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#privacy" className="font-manrope text-xs text-white/40 hover:text-white/70 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#terms" className="font-manrope text-xs text-white/40 hover:text-white/70 transition-colors">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
