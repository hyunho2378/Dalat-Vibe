import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// =============================================================================
// Translation Resources - Complete Vietnamese/English Support
// =============================================================================

const resources = {
    en: {
        translation: {
            // Navigation
            nav: {
                home: 'Home',
                weather: 'Weather',
                recs: 'Curation',
                local: 'Dining',
                intro: 'Dalat',
                community: 'Community'
            },
            // Authentication
            auth: {
                login: 'Login',
                logout: 'Logout',
                profile: 'My Profile',
                register: 'Register',
                email: 'Email',
                password: 'Password',
                username: 'Username',
                confirmPassword: 'Confirm Password',
                forgotPassword: 'Forgot password?',
                noAccount: "Don't have an account?",
                hasAccount: 'Already have an account?',
                signUp: 'Sign Up',
                signIn: 'Sign In'
            },
            // Language
            language: {
                select: 'Select Language',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            },
            // Hero Section
            hero: {
                title: 'Discover the\nMisty Highlands',
                subtitle: 'Dalat: The Marvelous Essence of a Blessed Land.'
            },
            // Sections
            sections: {
                aiPicks: 'AI Picks',
                forecastCuration: "Forecast-Based Curation: Today's Perfect Match",
                viewAllRecs: 'View All Recommendations',
                localFavorites: 'Local Favorites',
                localGemsTitle: 'The Dalat Palate: Hidden Local Gems',
                discoverLocalEats: 'Discover Local Eats',
                location: 'Location',
                exploreCity: 'Explore Dalat City',
                mapDescription: 'Interactive Map of Key Locations & Attractions'
            },
            // AI Recommendations Page
            aiRecs: {
                title: 'Perfect Spots for',
                subtitle: "Today's Weather",
                eyebrow: 'AI-Powered Curation',
                description: 'Our AI analyzes current weather conditions to recommend the perfect destinations for your Dalat experience.',
                match: 'Match',
                backToHome: 'Back to Home'
            },
            // Local Eats Page
            localEats: {
                eyebrow: 'Local Discoveries',
                title: 'Authentic Flavors',
                subtitle: 'of the Highlands',
                description: 'Hidden gems where locals actually eat. No tourist traps, just genuine Dalat culinary traditions passed down through generations.'
            },
            // Detail Page
            detail: {
                openNow: 'Open Now',
                closed: 'Closed',
                about: 'About',
                aiTip: "AI's Tip",
                location: 'Location',
                hours: 'Hours',
                getDirections: 'Get Directions',
                reviews: 'Reviews',
                writeReview: 'Write a Review',
                call: 'Call',
                share: 'Share',
                save: 'Save',
                saved: 'Saved'
            },
            // Weather
            weather: {
                title: 'Weather Forecast',
                today: 'Today',
                feelsLike: 'Feels like',
                humidity: 'Humidity',
                wind: 'Wind',
                visibility: 'Visibility',
                uvIndex: 'UV Index',
                sunrise: 'Sunrise',
                sunset: 'Sunset',
                forecast: '5-Day Forecast',
                dalatHighlands: 'Dalat Highlands',
                currentConditions: 'Current Conditions',
                dayForecast: 'Day Forecast',
                hourlyBreakdown: 'Hourly Breakdown',
                smartSuggestions: 'Smart Suggestions',
                outdoorAdventures: 'Outdoor Adventures',
                cozyIndoorRetreats: 'Cozy Indoor Retreats',
                perfectDestinations: 'Perfect destinations based on current conditions',
                tapToSeeHourly: 'Tap any day to see the full hourly breakdown',
                outfitGuide: 'Outfit Guide',
                outerwear: 'Outerwear',
                top: 'Top',
                bottom: 'Bottom',
                warmer: 'Warmer',
                standard: 'Standard',
                cooler: 'Cooler',
                loading: 'Loading weather data...',
                unavailable: 'Weather Unavailable'
            },
            // Chat
            chat: {
                title: 'Dalat AI Guide',
                greeting: 'Hello! I\'m your Dalat travel assistant. What would you like to explore today? 🌸',
                placeholder: 'Ask about Dalat...',
                thinking: 'Thinking...',
                errorProcess: 'Sorry, I encountered an issue processing your question. Please try again!',
                errorConnection: 'Unable to connect to server. Please check your connection!'
            },
            // Footer
            footer: {
                brand: 'Dalat Vibe',
                tagline: 'Curated travel for the misty soul. Discover hidden gems and authentic experiences in Vietnam\'s enchanting highlands.',
                explore: 'Explore',
                weatherCuration: 'Weather Curation',
                hiddenSpots: 'Hidden Spots',
                localFood: 'Local Food',
                accommodations: 'Accommodations',
                officialResources: 'Official Resources',
                visitVietnam: 'Visit Vietnam (Official)',
                dalatCommittee: "Dalat People's Committee",
                lamDongTourism: 'Lam Dong Tourism',
                emergency: 'Emergency Contacts',
                creator: 'Creator',
                designedBy: 'Designed & Developed by',
                rights: 'All rights reserved.',
                privacy: 'Privacy Policy',
                terms: 'Terms of Service'
            },
            // Common
            common: {
                loading: 'Loading...',
                error: 'Error',
                retry: 'Retry',
                cancel: 'Cancel',
                confirm: 'Confirm',
                close: 'Close',
                seeMore: 'See More',
                viewAll: 'View All'
            },
            // CityIntro Page
            cityIntro: {
                location: 'Vietnam · Central Highlands',
                heroSubtitle: 'A sanctuary of cool mists, ancient pine forests, and timeless French elegance.',
                discovery: 'The Discovery',
                discoveryTitle: 'Dr. Alexandre Yersin established this haven above the clouds.',
                discoveryP1: 'The Swiss-French physician and explorer first set foot on this remote plateau while charting new routes through the Annamite Mountains. Captivated by its temperate climate and breathtaking vistas, he reported his findings to the colonial administration.',
                discoveryP2: 'The name "Dalat" derives from the indigenous K\'Ho phrase "Đạ Lạch"—meaning "Stream of the Lat People." It is a tribute to those who called these misty highlands home for centuries before the French arrived.',
                plateau: 'The Plateau',
                plateauTitle: '1,500 meters above the sea',
                plateauDesc: 'Perched on the Lang Biang Plateau, Dalat enjoys year-round temperatures between 14°C and 23°C. While the rest of Vietnam swelters in tropical heat, the highlands remain an eternal spring.',
                yearRound: 'Year-round',
                elevation: 'Elevation',
                heritage: 'Heritage',
                heritageTitle: '2,000 French villas still stand',
                heritageP1: 'The colonial era left behind an architectural legacy unlike anywhere else in Southeast Asia. Pastel-colored villas, Gothic churches, and Art Deco hotels dot the hillsides—a living museum of early 20th-century European design.',
                heritageP2: 'Known as the "City of Flowers," Dalat\'s cool climate nurtures hydrangeas, roses, and wild orchids that bloom year-round, painting the hills in perpetual color.',
                quote: '"In Dalat, time slows to the rhythm of falling pine needles and the whisper of mountain mist."',
                quoteAuthor: '— A traveler\'s reflection',
                footerText: 'A Digital Experience by Dalat Vibe'
            }
        }
    },
    vi: {
        translation: {
            // Navigation
            nav: {
                home: 'Trang chủ',
                weather: 'Thời tiết',
                recs: 'Gợi ý AI',
                local: 'Ẩm thực',
                intro: 'Đà Lạt',
                community: 'Cộng đồng'
            },
            // Authentication
            auth: {
                login: 'Đăng nhập',
                logout: 'Đăng xuất',
                profile: 'Hồ sơ của tôi',
                register: 'Đăng ký',
                email: 'Email',
                password: 'Mật khẩu',
                username: 'Tên người dùng',
                confirmPassword: 'Xác nhận mật khẩu',
                forgotPassword: 'Quên mật khẩu?',
                noAccount: 'Chưa có tài khoản?',
                hasAccount: 'Đã có tài khoản?',
                signUp: 'Đăng ký',
                signIn: 'Đăng nhập'
            },
            // Language
            language: {
                select: 'Chọn ngôn ngữ',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            },
            // Hero Section
            hero: {
                title: 'Khám phá\nCao nguyên Sương mù',
                subtitle: 'Đà Lạt - Kết tinh kỳ diệu từ đất lành.'
            },
            // Sections
            sections: {
                aiPicks: 'AI Chọn lọc',
                forecastCuration: 'Gợi ý theo Thời tiết: Điểm đến Hoàn hảo Hôm nay',
                viewAllRecs: 'Xem tất cả Gợi ý',
                localFavorites: 'Yêu thích Địa phương',
                localGemsTitle: 'Ẩm thực Đà Lạt: Viên ngọc Ẩn giấu',
                discoverLocalEats: 'Khám phá Ẩm thực',
                location: 'Vị trí',
                exploreCity: 'Khám phá Thành phố Đà Lạt',
                mapDescription: 'Bản đồ tương tác các Địa điểm & Điểm tham quan'
            },
            // AI Recommendations Page
            aiRecs: {
                title: 'Điểm đến Hoàn hảo cho',
                subtitle: 'Thời tiết Hôm nay',
                eyebrow: 'AI Gợi ý Thông minh',
                description: 'AI của chúng tôi phân tích điều kiện thời tiết hiện tại để gợi ý những điểm đến hoàn hảo cho trải nghiệm Đà Lạt của bạn.',
                match: 'Phù hợp',
                backToHome: 'Về Trang chủ'
            },
            // Local Eats Page
            localEats: {
                eyebrow: 'Khám phá Địa phương',
                title: 'Hương vị Đích thực',
                subtitle: 'của Cao nguyên',
                description: 'Những viên ngọc ẩn nơi người dân địa phương thực sự ăn. Không bẫy du lịch, chỉ có truyền thống ẩm thực Đà Lạt chính gốc được truyền qua nhiều thế hệ.'
            },
            // Detail Page
            detail: {
                openNow: 'Đang mở cửa',
                closed: 'Đã đóng cửa',
                about: 'Giới thiệu',
                aiTip: 'Mẹo từ AI',
                location: 'Vị trí',
                hours: 'Giờ mở cửa',
                getDirections: 'Chỉ đường',
                reviews: 'Đánh giá',
                writeReview: 'Viết đánh giá',
                call: 'Gọi điện',
                share: 'Chia sẻ',
                save: 'Lưu lại',
                saved: 'Đã lưu'
            },
            // Weather
            weather: {
                title: 'Dự báo Thời tiết',
                today: 'Hôm nay',
                feelsLike: 'Cảm giác như',
                humidity: 'Độ ẩm',
                wind: 'Gió',
                visibility: 'Tầm nhìn',
                uvIndex: 'Chỉ số UV',
                sunrise: 'Bình minh',
                sunset: 'Hoàng hôn',
                forecast: 'Dự báo 5 ngày',
                dalatHighlands: 'Cao nguyên Đà Lạt',
                currentConditions: 'Điều kiện Hiện tại',
                dayForecast: 'Dự báo Theo ngày',
                hourlyBreakdown: 'Chi tiết Theo giờ',
                smartSuggestions: 'Gợi ý Thông minh',
                outdoorAdventures: 'Khám phá Ngoài trời',
                cozyIndoorRetreats: 'Điểm đến Trong nhà',
                perfectDestinations: 'Điểm đến hoàn hảo dựa trên thời tiết hiện tại',
                tapToSeeHourly: 'Nhấn để xem chi tiết theo giờ',
                outfitGuide: 'Hướng dẫn Trang phục',
                outerwear: 'Áo khoác',
                top: 'Áo',
                bottom: 'Quần',
                warmer: 'Ấm hơn',
                standard: 'Tiêu chuẩn',
                cooler: 'Mát hơn',
                loading: 'Đang tải dữ liệu thời tiết...',
                unavailable: 'Không có dữ liệu Thời tiết'
            },
            // Chat
            chat: {
                title: 'Trợ lý AI Đà Lạt',
                greeting: 'Xin chào! Tôi là trợ lý du lịch Đà Lạt. Bạn muốn khám phá điều gì hôm nay? 🌸',
                placeholder: 'Hỏi về Đà Lạt...',
                thinking: 'Đang suy nghĩ...',
                errorProcess: 'Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi. Vui lòng thử lại!',
                errorConnection: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối!'
            },
            // Footer
            footer: {
                brand: 'Dalat Vibe',
                tagline: 'Du lịch chọn lọc cho tâm hồn mơ màng. Khám phá những viên ngọc ẩn và trải nghiệm đích thực tại cao nguyên huyền ảo Việt Nam.',
                explore: 'Khám phá',
                weatherCuration: 'Gợi ý Thời tiết',
                hiddenSpots: 'Điểm Ẩn giấu',
                localFood: 'Ẩm thực Địa phương',
                accommodations: 'Lưu trú',
                officialResources: 'Nguồn Chính thức',
                visitVietnam: 'Visit Vietnam (Chính thức)',
                dalatCommittee: 'UBND Thành phố Đà Lạt',
                lamDongTourism: 'Du lịch Lâm Đồng',
                emergency: 'Liên hệ Khẩn cấp',
                creator: 'Tác giả',
                designedBy: 'Thiết kế & Phát triển bởi',
                rights: 'Đã đăng ký bản quyền.',
                privacy: 'Chính sách Riêng tư',
                terms: 'Điều khoản Dịch vụ'
            },
            // Common
            common: {
                loading: 'Đang tải...',
                error: 'Lỗi',
                retry: 'Thử lại',
                cancel: 'Hủy',
                confirm: 'Xác nhận',
                close: 'Đóng',
                seeMore: 'Xem thêm',
                viewAll: 'Xem tất cả'
            },
            // CityIntro Page
            cityIntro: {
                location: 'Việt Nam · Tây Nguyên',
                heroSubtitle: 'Nơi ẩn náu của sương mù mát lành, rừng thông cổ thụ và vẻ đẹp Pháp trường tồn.',
                discovery: 'Khám Phá',
                discoveryTitle: 'Bác sĩ Alexandre Yersin đã xây dựng thiên đường này trên mây.',
                discoveryP1: 'Bác sĩ và nhà thám hiểm người Thụy Sĩ-Pháp đã đặt chân đến cao nguyên xa xôi này khi vẽ bản đồ các tuyến đường mới qua dãy Trường Sơn. Bị mê hoặc bởi khí hậu ôn hòa và cảnh quan tuyệt đẹp, ông đã báo cáo phát hiện của mình cho chính quyền thuộc địa.',
                discoveryP2: 'Tên gọi "Đà Lạt" bắt nguồn từ cụm từ "Đạ Lạch" của người K\'Ho bản địa—có nghĩa là "Suối của Người Lát." Đây là sự tri ân dành cho những người đã gọi vùng cao nguyên sương mù này là nhà trong nhiều thế kỷ trước khi người Pháp đến.',
                plateau: 'Cao Nguyên',
                plateauTitle: '1.500 mét trên mực nước biển',
                plateauDesc: 'Nằm trên Cao nguyên Langbiang, Đà Lạt được hưởng nhiệt độ quanh năm từ 14°C đến 23°C. Trong khi phần còn lại của Việt Nam oi bức trong nóng nhiệt đới, cao nguyên vẫn là mùa xuân vĩnh hằng.',
                yearRound: 'Quanh năm',
                elevation: 'Độ cao',
                heritage: 'Di Sản',
                heritageTitle: '2.000 biệt thự Pháp vẫn còn đứng vững',
                heritageP1: 'Thời kỳ thuộc địa đã để lại di sản kiến trúc không giống bất kỳ nơi nào khác ở Đông Nam Á. Những biệt thự màu pastel, nhà thờ Gothic và khách sạn Art Deco nằm rải rác trên các sườn đồi—một bảo tàng sống của thiết kế châu Âu đầu thế kỷ 20.',
                heritageP2: 'Được mệnh danh là "Thành phố Hoa," khí hậu mát mẻ của Đà Lạt nuôi dưỡng cẩm tú cầu, hoa hồng và lan dại nở quanh năm, vẽ lên những ngọn đồi bằng sắc màu vĩnh cửu.',
                quote: '"Ở Đà Lạt, thời gian chậm lại theo nhịp rơi của những chiếc lá thông và tiếng thì thầm của sương núi."',
                quoteAuthor: '— Suy tư của một lữ khách',
                footerText: 'Trải nghiệm Số bởi Dalat Vibe'
            }
        }
    },
    ko: {
        translation: {
            nav: {
                home: '홈',
                weather: '날씨',
                recs: 'AI 추천',
                local: '로컬 맛집',
                intro: '달랏',
                community: '커뮤니티'
            },
            auth: {
                login: '로그인',
                logout: '로그아웃',
                profile: '내 프로필'
            },
            language: {
                select: '언어 선택',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            }
        }
    },
    fr: {
        translation: {
            nav: {
                home: 'Accueil',
                weather: 'Météo',
                recs: 'IA Recs',
                local: 'Cuisine',
                intro: 'Dalat',
                community: 'Communauté'
            },
            auth: {
                login: 'Connexion',
                logout: 'Déconnexion',
                profile: 'Mon Profil'
            },
            language: {
                select: 'Choisir la langue',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            }
        }
    },
    zh: {
        translation: {
            nav: {
                home: '首页',
                weather: '天气',
                recs: 'AI推荐',
                local: '美食',
                intro: '大叻',
                community: '社区'
            },
            auth: {
                login: '登录',
                logout: '退出',
                profile: '我的资料'
            },
            language: {
                select: '选择语言',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            }
        }
    }
};

// =============================================================================
// i18n Configuration
// =============================================================================

// Get saved language from localStorage or default to 'en'
const savedLang = typeof window !== 'undefined'
    ? localStorage.getItem('dalat_lang') || 'en'
    : 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLang, // Load saved language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already escapes
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;
