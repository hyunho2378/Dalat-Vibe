import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ChatWidget from './components/ChatWidget';

// Pages
import Home from './pages/Home';
import CityIntro from './pages/CityIntro';
import Community from './pages/Community';
import AIRecommendations from './pages/AIRecommendations';
import LocalEats from './pages/LocalEats';
import UserProfile from './pages/UserProfile';
import DetailPage from './pages/Detail';
import Weather from './pages/Weather';

// ScrollToTop Helper
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ScrollToTop />
                <Routes>
                    {/* Wrap all routes in Layout */}
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/intro" element={<CityIntro />} />
                        <Route path="/weather" element={<Weather />} />
                        <Route path="/community" element={<Community />} />
                        <Route path="/ai-recs" element={<AIRecommendations />} />
                        <Route path="/local-eats" element={<LocalEats />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/place/:id" element={<DetailPage />} />
                    </Route>
                </Routes>

                {/* Global Floating Chat Widget */}
                <ChatWidget />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
