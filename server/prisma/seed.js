import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// =============================================================================
// Categories - Extended with Food Types
// =============================================================================

const categories = [
    { name: 'Nature', nameVi: 'Thiên nhiên' },
    { name: 'Lake', nameVi: 'Hồ' },
    { name: 'Café', nameVi: 'Quán cà phê' },
    { name: 'Waterfall', nameVi: 'Thác nước' },
    { name: 'Street', nameVi: 'Đường phố' },
    { name: 'Architecture', nameVi: 'Kiến trúc' },
    { name: 'Historic Stay', nameVi: 'Lưu trú lịch sử' },
    { name: 'Adventure', nameVi: 'Phiêu lưu' },
    { name: 'Park', nameVi: 'Công viên' },
    { name: 'Local Experience', nameVi: 'Trải nghiệm địa phương' },
    { name: 'Scenic', nameVi: 'Phong cảnh' },
    { name: 'Restaurant', nameVi: 'Nhà hàng' },
    { name: 'Street Food', nameVi: 'Ẩm thực đường phố' },
    { name: 'Temple', nameVi: 'Chùa' },
    { name: 'Garden', nameVi: 'Vườn hoa' }
];

// =============================================================================
// Places - Comprehensive 35+ Locations
// =============================================================================

const places = [
    // ==================== Nature & Scenic ====================
    {
        title: 'Langbiang Mountain',
        titleVi: 'Núi Langbiang',
        location: 'Lạc Dương District',
        locationVi: 'Huyện Lạc Dương',
        description: 'A mystical peak wrapped in morning mist, offering panoramic views of the highlands. The mountain stands at 2,167m and is sacred to the K\'ho people.',
        descriptionVi: 'Đỉnh núi huyền bí cao 2.167m, bao phủ trong sương mù buổi sáng, mang đến tầm nhìn toàn cảnh vùng cao nguyên. Đây là nơi linh thiêng của người K\'ho.',
        imagePath: 'https://ongvove.com/uploads/0000/79/2023/07/22/langbiang-1.jpg',
        categoryName: 'Nature',
        latitude: 12.0459,
        longitude: 108.4412,
        openingHours: '6:00 AM - 5:00 PM',
        designerTip: 'Start your hike at dawn to catch the mesmerizing sea of clouds. Bring layers as temperatures drop significantly at the peak.'
    },
    {
        title: 'Hồ Tuyền Lâm',
        titleVi: 'Hồ Tuyền Lâm',
        location: 'Trại Mát Ward',
        locationVi: 'Phường Trại Mát',
        description: 'A serene lake surrounded by pine forests, perfect for contemplative mornings. The largest lake in Da Lat with stunning natural scenery.',
        descriptionVi: 'Hồ nước yên bình được bao quanh bởi rừng thông, hoàn hảo cho những buổi sáng thư thái. Đây là hồ lớn nhất Đà Lạt với cảnh quan thiên nhiên tuyệt đẹp.',
        imagePath: 'https://samtenhills.vn/wp-content/uploads/2025/07/ho-tuyen-lam-1.jpg',
        categoryName: 'Lake',
        latitude: 11.9165,
        longitude: 108.4231,
        designerTip: 'Rent a kayak in the early afternoon when the light is softest. The small islands in the middle of the lake offer secluded spots for a peaceful picnic.'
    },
    {
        title: 'Valley of Love',
        titleVi: 'Thung Lũng Tình Yêu',
        location: 'Phường 8, Dalat',
        locationVi: 'Phường 8, Đà Lạt',
        description: 'Rolling hills adorned with wildflowers, a timeless romantic escape. One of the most famous tourist attractions in Da Lat.',
        descriptionVi: 'Những ngọn đồi thoai thoải trải dài, phủ đầy hoa dại, là nơi trốn thoát lãng mạn vượt thời gian. Một trong những điểm du lịch nổi tiếng nhất Đà Lạt.',
        imagePath: 'https://dulichcaonguyen.com/wp-content/uploads/2025/05/Thung-lung-tinh-yeu-Da-Lat-1_23022024102445.jpg',
        categoryName: 'Park',
        latitude: 11.9521,
        longitude: 108.4289,
        openingHours: '7:00 AM - 5:00 PM',
        designerTip: 'Visit early morning to avoid crowds. The lake at the heart of the valley is especially beautiful with morning mist.'
    },
    {
        title: 'Datanla Waterfall',
        titleVi: 'Thác Datanla',
        location: 'Prenn Pass',
        locationVi: 'Đèo Prenn',
        description: 'Crystal waters cascading through ancient forest, an adventure in nature. Features an exciting alpine coaster ride.',
        descriptionVi: 'Dòng thác trong vắt đổ xuống giữa rừng già, một cuộc phiêu lưu giữa thiên nhiên. Có máng trượt alpine coaster cực kỳ thú vị.',
        imagePath: 'https://cdn.prod.rexby.com/image/06819f7110a5489abb415cc636e56342',
        categoryName: 'Waterfall',
        latitude: 11.9089,
        longitude: 108.4567,
        openingHours: '7:00 AM - 5:00 PM',
        designerTip: 'Take the alpine coaster for an unforgettable experience. Visit during or right after the rainy season for the most impressive water flow.'
    },
    {
        title: 'Elephant Waterfall',
        titleVi: 'Thác Voi',
        location: 'Nam Ban, Lâm Hà',
        locationVi: 'Nam Ban, Lâm Hà',
        description: 'One of the largest and most majestic waterfalls in Da Lat. The thundering cascade drops over 30 meters into a misty pool below.',
        descriptionVi: 'Một trong những thác nước hùng vĩ nhất Đà Lạt. Dòng thác ầm ầm đổ xuống hơn 30 mét vào vực nước đầy sương khói.',
        imagePath: 'https://hitour.vn/storage/images/upload/tour-tham-quan-thac-voi-ngoai-thanh-da-lat-1-ngay-750.webp',
        categoryName: 'Waterfall',
        latitude: 11.7589,
        longitude: 108.2983,
        openingHours: '7:00 AM - 5:00 PM',
        designerTip: 'Wear sturdy shoes for the slippery trail down. The best photos are taken from the viewing platform on the left side.'
    },
    {
        title: 'Pongour Waterfall',
        titleVi: 'Thác Pongour',
        location: 'Đức Trọng District',
        locationVi: 'Huyện Đức Trọng',
        description: 'Known as the "most beautiful waterfall in the South", this seven-tiered cascade spreads over 100 meters wide during rainy season.',
        descriptionVi: 'Được mệnh danh là "thác nước đẹp nhất miền Nam", thác 7 tầng này trải rộng hơn 100 mét vào mùa mưa.',
        imagePath: 'https://dulichviet.com.vn/images/bandidau/thac-pongour-dia-diem-du-lich-da-lat-ma-du-khach-khong-nen-bo-lo.jpg',
        categoryName: 'Waterfall',
        latitude: 11.7456,
        longitude: 108.4123,
        openingHours: '7:00 AM - 5:00 PM',
        designerTip: 'Visit between July-November for the most spectacular water volume. Pack a picnic for the scenic grounds.'
    },
    {
        title: 'Xuan Huong Lake',
        titleVi: 'Hồ Xuân Hương',
        location: 'City Center',
        locationVi: 'Trung tâm thành phố',
        description: 'The heart of Da Lat city, this crescent-shaped lake is perfect for romantic walks and cycling. Misty mornings create magical reflections.',
        descriptionVi: 'Trái tim của thành phố Đà Lạt, hồ hình lưỡi liềm này hoàn hảo cho những buổi dạo bộ lãng mạn và đạp xe. Sáng sớm sương mù tạo nên những phản chiếu kỳ diệu.',
        imagePath: 'https://samtenhills.vn/wp-content/uploads/2025/07/ho-xuan-huong-da-lat.jpg',
        categoryName: 'Scenic',
        latitude: 11.9380,
        longitude: 108.4372,
        designerTip: 'Rent a swan boat at sunset for the most romantic experience. The small cafes along the shore offer perfect spots for people watching.'
    },
    {
        title: 'Golden Valley',
        titleVi: 'Thung Lũng Vàng',
        location: 'Phường 7, Dalat',
        locationVi: 'Phường 7, Đà Lạt',
        description: 'A scenic valley featuring tea plantations, strawberry farms, and beautiful pine forests. Less crowded than Valley of Love.',
        descriptionVi: 'Thung lũng thơ mộng với những đồi chè, vườn dâu tây và rừng thông đẹp. Ít đông đúc hơn Thung Lũng Tình Yêu.',
        imagePath: 'https://zoomtravel.vn/upload/images/thung-lung-vang-1-min.jpg',
        categoryName: 'Nature',
        latitude: 11.9234,
        longitude: 108.4567,
        openingHours: '7:00 AM - 5:00 PM',
        designerTip: 'Try fresh strawberries from the farms. The zip-line here offers stunning views of the valley.'
    },

    // ==================== Cafés ====================
    {
        title: 'The Married Café',
        titleVi: 'Quán Cà Phê Vợ Chồng',
        location: 'Phường 4, Dalat',
        locationVi: 'Phường 4, Đà Lạt',
        description: 'Where artisanal coffee meets French colonial architecture in a garden setting. A hidden gem known for its unique atmosphere.',
        descriptionVi: 'Nơi cà phê thủ công gặp gỡ kiến trúc thuộc địa Pháp trong khung cảnh vườn. Viên ngọc ẩn nổi tiếng với bầu không khí độc đáo.',
        imagePath: 'https://sakos.vn/wp-content/uploads/2023/05/cham-vao-lang-man-quan-ca-phe-dep-lung-linh-cho-cap-doi-tai-da-lat-2.jpg',
        categoryName: 'Café',
        latitude: 11.9416,
        longitude: 108.4378,
        openingHours: '7:00 AM - 10:00 PM',
        designerTip: 'Ask for the house special weasel coffee. Sit in the garden area during late afternoon for the best lighting.'
    },
    {
        title: 'Me Linh Coffee Garden',
        titleVi: 'Vườn Cà Phê Mê Linh',
        location: 'Tà Nung',
        locationVi: 'Tà Nung',
        description: 'Valley views enhanced by morning fog. One of the most scenic coffee gardens in Da Lat with panoramic mountain views.',
        descriptionVi: 'Tầm nhìn thung lũng được tôn thêm bởi sương mù buổi sáng. Một trong những vườn cà phê có view đẹp nhất Đà Lạt.',
        imagePath: 'https://dalattrongtoi.com/media/upload/images/h%E1%BB%93/55.jpg',
        categoryName: 'Café',
        latitude: 11.8833,
        longitude: 108.4756,
        openingHours: '6:00 AM - 6:00 PM',
        designerTip: 'Arrive before 7 AM to catch the sunrise over the valley. Try their signature egg coffee with a valley view.'
    },
    {
        title: 'An Cafe',
        titleVi: 'An Cafe',
        location: 'Nguyễn Chí Thanh, Phường 1',
        locationVi: 'Nguyễn Chí Thanh, Phường 1',
        description: 'A cozy 24-hour café perfect for digital nomads and late-night study sessions. Known for its peaceful atmosphere.',
        descriptionVi: 'Quán cà phê ấm cúng mở 24 giờ, hoàn hảo cho dân freelancer và học bài đêm. Nổi tiếng với không gian yên tĩnh.',
        imagePath: 'https://mia.vn/media/uploads/blog-du-lich/an-coffee-chon-binh-yen-xanh-tham-cho-nhung-tam-hon-mong-manh-1635285247.jpg',
        categoryName: 'Café',
        latitude: 11.9421,
        longitude: 108.4398,
        openingHours: 'Open 24 hours',
        phone: '+84 909 888 999',
        designerTip: 'Best visited late at night when the city is quiet. Their hot chocolate is perfect for cold Da Lat nights.'
    },
    {
        title: 'Windmills Coffee',
        titleVi: 'Cafe Cối Xay Gió',
        location: '94 Nguyễn Đình Chiểu',
        locationVi: '94 Nguyễn Đình Chiểu',
        description: 'Instagram-famous café with a distinctive windmill and vibrant flower gardens. Perfect for photo opportunities.',
        descriptionVi: 'Quán cà phê nổi tiếng trên Instagram với cối xay gió đặc trưng và vườn hoa rực rỡ. Hoàn hảo để chụp ảnh.',
        imagePath: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/99/40/5f/windmills-cafe.jpg?w=700&h=400&s=1',
        categoryName: 'Café',
        latitude: 11.9478,
        longitude: 108.4521,
        openingHours: '7:00 AM - 9:00 PM',
        designerTip: 'Come early morning to avoid crowds. The lower terrace has the best views of the windmill.'
    },

    // ==================== Architecture & Historic ====================
    {
        title: 'Crazy House',
        titleVi: 'Ngôi Nhà Điên',
        location: 'Huỳnh Thúc Kháng Street',
        locationVi: 'Đường Huỳnh Thúc Kháng',
        description: 'A fantastical architectural masterpiece designed by architect Đặng Việt Nga. Indoor exploration ideal for any weather.',
        descriptionVi: 'Kiệt tác kiến trúc kỳ ảo do kiến trúc sư Đặng Việt Nga thiết kế. Khám phá trong nhà, lý tưởng cho mọi thời tiết.',
        imagePath: 'https://crazyhouse.vn/uploads/anh/94615392-153463912820988-79798108652830720-o.jpg',
        categoryName: 'Architecture',
        latitude: 11.9345,
        longitude: 108.4252,
        openingHours: '8:30 AM - 7:00 PM',
        designerTip: 'Book a room overnight for the full experience. The giraffe room has the most unique bed in Vietnam.'
    },
    {
        title: 'Dalat Palace Heritage Hotel',
        titleVi: 'Khách Sạn Dalat Palace',
        location: 'Trần Phú Street',
        locationVi: 'Đường Trần Phú',
        description: 'Perfect for misty weather - cozy French colonial architecture. A historic luxury hotel dating back to 1922.',
        descriptionVi: 'Hoàn hảo cho thời tiết sương mù - kiến trúc thuộc địa Pháp ấm cúng. Khách sạn sang trọng lịch sử từ năm 1922.',
        imagePath: 'https://www.dalatpalacehotel.com/wp-content/uploads/elementor/thumbs/3-3-r9uh9nghwss3m4lsyuzd45tvd0szqca3kqprtxx5ws.jpg',
        categoryName: 'Historic Stay',
        latitude: 11.9363,
        longitude: 108.4383,
        phone: '+84 263 3825 444',
        designerTip: 'Even if not staying, visit the golf course or Le Rabelais restaurant for authentic French cuisine.'
    },
    {
        title: 'Dalat Railway Station',
        titleVi: 'Ga Đà Lạt',
        location: 'Quang Trung Street',
        locationVi: 'Đường Quang Trung',
        description: 'The oldest railway station in Indochina with stunning French architecture. Take the vintage train to Trại Mát.',
        descriptionVi: 'Ga xe lửa cổ nhất Đông Dương với kiến trúc Pháp tuyệt đẹp. Trải nghiệm chuyến tàu vintage đến Trại Mát.',
        imagePath: 'https://ik.imagekit.io/tvlk/blog/2024/09/ga-da-lat-1-1024x682.webp?tr=q-70,c-at_max,w-1000,h-600',
        categoryName: 'Architecture',
        latitude: 11.9423,
        longitude: 108.4567,
        openingHours: '7:00 AM - 5:00 PM',
        designerTip: 'Take the 5km train ride to Trại Mát for beautiful countryside views. Trains run every 2 hours.'
    },
    {
        title: 'Domaine de Marie Church',
        titleVi: 'Nhà Thờ Domaine de Marie',
        location: 'Ngô Quyền Street',
        locationVi: 'Đường Ngô Quyền',
        description: 'A pink-colored church built in 1940s with unique Normandy-style architecture. Houses a convent and beautiful gardens.',
        descriptionVi: 'Nhà thờ màu hồng xây năm 1940 với kiến trúc kiểu Normandy độc đáo. Bên trong có tu viện và vườn đẹp.',
        imagePath: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Nha_tho_Domaine_de_Marie_-_Huy_Phuong_1.jpg',
        categoryName: 'Architecture',
        latitude: 11.9389,
        longitude: 108.4234,
        openingHours: '7:00 AM - 5:00 PM',
        designerTip: 'Visit during golden hour for stunning photography. The nuns sell handmade fruit preserves at the entrance.'
    },

    // ==================== Restaurants ====================
    {
        title: 'Bánh Căn Cô Hương',
        titleVi: 'Bánh Căn Cô Hương',
        location: 'Phan Đình Phùng Street',
        locationVi: 'Đường Phan Đình Phùng',
        description: 'Legendary spot for Bánh Căn - miniature rice cakes with quail eggs. A local favorite for over 30 years.',
        descriptionVi: 'Địa điểm huyền thoại cho món Bánh Căn - bánh gạo mini với trứng cút. Món ưa thích của người dân địa phương hơn 30 năm.',
        imagePath: 'https://dulichkhampha24.com/wp-content/uploads/2022/11/banh-can-da-lat-2.png',
        categoryName: 'Street Food',
        latitude: 11.9412,
        longitude: 108.4356,
        openingHours: '6:00 AM - 10:00 AM',
        designerTip: 'Come before 8 AM to avoid long queues. Order extra quail eggs for the authentic experience.'
    },
    {
        title: 'Kem Bơ Thanh Thảo',
        titleVi: 'Kem Bơ Thanh Thảo',
        location: 'Near Dalat Market',
        locationVi: 'Gần Chợ Đà Lạt',
        description: 'Legendary avocado ice cream shop serving creamy, rich treats since 1985. A must-visit Dalat dessert destination.',
        descriptionVi: 'Tiệm kem bơ huyền thoại phục vụ món kem béo ngậy từ năm 1985. Điểm đến tráng miệng không thể bỏ qua ở Đà Lạt.',
        imagePath: 'https://down-vn.img.susercontent.com/vn-11134259-7r98o-lw9avx7lpzob97',
        categoryName: 'Street Food',
        latitude: 11.9404,
        longitude: 108.4389,
        openingHours: '10:00 AM - 10:00 PM',
        designerTip: 'Try the mixed avocado-durian ice cream for a unique flavor combination only locals know about.'
    },
    {
        title: 'Nem Nướng Bà Hùng',
        titleVi: 'Nem Nướng Bà Hùng',
        location: 'Hai Bà Trưng Street',
        locationVi: 'Đường Hai Bà Trưng',
        description: 'Famous grilled pork sausage wraps with fresh herbs and rice paper. The perfect street food experience.',
        descriptionVi: 'Nem nướng cuốn bánh tráng nổi tiếng với rau sống. Trải nghiệm ẩm thực đường phố hoàn hảo.',
        imagePath: 'https://img.360dalat.com/resize/730x-/2020/10/07/ba-hung-nem-nuong-1aa3.jpg',
        categoryName: 'Street Food',
        latitude: 11.9378,
        longitude: 108.4412,
        openingHours: '2:00 PM - 9:00 PM',
        designerTip: 'Ask for extra dipping sauce - their house-made sauce is the secret to the dish.'
    },
    {
        title: 'Bún Bò Huế Cô Giang',
        titleVi: 'Bún Bò Huế Cô Giang',
        location: 'Nguyễn Văn Trỗi',
        locationVi: 'Nguyễn Văn Trỗi',
        description: 'Warming highland comfort food - spicy beef noodle soup that perfectly suits the cool Dalat weather.',
        descriptionVi: 'Món ăn cao nguyên ấm áp - bún bò cay nồng hoàn hảo cho thời tiết se lạnh Đà Lạt.',
        imagePath: 'https://i.ytimg.com/vi/CSI9ildGX9s/maxresdefault.jpg',
        categoryName: 'Restaurant',
        latitude: 11.9356,
        longitude: 108.4334,
        openingHours: '6:00 AM - 2:00 PM',
        designerTip: 'Add extra lemon grass and chili for the authentic Huế flavor. Pairs well with bánh mì on the side.'
    },
    {
        title: 'Lẩu Bò Hào Phát',
        titleVi: 'Lẩu Bò Hào Phát',
        location: 'Nguyễn Văn Trỗi, Phường 2',
        locationVi: 'Nguyễn Văn Trỗi, Phường 2',
        description: 'The most famous beef hot pot in Dalat with rich broth and fresh beef. Perfect for cold evening dinners.',
        descriptionVi: 'Lẩu bò nổi tiếng nhất Đà Lạt với nước dùng đậm đà và thịt bò tươi. Hoàn hảo cho bữa tối lạnh.',
        imagePath: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/lau_gan_bo_14_c8c91b7fc0.jpg',
        categoryName: 'Restaurant',
        latitude: 11.9389,
        longitude: 108.4412,
        openingHours: '10:00 AM - 10:00 PM',
        phone: '+84 263 3825 555',
        designerTip: 'Order the beef set with all cuts for the full experience. Their mushroom plate is also exceptional.'
    },
    {
        title: 'Memory Restaurant',
        titleVi: 'Nhà Hàng Memory',
        location: 'Trần Hưng Đạo Street',
        locationVi: 'Đường Trần Hưng Đạo',
        description: 'Upscale Vietnamese fusion restaurant with mountain views. Perfect for a special dinner.',
        descriptionVi: 'Nhà hàng Việt fusion cao cấp với view núi. Hoàn hảo cho bữa tối đặc biệt.',
        imagePath: 'https://du-lich-da-lat.com//wp-content/uploads/2021/01/nha-hang-memory-tai-da-lat-1024x576.jpg',
        categoryName: 'Restaurant',
        latitude: 11.9356,
        longitude: 108.4378,
        openingHours: '10:00 AM - 10:00 PM',
        phone: '+84 263 3511 888',
        designerTip: 'Reserve a table on the terrace for the best views. Their grilled salmon is outstanding.'
    },
    {
        title: 'Ganesh Indian Restaurant',
        titleVi: 'Nhà Hàng Ấn Độ Ganesh',
        location: 'Trường Công Định, Phường 3',
        locationVi: 'Trường Công Định, Phường 3',
        description: 'Authentic Indian cuisine in the heart of Dalat. Known for fresh naan and flavorful curries.',
        descriptionVi: 'Ẩm thực Ấn Độ chính thống giữa lòng Đà Lạt. Nổi tiếng với bánh naan tươi và cà ri đậm đà.',
        imagePath: 'https://ganesh.vn/wp-content/uploads/2020/05/nha-hang-am-thuc-ganesh-1.jpg',
        categoryName: 'Restaurant',
        latitude: 11.9401,
        longitude: 108.4378,
        openingHours: '11:00 AM - 10:00 PM',
        phone: '+84 263 3520 999',
        designerTip: 'Try the butter chicken with garlic naan. Their mango lassi is perfect for cooler Dalat weather.'
    },
    {
        title: 'Phở Gà Lâm Viên',
        titleVi: 'Phở Gà Lâm Viên',
        location: 'Lâm Viên Square',
        locationVi: 'Quảng trường Lâm Viên',
        description: 'Soul-warming chicken pho with highland herbs. A local breakfast staple since 1975.',
        descriptionVi: 'Phở gà thơm ngon với thảo mộc cao nguyên. Món điểm tâm địa phương từ năm 1975.',
        imagePath: 'https://i-giadinh.vnecdn.net/2021/01/15/pho1-1610692656-2291-1610693117.jpg',
        categoryName: 'Restaurant',
        latitude: 11.9445,
        longitude: 108.4356,
        openingHours: '6:00 AM - 12:00 PM',
        designerTip: 'Add extra quẩy (fried dough sticks) for the authentic experience. Their chili sauce is house-made.'
    },
    {
        title: 'Bánh Tráng Nướng Chợ Đêm',
        titleVi: 'Bánh Tráng Nướng Chợ Đêm',
        location: 'Night Market Area',
        locationVi: 'Khu Chợ Đêm',
        description: 'Vietnamese pizza - crispy rice paper with toppings. The quintessential Dalat night market snack.',
        descriptionVi: 'Pizza Việt Nam - bánh tráng giòn với đủ loại topping. Món ăn vặt đặc trưng chợ đêm Đà Lạt.',
        imagePath: 'https://static.vinwonders.com/production/banh-trang-nuong-da-lat-1.jpg',
        categoryName: 'Street Food',
        latitude: 11.9431,
        longitude: 108.4398,
        openingHours: '5:00 PM - 11:00 PM',
        designerTip: 'Watch the cook grill it over charcoal for entertainment. Add extra cheese for a modern twist.'
    },
    {
        title: 'Xôi Gà Chợ Đà Lạt',
        titleVi: 'Xôi Gà Chợ Đà Lạt',
        location: 'Dalat Central Market',
        locationVi: 'Chợ Đà Lạt',
        description: 'Sticky rice with shredded chicken - a hearty morning meal beloved by locals.',
        descriptionVi: 'Xôi gà - bữa sáng đầy năng lượng được người dân địa phương yêu thích.',
        imagePath: 'https://gofood.vn//upload/r/xoi-ga-mo-hanh.jpg',
        categoryName: 'Street Food',
        latitude: 11.9423,
        longitude: 108.4367,
        openingHours: '5:00 AM - 10:00 AM',
        designerTip: 'Ask for extra fried shallots on top. Their chili sauce is legendary among locals.'
    },

    // ==================== Local Experiences ====================
    {
        title: 'Dalat Night Market',
        titleVi: 'Chợ Đêm Đà Lạt',
        location: 'Nguyen Thi Minh Khai Street',
        locationVi: 'Đường Nguyễn Thị Minh Khai',
        description: 'Cool evening weather perfect for street food exploration. Experience local cuisine and culture in this vibrant night market.',
        descriptionVi: 'Thời tiết buổi tối mát mẻ hoàn hảo để khám phá ẩm thực đường phố. Trải nghiệm văn hóa và ẩm thực địa phương tại chợ đêm sôi động.',
        imagePath: 'https://statics.vinpearl.com/cho-dem-da-lat-2_1687963722.jpg',
        categoryName: 'Local Experience',
        latitude: 11.9431,
        longitude: 108.4398,
        openingHours: '6:00 PM - 11:00 PM',
        designerTip: 'Start from the north end and work your way down. The fruit stalls have the best local strawberries.'
    },
    {
        title: 'Mai Anh Đào Street',
        titleVi: 'Đường Mai Anh Đào',
        location: 'Phường 3, Dalat',
        locationVi: 'Phường 3, Đà Lạt',
        description: 'Cherry blossom lanes that transform into a pink dreamscape each spring. A photographer\'s paradise during blooming season.',
        descriptionVi: 'Con đường hoa anh đào biến thành khung cảnh mơ màng màu hồng mỗi mùa xuân. Thiên đường nhiếp ảnh vào mùa hoa nở.',
        imagePath: 'https://vcdn1-dulich.vnecdn.net/2021/01/07/bill-balo-maianhdao-dalat-2-1609925658-1610029777.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=1s_bUnjam8Dp2V0p0aKVqg',
        categoryName: 'Street',
        latitude: 11.9398,
        longitude: 108.4356,
        designerTip: 'Best visited in late January to early February during cherry blossom season. Early morning offers the best photographs without crowds.'
    },
    {
        title: 'ZooDoo Dalat',
        titleVi: 'ZooDoo Đà Lạt',
        location: 'Xuân Thọ',
        locationVi: 'Xuân Thọ',
        description: 'Interactive zoo where visitors can play with adorable animals including alpacas, sheep, and rabbits.',
        descriptionVi: 'Sở thú tương tác nơi du khách có thể chơi đùa với các loài động vật dễ thương như alpaca, cừu và thỏ.',
        imagePath: 'https://letsflytravel.vn/wp-content/uploads/2025/04/so-thu-zoodoo-da-lat-2-740x490.webp',
        categoryName: 'Adventure',
        latitude: 11.8567,
        longitude: 108.3987,
        openingHours: '8:00 AM - 5:00 PM',
        phone: '+84 263 3789 456',
        designerTip: 'Buy carrots at the entrance to feed the alpacas. The petting area is best visited in early morning when animals are most active.'
    },
    {
        title: 'Cau Dat Tea Farm',
        titleVi: 'Nông Trại Trà Cầu Đất',
        location: 'Xuân Trường',
        locationVi: 'Xuân Trường',
        description: 'Beautiful tea plantations with farm tours and a scenic café. Learn about tea production from seed to cup.',
        descriptionVi: 'Đồi chè tuyệt đẹp với tour tham quan nông trại và quán café view đẹp. Tìm hiểu quy trình sản xuất trà từ hạt đến ly.',
        imagePath: 'https://media.vietravel.com/images/Content/doi-che-cau-dat-o-da-lat-2.png',
        categoryName: 'Adventure',
        latitude: 11.8312,
        longitude: 108.5067,
        openingHours: '7:00 AM - 5:00 PM',
        phone: '+84 263 3678 123',
        designerTip: 'Join the 2PM tour for the most comprehensive experience. Buy their Oolong tea as a souvenir.'
    },

    // ==================== Temples & Gardens ====================
    {
        title: 'Truc Lam Zen Monastery',
        titleVi: 'Thiền Viện Trúc Lâm',
        location: 'Near Tuyen Lam Lake',
        locationVi: 'Gần Hồ Tuyền Lâm',
        description: 'The largest Zen monastery in Da Lat, nestled by the peaceful Tuyen Lam Lake. Perfect for spiritual contemplation.',
        descriptionVi: 'Thiền viện Zen lớn nhất Đà Lạt, nằm bên Hồ Tuyền Lâm yên bình. Hoàn hảo để thiền định tâm linh.',
        imagePath: 'https://statics.vinpearl.com/thien-vien-truc-lam-da-lat-2_1690967479.jpg',
        categoryName: 'Temple',
        latitude: 11.8823,
        longitude: 108.4345,
        openingHours: '5:00 AM - 5:00 PM',
        designerTip: 'Take the cable car for stunning views. Visit during morning prayer for an authentic spiritual experience.'
    },
    {
        title: 'Dalat Flower Garden',
        titleVi: 'Vườn Hoa Đà Lạt',
        location: 'Near Xuan Huong Lake',
        locationVi: 'Gần Hồ Xuân Hương',
        description: 'Hundreds of flower species from around the world in a beautifully designed garden. Hosts the annual Dalat Flower Festival.',
        descriptionVi: 'Hàng trăm loài hoa từ khắp nơi trên thế giới trong khu vườn được thiết kế đẹp mắt. Tổ chức Festival Hoa Đà Lạt hàng năm.',
        imagePath: 'https://statics.vinpearl.com/vuon-hoa-thanh-pho-da-lat-5_1689838404.jpg',
        categoryName: 'Garden',
        latitude: 11.9432,
        longitude: 108.4256,
        openingHours: '7:30 AM - 5:00 PM',
        phone: '+84 263 3822 178',
        designerTip: 'Visit December-January for the Flower Festival. The orchid greenhouse has the most exotic species.'
    },
    {
        title: 'Linh Phuoc Pagoda',
        titleVi: 'Chùa Linh Phước',
        location: 'Trại Mát',
        locationVi: 'Trại Mát',
        description: 'A stunning pagoda made entirely of broken glass and ceramics. Features a 49-meter dragon sculpture.',
        descriptionVi: 'Ngôi chùa tuyệt đẹp làm hoàn toàn từ kính và gốm vỡ. Có tượng rồng 49 mét.',
        imagePath: 'https://cdn3.ivivu.com/2022/10/ch%C3%B9a-linh-ph%C6%B0%E1%BB%9Bc-ivivu-1.jpg',
        categoryName: 'Temple',
        latitude: 11.9134,
        longitude: 108.4678,
        openingHours: '6:00 AM - 5:00 PM',
        designerTip: 'Take the antique train from Dalat Railway Station for a unique arrival. The bell tower offers great photos.'
    },

    // ==================== Adventure ====================
    {
        title: 'Langbiang Peak Trail',
        titleVi: 'Đường Mòn Đỉnh Langbiang',
        location: 'Lạc Dương District',
        locationVi: 'Huyện Lạc Dương',
        description: 'Clear skies ideal for panoramic views. A challenging but rewarding hiking trail to the summit.',
        descriptionVi: 'Bầu trời trong xanh lý tưởng cho tầm nhìn toàn cảnh. Đường mòn leo núi đầy thử thách nhưng xứng đáng.',
        imagePath: 'https://amthucdalat.vn/wp-content/uploads/2024/06/dinh-nui-langbiang-noc-nha-vung-tay-nguyen-3.jpg',
        categoryName: 'Adventure',
        latitude: 12.0500,
        longitude: 108.4400,
        openingHours: '6:00 AM - 5:00 PM',
        designerTip: 'Start at 5 AM to reach the peak for sunrise. Bring at least 2 liters of water and wear hiking boots.'
    },
    {
        title: 'Clay Tunnel',
        titleVi: 'Đường Hầm Đất Sét',
        location: 'Phường 4',
        locationVi: 'Phường 4',
        description: 'Unique clay artwork sculptures depicting Da Lat history and culture. An indoor attraction perfect for rainy days.',
        descriptionVi: 'Tác phẩm điêu khắc đất sét độc đáo mô tả lịch sử và văn hóa Đà Lạt. Điểm tham quan trong nhà hoàn hảo cho ngày mưa.',
        imagePath: 'https://cdn2.tuoitre.vn/thumb_w/1200/471584752817336320/2024/6/3/image012-16983680094131998465729-17174042616911311510796-16-0-398-730-crop-17174051360551442515636.jpg',
        categoryName: 'Architecture',
        latitude: 11.9134,
        longitude: 108.4678,
        openingHours: '7:00 AM - 5:30 PM',
        phone: '+84 263 3567 890',
        designerTip: 'Join a guided tour to understand the stories behind each sculpture. Photography is allowed but no flash.'
    }
];

