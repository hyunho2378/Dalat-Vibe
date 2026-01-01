import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// =============================================================================
// Layout Component
// =============================================================================

const Layout = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col relative">
            <Navbar />

            {/* 
               Main content area. 
               The Navbar is fixed, so we might need padding here if it wasn't a transparent header.
               However, for the Hero section to go UNDER the transparent header, we often don't want top padding on the Home page.
               But for other pages we might.
               
               For now, we'll rely on pages handling their own top spacing or specific page layouts.
               The Home page hero has `pt-0` or appropriate styling.
               Other pages might need `pt-20` class added to their root.
            */}
            <main className="flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
