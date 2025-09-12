import React from 'react';

const ReactFooter: React.FC = () => {
  return (
    <footer className="px-4 md:px-16 py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            PhimTộc
          </h2>
          <p className="text-gray-400 text-lg">Trải nghiệm giải trí không giới hạn</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-white font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Phim lẻ</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Phim bộ</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Anime</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">TV Shows</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Thể loại</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Hành động</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Hài kịch</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Kinh dị</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Lãng mạn</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Báo lỗi</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Kết nối</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>&copy; 2024 PhimTộc. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default ReactFooter;