// =============================================================================
// Sample Reviews - More comprehensive
// =============================================================================

const sampleReviews = [
    {
        title: 'Amazing mountain experience!',
        content: 'The view from Langbiang Mountain is absolutely breathtaking. I recommend going early in the morning to catch the sunrise.',
        rating: 5,
        language: 'en',
        placeTitle: 'Langbiang Mountain'
    },
    {
        title: 'Peaceful lake escape',
        content: 'Tuyen Lam Lake is so serene. We rented kayaks and spent the whole afternoon exploring. Highly recommend!',
        rating: 5,
        language: 'en',
        placeTitle: 'Hồ Tuyền Lâm'
    },
    {
        title: 'Best coffee in Dalat',
        content: 'The weasel coffee here is incredible. The garden atmosphere is unique and relaxing.',
        rating: 4,
        language: 'en',
        placeTitle: 'The Married Café'
    },
    {
        title: 'Thác nước tuyệt đẹp',
        content: 'Datanla thật sự đẹp! Trượt xe xuống thác rất thú vị. Nhớ mang áo mưa!',
        rating: 5,
        language: 'vi',
        placeTitle: 'Datanla Waterfall'
    },
    {
        title: 'Chợ đêm vui quá',
        content: 'Đồ ăn ngon, giá cả phải chăng. Nên đến vào ngày thường để tránh đông.',
        rating: 4,
        language: 'vi',
        placeTitle: 'Dalat Night Market'
    },
    {
        title: 'Must try Bánh Căn!',
        content: 'This is the best Bánh Căn I have ever had. Authentic taste, friendly owner, and very affordable!',
        rating: 5,
        language: 'en',
        placeTitle: 'Bánh Căn Cô Hương'
    },
    {
        title: 'Kem bơ ngon tuyệt!',
        content: 'Kem bơ ở đây quá ngon, vị béo ngậy mà không ngấy. Nhất định phải thử!',
        rating: 5,
        language: 'vi',
        placeTitle: 'Kem Bơ Thanh Thảo'
    },
    {
        title: 'Perfect viewpoint',
        content: 'Valley of Love offers amazing photo opportunities. Go early to avoid crowds.',
        rating: 4,
        language: 'en',
        placeTitle: 'Valley of Love'
    },
    {
        title: 'Architectural wonder',
        content: 'Crazy House is unlike anything I have ever seen. Great for photography!',
        rating: 5,
        language: 'en',
        placeTitle: 'Crazy House'
    },
    {
        title: 'Lẩu bò đỉnh cao',
        content: 'Nước dùng thơm đậm đà, thịt bò tươi ngon. Quán đông nên nhớ đến sớm!',
        rating: 5,
        language: 'vi',
        placeTitle: 'Lẩu Bò Hào Phát'
    }
];

