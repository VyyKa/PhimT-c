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
      continueWatching: 'Continue Watching'
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
      continueWatching: 'Tiếp tục xem'
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