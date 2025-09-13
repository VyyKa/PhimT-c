import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      browse: 'Browse',
      favorites: 'My List',
      search: 'Search',
      profile: 'Profile',
      admin: 'Admin',
      logout: 'Sign Out',
      
      // Actions
      play: 'Play',
      info: 'More Info',
      addToList: 'Add to My List',
      removeFromList: 'Remove from My List',
      watchNow: 'Watch Now',
      back: 'Back',
      viewAll: 'View All',
      subtitlesAvailable: 'Available with subtitles and dubbing',
      
      // Categories
      netflixOriginals: 'Netflix Originals',
      trendingNow: 'Trending Now',
      actionAdventure: 'Action & Adventure',
      comedies: 'Comedies',
      horrorMovies: 'Horror Movies',
      romanticMovies: 'Romantic Movies',
      documentaries: 'Documentaries',
      
      // Pages
      searchPlaceholder: 'Search for movies, genres...',
      noResults: 'No results found',
      emptyFavorites: 'Your list is empty',
      addMoviesToList: 'Add movies to your list to watch later',
      
      // Movie details
      year: 'Year',
      duration: 'Duration',
      rating: 'Rating',
      genre: 'Genre',
      director: 'Director',
      cast: 'Cast',
      
      // Auth
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      
      // Common
      loading: 'Loading...',
      error: 'Something went wrong',
      tryAgain: 'Try Again',
      
      // Additional sections
      recentlyAdded: 'Recently Added',
      topRated: 'Top Rated',
      continueWatching: 'Continue Watching',
      
      // Footer
      websiteIntro: 'Experience unlimited entertainment',
      websiteDescription1: 'PhimTộc is Vietnam\'s leading online movie streaming platform, bringing you a diverse movie library from feature films, TV series, anime to high-quality TV shows.',
      websiteDescription2: 'With a friendly interface, fast loading speed, and HD video quality, we are committed to providing the best movie-watching experience for all users.',
      demoInfo: 'This is a student demo website - GitHub:',
      highQuality: 'High Quality',
      highQualityDesc: 'HD, 4K movies with vivid sound',
      fastLoading: 'Fast Loading',
      fastLoadingDesc: 'Smooth streaming speed, no lag',
      free: 'Free',
      freeDesc: 'Watch unlimited movies, completely free',
      categories: 'Categories',
      genres: 'Genres',
      support: 'Support',
      featureFilms: 'Feature Films',
      tvSeries: 'TV Series',
      anime: 'Anime',
      tvShows: 'TV Shows',
      action: 'Action',
      comedy: 'Comedy',
      horror: 'Horror',
      romance: 'Romance',
      helpCenter: 'Help Center',
      contact: 'Contact',
      reportBug: 'Report Bug',
      faq: 'FAQ',
      copyright: 'All rights reserved.',
      
      // Notifications
      newMovies: 'New Movies',
      systemNotification: 'System Notification',
      movieUpdate: 'Movie Update',
      newMovieAdded: 'New movie added',
      markAsRead: 'Mark as read',
      markAllAsRead: 'Mark all as read',
      
      // FAQ
      frequentlyAskedQuestions: 'Frequently Asked Questions',
      faqSubtitle: 'Find answers to common questions about PhimTộc',
      allCategories: 'All',
      general: 'General',
      technical: 'Technical',
      account: 'Account',
      supportCategory: 'Support',
      cantFindAnswer: 'Can\'t find the answer?',
      contactFacebook: 'Contact us via Facebook for direct support',
      contactFacebookButton: 'Contact Facebook',
      
      // FAQ Questions & Answers
      faq1q: 'How to watch movies on PhimTộc?',
      faq1a: 'You can watch movies by: 1) Search for movies through the search bar, 2) Browse by categories, 3) Click on movies to see details, 4) Press "Watch Now" button to start watching.',
      faq2q: 'Is PhimTộc free?',
      faq2a: 'Yes, PhimTộc is completely free. You can watch all movies without paying or registering an account.',
      faq3q: 'Why can\'t the video play?',
      faq3a: 'Video may not play due to: 1) Slow internet connection, 2) Old browser, 3) Movie has no source. Try refreshing the page or choose another movie.',
      faq4q: 'How to add movies to favorites?',
      faq4a: 'To add movies to favorites: 1) Login to your account, 2) Go to movie detail page, 3) Press the heart button to add to favorites.',
      faq5q: 'Can I watch movies on mobile?',
      faq5a: 'Yes, PhimTộc supports watching movies on all devices including phones, tablets, computers. The interface will automatically adjust to fit the screen.',
      faq6q: 'How to report bugs or give feedback?',
      faq6a: 'You can report bugs or give feedback through our Facebook at: https://www.facebook.com/phimtocc/ or contact directly through Facebook page.',
      faq7q: 'Does PhimTộc update new movies?',
      faq7a: 'Yes, we regularly update new movies. You can see new movie notifications in the top right corner of the website.',
      faq8q: 'Why can\'t I login?',
      faq8a: 'Login issues may be due to: 1) Wrong email/password, 2) Account not activated, 3) Connection error. Try resetting password or contact support.'
    }
  },
  vi: {
    translation: {
      // Navigation
      home: 'Trang chủ',
      browse: 'Duyệt phim',
      favorites: 'Yêu thích',
      search: 'Tìm kiếm',
      profile: 'Hồ sơ',
      admin: 'Quản trị',
      logout: 'Đăng xuất',
      
      // Actions
      play: 'Phát',
      info: 'Thông tin',
      addToList: 'Thêm vào danh sách',
      removeFromList: 'Xóa khỏi danh sách',
      watchNow: 'Xem ngay',
      back: 'Quay lại',
      viewAll: 'Xem tất cả',
      subtitlesAvailable: 'Có sẵn với phụ đề tiếng Việt và lồng tiếng',
      
      // Categories
      netflixOriginals: 'Netflix Originals',
      trendingNow: 'Thịnh hành',
      actionAdventure: 'Hành động & Phiêu lưu',
      comedies: 'Hài kịch',
      horrorMovies: 'Phim kinh dị',
      romanticMovies: 'Phim lãng mạn',
      documentaries: 'Phim tài liệu',
      
      // Pages
      searchPlaceholder: 'Tìm kiếm phim, thể loại...',
      noResults: 'Không tìm thấy kết quả',
      emptyFavorites: 'Danh sách trống',
      addMoviesToList: 'Thêm phim vào danh sách để xem sau',
      
      // Movie details
      year: 'Năm',
      duration: 'Thời lượng',
      rating: 'Đánh giá',
      genre: 'Thể loại',
      director: 'Đạo diễn',
      cast: 'Diễn viên',
      
      // Auth
      signIn: 'Đăng nhập',
      signUp: 'Đăng ký',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      fullName: 'Họ và tên',
      
      // Common
      loading: 'Đang tải...',
      error: 'Có lỗi xảy ra',
      tryAgain: 'Thử lại',
      
      // Additional sections
      recentlyAdded: 'Mới cập nhật',
      topRated: 'Đánh giá cao',
      continueWatching: 'Tiếp tục xem',
      
      // Footer
      websiteIntro: 'Trải nghiệm giải trí không giới hạn',
      websiteDescription1: 'PhimTộc là nền tảng xem phim trực tuyến hàng đầu Việt Nam, mang đến cho bạn kho tàng phim đa dạng từ phim lẻ, phim bộ, anime đến các chương trình truyền hình chất lượng cao.',
      websiteDescription2: 'Với giao diện thân thiện, tốc độ tải nhanh và chất lượng video HD, chúng tôi cam kết mang đến trải nghiệm xem phim tuyệt vời nhất cho mọi người dùng.',
      demoInfo: 'Đây là trang web demo của sinh viên - GitHub:',
      highQuality: 'Chất lượng cao',
      highQualityDesc: 'Phim HD, 4K với âm thanh sống động',
      fastLoading: 'Tải nhanh',
      fastLoadingDesc: 'Tốc độ streaming mượt mà, không lag',
      free: 'Miễn phí',
      freeDesc: 'Xem phim không giới hạn, hoàn toàn miễn phí',
      categories: 'Danh mục',
      genres: 'Thể loại',
      support: 'Hỗ trợ',
      featureFilms: 'Phim lẻ',
      tvSeries: 'Phim bộ',
      anime: 'Anime',
      tvShows: 'TV Shows',
      action: 'Hành động',
      comedy: 'Hài kịch',
      horror: 'Kinh dị',
      romance: 'Lãng mạn',
      helpCenter: 'Trung tâm trợ giúp',
      contact: 'Liên hệ',
      reportBug: 'Báo lỗi',
      faq: 'FAQ',
      copyright: 'Tất cả quyền được bảo lưu.',
      
      // Notifications
      newMovies: 'Phim mới',
      systemNotification: 'Thông báo hệ thống',
      movieUpdate: 'Cập nhật phim',
      newMovieAdded: 'Phim mới được thêm',
      markAsRead: 'Đánh dấu đã đọc',
      markAllAsRead: 'Đánh dấu tất cả đã đọc',
      
      // FAQ
      frequentlyAskedQuestions: 'Câu hỏi thường gặp',
      faqSubtitle: 'Tìm câu trả lời cho các thắc mắc phổ biến về PhimTộc',
      allCategories: 'Tất cả',
      general: 'Chung',
      technical: 'Kỹ thuật',
      account: 'Tài khoản',
      supportCategory: 'Hỗ trợ',
      cantFindAnswer: 'Không tìm thấy câu trả lời?',
      contactFacebook: 'Liên hệ với chúng tôi qua Facebook để được hỗ trợ trực tiếp',
      contactFacebookButton: 'Liên hệ Facebook',
      
      // FAQ Questions & Answers
      faq1q: 'Làm thế nào để xem phim trên PhimTộc?',
      faq1a: 'Bạn có thể xem phim bằng cách: 1) Tìm kiếm phim qua thanh tìm kiếm, 2) Duyệt theo danh mục, 3) Click vào phim để xem chi tiết, 4) Nhấn nút "Xem phim ngay" để bắt đầu xem.',
      faq2q: 'PhimTộc có miễn phí không?',
      faq2a: 'Có, PhimTộc hoàn toàn miễn phí. Bạn có thể xem tất cả các phim mà không cần trả phí hay đăng ký tài khoản.',
      faq3q: 'Tại sao video không phát được?',
      faq3a: 'Video có thể không phát do: 1) Kết nối internet chậm, 2) Trình duyệt cũ, 3) Phim chưa có nguồn phát. Hãy thử refresh trang hoặc chọn phim khác.',
      faq4q: 'Làm sao để thêm phim vào danh sách yêu thích?',
      faq4a: 'Để thêm phim vào danh sách yêu thích: 1) Đăng nhập tài khoản, 2) Vào trang chi tiết phim, 3) Nhấn nút trái tim để thêm vào yêu thích.',
      faq5q: 'Có thể xem phim trên điện thoại không?',
      faq5a: 'Có, PhimTộc hỗ trợ xem phim trên mọi thiết bị bao gồm điện thoại, tablet, máy tính. Giao diện sẽ tự động điều chỉnh cho phù hợp với màn hình.',
      faq6q: 'Làm thế nào để báo lỗi hoặc góp ý?',
      faq6a: 'Bạn có thể báo lỗi hoặc góp ý qua Facebook của chúng tôi tại: https://www.facebook.com/phimtocc/ hoặc liên hệ trực tiếp qua trang Facebook.',
      faq7q: 'PhimTộc có cập nhật phim mới không?',
      faq7a: 'Có, chúng tôi thường xuyên cập nhật phim mới. Bạn có thể xem thông báo phim mới ở góc trên bên phải của trang web.',
      faq8q: 'Tại sao tôi không thể đăng nhập?',
      faq8a: 'Vấn đề đăng nhập có thể do: 1) Sai email/mật khẩu, 2) Tài khoản chưa được kích hoạt, 3) Lỗi kết nối. Hãy thử reset mật khẩu hoặc liên hệ hỗ trợ.'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;