// =============================================================================
// Seed Function
// =============================================================================

async function main() {
    console.log('🌱 Starting database seed...');

    // Clear existing data
    await prisma.favorite.deleteMany();
    await prisma.review.deleteMany();
    await prisma.place.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('✓ Cleared existing data');

    // Create categories
    for (const cat of categories) {
        await prisma.category.create({ data: cat });
    }
    console.log(`✓ Created ${categories.length} categories`);

    // Get category map
    const categoryMap = {};
    const allCategories = await prisma.category.findMany();
    for (const cat of allCategories) {
        categoryMap[cat.name] = cat.id;
    }

    // Create places
    for (const place of places) {
        const { categoryName, ...placeData } = place;
        await prisma.place.create({
            data: {
                ...placeData,
                categoryId: categoryMap[categoryName]
            }
        });
    }
    console.log(`✓ Created ${places.length} places`);

    // Create demo user (with generic avatar - null means use default icon)
    const demoUser = await prisma.user.create({
        data: {
            email: 'demo@dalat.vibe',
            username: 'Traveler',
            passwordHash: await bcrypt.hash('password123', 10),
            avatar: null  // Use generic user icon
        }
    });
    console.log('✓ Created demo user');

    // Get place map
    const placeMap = {};
    const allPlaces = await prisma.place.findMany();
    for (const p of allPlaces) {
        placeMap[p.title] = p.id;
    }

    // Create sample reviews
    for (const review of sampleReviews) {
        const { placeTitle, ...reviewData } = review;
        if (placeMap[placeTitle]) {
            await prisma.review.create({
                data: {
                    ...reviewData,
                    tags: '[]',
                    userId: demoUser.id,
                    placeId: placeMap[placeTitle]
                }
            });
        }
    }
    console.log(`✓ Created ${sampleReviews.length} sample reviews`);

    // Update place ratings
    for (const place of allPlaces) {
        const reviews = await prisma.review.findMany({
            where: { placeId: place.id }
        });
        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            await prisma.place.update({
                where: { id: place.id },
                data: {
                    rating: Math.round(avgRating * 10) / 10,
                    reviewCount: reviews.length
                }
            });
        } else {
            // Set default rating for places without reviews
            await prisma.place.update({
                where: { id: place.id },
                data: {
                    rating: 4.5,
                    reviewCount: 0
                }
            });
        }
    }
    console.log('✓ Updated place ratings');

    console.log('🎉 Database seeded successfully!');
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${places.length} places`);
    console.log(`   - ${sampleReviews.length} reviews`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
