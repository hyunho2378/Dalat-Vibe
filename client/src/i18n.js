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
                // Buttons
                login: 'Login',
                logout: 'Logout',
                signUp: 'Sign Up',
                signIn: 'Sign In',
                register: 'Create Account',
                submit: 'Submit',
                // Labels
                email: 'Email',
                password: 'Password',
                username: 'Username',
                confirmPassword: 'Confirm Password',
                profile: 'My Profile',
                // Placeholders
                emailPlaceholder: 'Enter your email',
                passwordPlaceholder: 'Enter your password',
                usernamePlaceholder: 'Choose a username',
                confirmPasswordPlaceholder: 'Confirm your password',
                // Links & Text
                forgotPassword: 'Forgot password?',
                noAccount: "Don't have an account?",
                hasAccount: 'Already have an account?',
                orContinueWith: 'Or continue with',
                termsAgree: 'By signing up, you agree to our Terms',
                // Validation Errors
                invalidEmail: 'Please enter a valid email',
                invalidPassword: 'Password must be at least 6 characters',
                passwordMismatch: 'Passwords do not match',
                requiredField: 'This field is required',
                loginFailed: 'Login failed. Please check your credentials.',
                registerSuccess: 'Account created successfully!',
                welcomeBack: 'Welcome back!'
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
                forecastCuration: "Forecast-Based Curation:\nToday's Perfect Match",
                viewAllRecs: 'See More',
                localFavorites: 'Local Favorites',
                localGemsTitle: 'The Dalat Palate: Hidden Local Gems',
                discoverLocalEats: 'See More',
                location: 'Location',
                exploreCity: 'Explore Dalat City',
                mapDescription: 'Interactive Map'
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
                // Buttons
                login: 'Đăng nhập',
                logout: 'Đăng xuất',
                signUp: 'Đăng ký',
                signIn: 'Đăng nhập',
                register: 'Tạo tài khoản',
                submit: 'Gửi',
                // Labels
                email: 'Email',
                password: 'Mật khẩu',
                username: 'Tên người dùng',
                confirmPassword: 'Xác nhận mật khẩu',
                profile: 'Hồ sơ của tôi',
                // Placeholders
                emailPlaceholder: 'Nhập email của bạn',
                passwordPlaceholder: 'Nhập mật khẩu của bạn',
                usernamePlaceholder: 'Chọn tên người dùng',
                confirmPasswordPlaceholder: 'Xác nhận mật khẩu của bạn',
                // Links & Text
                forgotPassword: 'Quên mật khẩu?',
                noAccount: 'Chưa có tài khoản?',
                hasAccount: 'Đã có tài khoản?',
                orContinueWith: 'Hoặc tiếp tục với',
                termsAgree: 'Bằng cách đăng ký, bạn đồng ý với Điều khoản',
                // Validation Errors
                invalidEmail: 'Vui lòng nhập email hợp lệ',
                invalidPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
                passwordMismatch: 'Mật khẩu không khớp',
                requiredField: 'Trường này là bắt buộc',
                loginFailed: 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.',
                registerSuccess: 'Tạo tài khoản thành công!',
                welcomeBack: 'Chào mừng trở lại!'
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
                forecastCuration: 'Gợi ý theo Thời tiết:\nĐiểm đến Hoàn hảo',
                viewAllRecs: 'Xem thêm',
                localFavorites: 'Yêu thích Địa phương',
                localGemsTitle: 'Ẩm thực Đà Lạt: Viên ngọc Ẩn giấu',
                discoverLocalEats: 'Xem thêm',
                location: 'Vị trí',
                exploreCity: 'Khám phá Đà Lạt',
                mapDescription: 'Bản đồ tương tác'
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
            // Navigation
            nav: {
                home: '홈',
                weather: '날씨',
                recs: '큐레이션',
                local: '맛집',
                intro: '달랏',
                community: '커뮤니티'
            },
            // Authentication - Professional Korean phrasing
            auth: {
                // Buttons
                login: '로그인',
                logout: '로그아웃',
                signUp: '회원가입',
                signIn: '시작하기',
                register: '계정 만들기',
                submit: '확인',
                // Labels
                email: '이메일',
                password: '비밀번호',
                username: '닉네임',
                confirmPassword: '비밀번호 확인',
                profile: '내 프로필',
                // Placeholders
                emailPlaceholder: '이메일을 입력하세요',
                passwordPlaceholder: '비밀번호를 입력하세요',
                usernamePlaceholder: '닉네임을 입력하세요',
                confirmPasswordPlaceholder: '비밀번호를 다시 입력하세요',
                // Links & Text
                forgotPassword: '비밀번호를 잊으셨나요?',
                noAccount: '계정이 없으신가요?',
                hasAccount: '이미 회원이신가요?',
                orContinueWith: '또는 다음으로 계속하기',
                termsAgree: '가입 시 이용약관에 동의하게 됩니다',
                // Validation Errors
                invalidEmail: '올바른 이메일을 입력해주세요',
                invalidPassword: '비밀번호는 6자 이상이어야 합니다',
                passwordMismatch: '비밀번호가 일치하지 않습니다',
                requiredField: '필수 입력 항목입니다',
                loginFailed: '로그인에 실패했습니다. 정보를 확인해주세요.',
                registerSuccess: '계정이 생성되었습니다!',
                welcomeBack: '다시 만나서 반갑습니다!'
            },
            // Language
            language: {
                select: '언어 선택',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            },
            // Hero Section
            hero: {
                title: '안개 속\n비밀의 고원',
                subtitle: '달랏: 영원한 봄의 도시'
            },
            // Sections
            sections: {
                aiPicks: 'AI 추천',
                forecastCuration: '날씨 맞춤 추천:\n오늘의 완벽 매칭',
                viewAllRecs: '더보기',
                localFavorites: '숨은 명소',
                localGemsTitle: '현지인이 사랑하는 맛집',
                discoverLocalEats: '더보기',
                location: '위치',
                exploreCity: '달랏 탐험',
                mapDescription: '인터랙티브 지도'
            },
            // AI Recommendations Page
            aiRecs: {
                title: '오늘의',
                subtitle: '완벽 추천',
                eyebrow: 'AI 큐레이션',
                description: 'AI가 현재 날씨를 분석하여 최적의 목적지를 추천합니다.',
                match: '매칭',
                backToHome: '홈으로'
            },
            // Local Eats Page
            localEats: {
                eyebrow: '현지 맛집',
                title: '정통의 맛',
                subtitle: '고원에서',
                description: '현지인들이 사랑하는 숨은 맛집. 진정한 달랏의 미식을 경험하세요.'
            },
            // Detail Page
            detail: {
                openNow: '영업 중',
                closed: '영업 종료',
                about: '소개',
                aiTip: 'AI 팁',
                location: '위치',
                hours: '영업 시간',
                getDirections: '길찾기',
                reviews: '리뷰',
                writeReview: '리뷰 작성',
                call: '전화',
                share: '공유',
                save: '저장',
                saved: '저장됨'
            },
            // Weather
            weather: {
                title: '날씨 예보',
                today: '오늘',
                feelsLike: '체감',
                humidity: '습도',
                wind: '바람',
                visibility: '가시거리',
                uvIndex: 'UV 지수',
                sunrise: '일출',
                sunset: '일몰',
                forecast: '5일 예보',
                dalatHighlands: '달랏 고원',
                currentConditions: '현재 날씨',
                dayForecast: '일간 예보',
                hourlyBreakdown: '시간별 상세',
                smartSuggestions: '스마트 제안',
                outdoorAdventures: '야외 모험',
                cozyIndoorRetreats: '아늑한 실내',
                perfectDestinations: '현재 날씨에 맞는 완벽한 목적지',
                tapToSeeHourly: '탭하여 시간별 상세 보기',
                outfitGuide: '옷차림 가이드',
                outerwear: '겉옷',
                top: '상의',
                bottom: '하의',
                warmer: '따뜻하게',
                standard: '표준',
                cooler: '시원하게',
                loading: '날씨 로딩 중...',
                unavailable: '날씨 정보 없음'
            },
            // Chat
            chat: {
                title: '달랏 AI 가이드',
                greeting: '안녕하세요! 달랏 여행 도우미입니다. 오늘 무엇을 탐험하고 싶으세요? 🌸',
                placeholder: '달랏에 대해 물어보세요...',
                thinking: '생각 중...',
                errorProcess: '죄송합니다, 질문 처리 중 오류가 발생했습니다. 다시 시도해 주세요!',
                errorConnection: '서버에 연결할 수 없습니다. 연결을 확인해 주세요!'
            },
            // Footer
            footer: {
                brand: 'Dalat Vibe',
                tagline: '몽환적인 영혼을 위한 큐레이션 여행. 베트남 매혹적인 고원에서 숨겨진 보석과 진정한 경험을 발견하세요.',
                explore: '탐색',
                weatherCuration: '날씨 큐레이션',
                hiddenSpots: '숨은 명소',
                localFood: '현지 음식',
                accommodations: '숙박',
                officialResources: '공식 자료',
                visitVietnam: 'Visit Vietnam (공식)',
                dalatCommittee: '달랏 인민위원회',
                lamDongTourism: '람동성 관광청',
                emergency: '긴급 연락처',
                creator: '제작자',
                designedBy: '디자인 & 개발',
                rights: '모든 권리 보유.',
                privacy: '개인정보 처리방침',
                terms: '이용 약관'
            },
            // Common
            common: {
                loading: '로딩 중...',
                error: '오류',
                retry: '재시도',
                cancel: '취소',
                confirm: '확인',
                close: '닫기',
                seeMore: '더 보기',
                viewAll: '전체 보기'
            },
            // CityIntro Page
            cityIntro: {
                location: '베트남 · 중부 고원',
                heroSubtitle: '시원한 안개, 고대 소나무 숲, 시대를 초월한 프랑스 우아함의 안식처.',
                discovery: '발견',
                discoveryTitle: '알렉상드르 예르생 박사가 구름 위에 이 천국을 세웠습니다.',
                discoveryP1: '스위스-프랑스 의사이자 탐험가인 그는 안남 산맥을 통과하는 새로운 경로를 개척하던 중 이 외딴 고원에 처음 발을 디뎠습니다. 온화한 기후와 숨 막히는 경관에 매료된 그는 그의 발견을 식민 정부에 보고했습니다.',
                discoveryP2: '"달랏"이라는 이름은 토착 크호족의 "다 라흐(Đạ Lạch)"에서 유래했으며, "랏 족의 개울"을 의미합니다. 이는 프랑스인이 도착하기 전 수세기 동안 이 안개 자욱한 고원을 고향으로 삼았던 사람들에 대한 경의입니다.',
                plateau: '고원',
                plateauTitle: '해발 1,500m',
                plateauDesc: '랑비앙 고원에 자리한 달랏은 연중 14°C에서 23°C의 기온을 유지합니다. 베트남의 나머지 지역이 열대의 더위에 시달릴 때도, 고원은 영원한 봄입니다.',
                yearRound: '연중무휴',
                elevation: '해발고도',
                heritage: '유산',
                heritageTitle: '2,000개의 프랑스 빌라가 여전히',
                heritageP1: '식민 시대는 동남아시아 어디에서도 볼 수 없는 건축 유산을 남겼습니다. 파스텔 색상의 빌라, 고딕 양식의 교회, 아르데코 호텔이 언덕 곳곳에 있으며—20세기 초 유럽 디자인의 살아있는 박물관입니다.',
                heritageP2: '"꽃의 도시"로 알려진 달랏의 시원한 기후는 수국, 장미, 야생 난초를 연중 피워내며, 언덕을 영원한 색채로 물들입니다.',
                quote: '"달랏에서 시간은 떨어지는 솔잎의 리듬과 산안개의 속삭임에 맞춰 느리게 흐릅니다."',
                quoteAuthor: '— 한 여행자의 성찰',
                footerText: 'Dalat Vibe의 디지털 경험'
            }
        }
    },
    fr: {
        translation: {
            // Navigation - Using concise terms to fit layout
            nav: {
                home: 'Accueil',
                weather: 'Météo',
                recs: 'Sélection',
                local: 'Cuisine',
                intro: 'Dalat',
                community: 'Forum'
            },
            // Authentication
            auth: {
                // Buttons
                login: 'Connexion',
                logout: 'Déconnexion',
                signUp: "S'inscrire",
                signIn: 'Se connecter',
                register: 'Créer un compte',
                submit: 'Soumettre',
                // Labels
                email: 'Email',
                password: 'Mot de passe',
                username: "Nom d'utilisateur",
                confirmPassword: 'Confirmer le mot de passe',
                profile: 'Mon Profil',
                // Placeholders
                emailPlaceholder: 'Entrez votre email',
                passwordPlaceholder: 'Entrez votre mot de passe',
                usernamePlaceholder: "Choisissez un nom d'utilisateur",
                confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
                // Links & Text
                forgotPassword: 'Mot de passe oublié?',
                noAccount: 'Pas encore de compte?',
                hasAccount: 'Déjà inscrit?',
                orContinueWith: 'Ou continuer avec',
                termsAgree: "En vous inscrivant, vous acceptez nos Conditions",
                // Validation Errors
                invalidEmail: 'Veuillez entrer un email valide',
                invalidPassword: 'Le mot de passe doit contenir au moins 6 caractères',
                passwordMismatch: 'Les mots de passe ne correspondent pas',
                requiredField: 'Ce champ est obligatoire',
                loginFailed: 'Échec de la connexion. Vérifiez vos identifiants.',
                registerSuccess: 'Compte créé avec succès!',
                welcomeBack: 'Bienvenue!'
            },
            // Language
            language: {
                select: 'Choisir la langue',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            },
            // Hero Section
            hero: {
                title: 'Découvrez les\\nHauts Plateaux',
                subtitle: 'Dalat: Essence merveilleuse d\'une terre bénie.'
            },
            // Sections
            sections: {
                aiPicks: 'Sélection IA',
                forecastCuration: 'Selon la Météo: Choix Parfait du Jour',
                viewAllRecs: 'Tout Voir',
                localFavorites: 'Favoris Locaux',
                localGemsTitle: 'Saveurs de Dalat: Trésors Cachés',
                discoverLocalEats: 'Découvrir',
                location: 'Lieu',
                exploreCity: 'Explorer Dalat',
                mapDescription: 'Carte Interactive des Attractions'
            },
            // AI Recommendations Page
            aiRecs: {
                title: 'Lieux Parfaits pour',
                subtitle: "Météo d'Aujourd'hui",
                eyebrow: 'Curation IA',
                description: 'Notre IA analyse la météo actuelle pour recommander les meilleures destinations pour votre expérience à Dalat.',
                match: 'Match',
                backToHome: 'Retour'
            },
            // Local Eats Page
            localEats: {
                eyebrow: 'Découvertes Locales',
                title: 'Saveurs Authentiques',
                subtitle: 'des Hauts Plateaux',
                description: 'Trésors cachés où les locaux mangent vraiment. Pas de pièges à touristes, juste les traditions culinaires authentiques de Dalat.'
            },
            // Detail Page
            detail: {
                openNow: 'Ouvert',
                closed: 'Fermé',
                about: 'À Propos',
                aiTip: 'Conseil IA',
                location: 'Lieu',
                hours: 'Horaires',
                getDirections: 'Itinéraire',
                reviews: 'Avis',
                writeReview: 'Écrire un Avis',
                call: 'Appeler',
                share: 'Partager',
                save: 'Sauver',
                saved: 'Sauvé'
            },
            // Weather
            weather: {
                title: 'Prévisions Météo',
                today: "Aujourd'hui",
                feelsLike: 'Ressenti',
                humidity: 'Humidité',
                wind: 'Vent',
                visibility: 'Visibilité',
                uvIndex: 'Indice UV',
                sunrise: 'Lever',
                sunset: 'Coucher',
                forecast: 'Prévisions 5J',
                dalatHighlands: 'Hauts Plateaux Dalat',
                currentConditions: 'Conditions Actuelles',
                dayForecast: 'Prévisions Jour',
                hourlyBreakdown: 'Détails Horaires',
                smartSuggestions: 'Suggestions',
                outdoorAdventures: 'Aventures Plein Air',
                cozyIndoorRetreats: 'Refuges Intérieurs',
                perfectDestinations: 'Destinations parfaites selon la météo',
                tapToSeeHourly: 'Appuyez pour les détails horaires',
                outfitGuide: 'Guide Tenue',
                outerwear: 'Veste',
                top: 'Haut',
                bottom: 'Bas',
                warmer: 'Plus Chaud',
                standard: 'Standard',
                cooler: 'Plus Frais',
                loading: 'Chargement météo...',
                unavailable: 'Météo Indisponible'
            },
            // Chat
            chat: {
                title: 'Guide IA Dalat',
                greeting: 'Bonjour! Je suis votre assistant de voyage Dalat. Que voulez-vous explorer? 🌸',
                placeholder: 'Demandez sur Dalat...',
                thinking: 'Réflexion...',
                errorProcess: 'Désolé, une erreur est survenue. Réessayez!',
                errorConnection: 'Connexion impossible. Vérifiez votre réseau!'
            },
            // Footer
            footer: {
                brand: 'Dalat Vibe',
                tagline: 'Voyage curé pour âmes rêveuses. Découvrez les trésors cachés et expériences authentiques des hauts plateaux enchanteurs du Vietnam.',
                explore: 'Explorer',
                weatherCuration: 'Curation Météo',
                hiddenSpots: 'Lieux Cachés',
                localFood: 'Cuisine Locale',
                accommodations: 'Hébergement',
                officialResources: 'Ressources Officielles',
                visitVietnam: 'Visit Vietnam (Officiel)',
                dalatCommittee: 'Comité Populaire Dalat',
                lamDongTourism: 'Tourisme Lam Dong',
                emergency: 'Urgences',
                creator: 'Créateur',
                designedBy: 'Conçu & Développé par',
                rights: 'Tous droits réservés.',
                privacy: 'Politique de Confidentialité',
                terms: "Conditions d'Utilisation"
            },
            // Common
            common: {
                loading: 'Chargement...',
                error: 'Erreur',
                retry: 'Réessayer',
                cancel: 'Annuler',
                confirm: 'Confirmer',
                close: 'Fermer',
                seeMore: 'Voir Plus',
                viewAll: 'Tout Voir'
            },
            // CityIntro Page
            cityIntro: {
                location: 'Vietnam · Hauts Plateaux',
                heroSubtitle: 'Sanctuaire de brumes fraîches, forêts de pins anciennes et élégance française intemporelle.',
                discovery: 'Découverte',
                discoveryTitle: 'Dr Alexandre Yersin créa ce havre au-dessus des nuages.',
                discoveryP1: 'Ce médecin et explorateur suisse-français a foulé ce plateau isolé en traçant de nouvelles routes à travers les montagnes Annamites. Captivé par le climat tempéré et les vues à couper le souffle, il rapporta sa découverte à l\'administration coloniale.',
                discoveryP2: 'Le nom \"Dalat\" vient de l\'expression K\'Ho \"Đạ Lạch\"—signifiant \"Ruisseau du Peuple Lat\". C\'est un hommage à ceux qui ont appelé ces hauts plateaux brumeux leur foyer pendant des siècles avant l\'arrivée des Français.',
                plateau: 'Plateau',
                plateauTitle: '1 500 mètres d\'altitude',
                plateauDesc: 'Perché sur le plateau Lang Biang, Dalat jouit de températures entre 14°C et 23°C toute l\'année. Alors que le reste du Vietnam étouffe sous la chaleur tropicale, les hauts plateaux restent un printemps éternel.',
                yearRound: 'Tout l\'An',
                elevation: 'Altitude',
                heritage: 'Patrimoine',
                heritageTitle: '2 000 villas françaises encore debout',
                heritageP1: 'L\'ère coloniale a laissé un héritage architectural unique en Asie du Sud-Est. Villas pastel, églises gothiques et hôtels Art Déco parsèment les collines—un musée vivant du design européen du début du 20e siècle.',
                heritageP2: 'Connue comme la \"Ville des Fleurs\", le climat frais de Dalat nourrit hortensias, roses et orchidées sauvages qui fleurissent toute l\'année, peignant les collines de couleurs perpétuelles.',
                quote: '"À Dalat, le temps ralentit au rythme des aiguilles de pin qui tombent et du murmure de la brume de montagne."',
                quoteAuthor: '— Réflexion d\'un voyageur',
                footerText: 'Une Expérience Numérique par Dalat Vibe'
            }
        }
    },
    zh: {
        translation: {
            // Navigation
            nav: {
                home: '首页',
                weather: '天气',
                recs: '精选',
                local: '美食',
                intro: '大叻',
                community: '社区'
            },
            // Authentication
            auth: {
                // Buttons
                login: '登录',
                logout: '退出',
                signUp: '注册',
                signIn: '立即登录',
                register: '创建账号',
                submit: '提交',
                // Labels
                email: '邮箱',
                password: '密码',
                username: '用户名',
                confirmPassword: '确认密码',
                profile: '我的资料',
                // Placeholders
                emailPlaceholder: '请输入您的邮箱',
                passwordPlaceholder: '请输入您的密码',
                usernamePlaceholder: '请选择用户名',
                confirmPasswordPlaceholder: '请再次输入密码',
                // Links & Text
                forgotPassword: '忘记密码？',
                noAccount: '还没有账号？',
                hasAccount: '已有账号？',
                orContinueWith: '或通过以下方式继续',
                termsAgree: '注册即表示您同意我们的条款',
                // Validation Errors
                invalidEmail: '请输入有效的邮箱地址',
                invalidPassword: '密码至少需要6个字符',
                passwordMismatch: '两次输入的密码不一致',
                requiredField: '此字段为必填项',
                loginFailed: '登录失败，请检查您的信息',
                registerSuccess: '账号创建成功！',
                welcomeBack: '欢迎回来！'
            },
            // Language
            language: {
                select: '选择语言',
                ko: '한국어',
                en: 'English',
                vi: 'Tiếng Việt',
                fr: 'Français',
                zh: '中文'
            },
            // Hero Section
            hero: {
                title: '探索\\n云雾高原',
                subtitle: '大叻：福地的奇妙精华。'
            },
            // Sections
            sections: {
                aiPicks: 'AI精选',
                forecastCuration: '天气推荐：今日完美匹配',
                viewAllRecs: '查看全部',
                localFavorites: '本地收藏',
                localGemsTitle: '大叻味道：隐藏的宝藏',
                discoverLocalEats: '探索美食',
                location: '位置',
                exploreCity: '探索大叻',
                mapDescription: '主要景点互动地图'
            },
            // AI Recommendations Page
            aiRecs: {
                title: '完美地点',
                subtitle: '今日天气',
                eyebrow: 'AI智能推荐',
                description: '我们的AI分析当前天气状况，为您的大叻之旅推荐完美目的地。',
                match: '匹配',
                backToHome: '返回首页'
            },
            // Local Eats Page
            localEats: {
                eyebrow: '本地发现',
                title: '地道风味',
                subtitle: '高原的',
                description: '本地人真正光顾的隐藏宝藏。没有游客陷阱，只有代代相传的正宗大叻美食传统。'
            },
            // Detail Page
            detail: {
                openNow: '营业中',
                closed: '已关闭',
                about: '简介',
                aiTip: 'AI提示',
                location: '位置',
                hours: '营业时间',
                getDirections: '导航',
                reviews: '评论',
                writeReview: '写评论',
                call: '拨打',
                share: '分享',
                save: '收藏',
                saved: '已收藏'
            },
            // Weather
            weather: {
                title: '天气预报',
                today: '今天',
                feelsLike: '体感',
                humidity: '湿度',
                wind: '风速',
                visibility: '能见度',
                uvIndex: '紫外线',
                sunrise: '日出',
                sunset: '日落',
                forecast: '5日预报',
                dalatHighlands: '大叻高原',
                currentConditions: '当前天气',
                dayForecast: '日间预报',
                hourlyBreakdown: '逐时详情',
                smartSuggestions: '智能推荐',
                outdoorAdventures: '户外探险',
                cozyIndoorRetreats: '室内休闲',
                perfectDestinations: '根据当前天气的完美目的地',
                tapToSeeHourly: '点击查看逐时详情',
                outfitGuide: '穿搭指南',
                outerwear: '外套',
                top: '上衣',
                bottom: '下装',
                warmer: '保暖',
                standard: '标准',
                cooler: '清凉',
                loading: '加载天气中...',
                unavailable: '天气不可用'
            },
            // Chat
            chat: {
                title: '大叻AI向导',
                greeting: '您好！我是大叻旅行助手。今天想探索什么？🌸',
                placeholder: '询问关于大叻...',
                thinking: '思考中...',
                errorProcess: '抱歉，处理问题时出错。请重试！',
                errorConnection: '无法连接服务器。请检查网络！'
            },
            // Footer
            footer: {
                brand: 'Dalat Vibe',
                tagline: '为梦幻灵魂策划的旅行。在越南迷人的高原发现隐藏的宝藏和正宗体验。',
                explore: '探索',
                weatherCuration: '天气策划',
                hiddenSpots: '隐藏景点',
                localFood: '本地美食',
                accommodations: '住宿',
                officialResources: '官方资源',
                visitVietnam: 'Visit Vietnam (官方)',
                dalatCommittee: '大叻人民委员会',
                lamDongTourism: '林同省旅游局',
                emergency: '紧急联系',
                creator: '创作者',
                designedBy: '设计与开发',
                rights: '版权所有。',
                privacy: '隐私政策',
                terms: '服务条款'
            },
            // Common
            common: {
                loading: '加载中...',
                error: '错误',
                retry: '重试',
                cancel: '取消',
                confirm: '确认',
                close: '关闭',
                seeMore: '查看更多',
                viewAll: '查看全部'
            },
            // CityIntro Page
            cityIntro: {
                location: '越南 · 中部高原',
                heroSubtitle: '清凉云雾、古老松林和永恒法式优雅的圣地。',
                discovery: '发现',
                discoveryTitle: '亚历山大·耶尔森博士在云端建立了这个天堂。',
                discoveryP1: '这位瑞士-法国医生和探险家在穿越安南山脉开辟新路线时，首次踏上了这片偏远高原。被温和的气候和壮丽的景色所吸引，他向殖民政府报告了他的发现。',
                discoveryP2: '"大叻"这个名字源自当地克豪族的短语"Đạ Lạch"——意为"拉特人的溪流"。这是对那些在法国人到来前几个世纪就将这片云雾高原称为家园的人们的致敬。',
                plateau: '高原',
                plateauTitle: '海拔1,500米',
                plateauDesc: '坐落在林比昂高原上，大叻全年气温保持在14°C至23°C之间。当越南其他地区在热带高温中挣扎时，高原依然是永恒的春天。',
                yearRound: '全年',
                elevation: '海拔',
                heritage: '遗产',
                heritageTitle: '2,000座法式别墅仍然屹立',
                heritageP1: '殖民时代留下了东南亚独一无二的建筑遗产。柔和色调的别墅、哥特式教堂和装饰艺术风格的酒店点缀在山坡上——一座20世纪初欧洲设计的活博物馆。',
                heritageP2: '被称为"花城"的大叻，凉爽的气候培育了全年盛开的绣球花、玫瑰和野生兰花，用永恒的色彩点缀着群山。',
                quote: '"在大叻，时间随着松针飘落的节奏和山间云雾的低语而放慢。"',
                quoteAuthor: '——一位旅行者的感悟',
                footerText: 'Dalat Vibe 数字体验'
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
