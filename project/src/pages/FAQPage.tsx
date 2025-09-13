import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft, HelpCircle, MessageCircle, Mail, Bug } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "Làm thế nào để xem phim trên PhimTộc?",
      answer: "Bạn có thể xem phim bằng cách: 1) Tìm kiếm phim qua thanh tìm kiếm, 2) Duyệt theo danh mục, 3) Click vào phim để xem chi tiết, 4) Nhấn nút 'Xem phim ngay' để bắt đầu xem.",
      category: "general"
    },
    {
      id: 2,
      question: "PhimTộc có miễn phí không?",
      answer: "Có, PhimTộc hoàn toàn miễn phí. Bạn có thể xem tất cả các phim mà không cần trả phí hay đăng ký tài khoản.",
      category: "general"
    },
    {
      id: 3,
      question: "Tại sao video không phát được?",
      answer: "Video có thể không phát do: 1) Kết nối internet chậm, 2) Trình duyệt cũ, 3) Phim chưa có nguồn phát. Hãy thử refresh trang hoặc chọn phim khác.",
      category: "technical"
    },
    {
      id: 4,
      question: "Làm sao để thêm phim vào danh sách yêu thích?",
      answer: "Để thêm phim vào danh sách yêu thích: 1) Đăng nhập tài khoản, 2) Vào trang chi tiết phim, 3) Nhấn nút trái tim để thêm vào yêu thích.",
      category: "account"
    },
    {
      id: 5,
      question: "Có thể xem phim trên điện thoại không?",
      answer: "Có, PhimTộc hỗ trợ xem phim trên mọi thiết bị bao gồm điện thoại, tablet, máy tính. Giao diện sẽ tự động điều chỉnh cho phù hợp với màn hình.",
      category: "technical"
    },
    {
      id: 6,
      question: "Làm thế nào để báo lỗi hoặc góp ý?",
      answer: "Bạn có thể báo lỗi hoặc góp ý qua Facebook của chúng tôi tại: https://www.facebook.com/phimtocc/ hoặc liên hệ trực tiếp qua trang Facebook.",
      category: "support"
    },
    {
      id: 7,
      question: "PhimTộc có cập nhật phim mới không?",
      answer: "Có, chúng tôi thường xuyên cập nhật phim mới. Bạn có thể xem thông báo phim mới ở góc trên bên phải của trang web.",
      category: "general"
    },
    {
      id: 8,
      question: "Tại sao tôi không thể đăng nhập?",
      answer: "Vấn đề đăng nhập có thể do: 1) Sai email/mật khẩu, 2) Tài khoản chưa được kích hoạt, 3) Lỗi kết nối. Hãy thử reset mật khẩu hoặc liên hệ hỗ trợ.",
      category: "account"
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', icon: HelpCircle },
    { id: 'general', name: 'Chung', icon: MessageCircle },
    { id: 'technical', name: 'Kỹ thuật', icon: Bug },
    { id: 'account', name: 'Tài khoản', icon: Mail },
    { id: 'support', name: 'Hỗ trợ', icon: HelpCircle }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 pt-24 md:pt-28">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors duration-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Câu hỏi thường gặp
          </h1>
          <p className="text-gray-400 text-lg">
            Tìm câu trả lời cho các thắc mắc phổ biến về PhimTộc
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-300"
              >
                <span className="text-white font-medium pr-4">{item.question}</span>
                {openItems.includes(item.id) ? (
                  <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-purple-400 flex-shrink-0" />
                )}
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-8 border border-blue-500/30">
            <h3 className="text-xl font-semibold text-white mb-4">
              Không tìm thấy câu trả lời?
            </h3>
            <p className="text-gray-400 mb-6">
              Liên hệ với chúng tôi qua Facebook để được hỗ trợ trực tiếp
            </p>
            <a
              href="https://www.facebook.com/phimtocc/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Liên hệ Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
