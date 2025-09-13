import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, HelpCircle, Mail, Bug, MessageCircle, Star, Zap, Heart } from 'lucide-react';

const ReactFooter: React.FC = () => {
  return (
    <footer className="px-4 md:px-16 py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            PhimTộc
          </h2>
          <p className="text-gray-400 text-lg mb-6">Trải nghiệm giải trí không giới hạn</p>
          
          {/* Giới thiệu website */}
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
              PhimTộc là nền tảng xem phim trực tuyến hàng đầu Việt Nam, mang đến cho bạn kho tàng phim đa dạng 
              từ phim lẻ, phim bộ, anime đến các chương trình truyền hình chất lượng cao.
            </p>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4">
              Với giao diện thân thiện, tốc độ tải nhanh và chất lượng video HD, chúng tôi cam kết mang đến 
              trải nghiệm xem phim tuyệt vời nhất cho mọi người dùng.
            </p>
            
            {/* Thông tin demo */}
            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm italic">
                Đây là trang web demo của sinh viên - GitHub: 
                <a 
                  href="https://github.com/vyyka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300 ml-1 underline"
                >
                  @vyyka
                </a>
              </p>
            </div>
            
            {/* Tính năng nổi bật */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8">
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Chất lượng cao</h4>
                <p className="text-gray-400 text-sm">Phim HD, 4K với âm thanh sống động</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Tải nhanh</h4>
                <p className="text-gray-400 text-sm">Tốc độ streaming mượt mà, không lag</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20">
                <div className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500 mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Miễn phí</h4>
                <p className="text-gray-400 text-sm">Xem phim không giới hạn, hoàn toàn miễn phí</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center md:text-left">
          {/* Danh mục */}
          <div>
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-base md:text-lg">Danh mục</h3>
            <ul className="space-y-2 md:space-y-3 text-gray-400">
              <li>
                <Link 
                  to="/browse?category=phim-le" 
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group text-sm md:text-base"
                >
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Phim lẻ
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=phim-bo" 
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Phim bộ
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=hoat-hinh" 
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Anime
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=tv-shows" 
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  TV Shows
                </Link>
              </li>
            </ul>
          </div>

          {/* Thể loại */}
          <div>
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-base md:text-lg">Thể loại</h3>
            <ul className="space-y-2 md:space-y-3 text-gray-400">
              <li>
                <Link 
                  to="/browse?category=hanh-dong" 
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Hành động
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=hai-kich" 
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Hài kịch
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=kinh-di" 
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Kinh dị
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=lang-man" 
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Lãng mạn
                </Link>
              </li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-white font-semibold mb-3 md:mb-4 text-base md:text-lg">Hỗ trợ</h3>
            <ul className="space-y-2 md:space-y-3 text-gray-400">
              <li>
                <a 
                  href="https://www.facebook.com/phimtocc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <HelpCircle className="w-4 h-4 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/phimtocc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <Mail className="w-4 h-4 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Liên hệ
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/phimtocc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <Bug className="w-4 h-4 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Báo lỗi
                </a>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="hover:text-purple-400 transition-colors duration-300 flex items-center group"
                >
                  <MessageCircle className="w-4 h-4 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-gray-500">
          <p className="text-sm md:text-base">&copy; 2025 PhimTộc. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default ReactFooter;


