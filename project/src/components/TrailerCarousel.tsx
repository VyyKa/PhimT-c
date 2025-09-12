import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface TrailerItem {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
  thumbnail: string;
}

const trailerData: TrailerItem[] = [
  {
    id: '1',
    title: 'PHIM ĐIỆN ẢNH THÁM TỬ LỪNG DANH CONAN: DƯ ẢNH CỦA ĐỘC NHÃN',
    youtubeId: 'qW3_w8zQqQs',
    description: 'Trailer chính thức chất lượng cao - Mở đầu carousel',
    thumbnail: 'https://i.ytimg.com/vi/qW3_w8zQqQs/maxresdefault.jpg'
  },
  {
    id: '2',
    title: 'Thám Tử Lừng Danh Conan: Dư Ảnh Của Độc Nhãn | Official Trailer',
    youtubeId: 'kH8G0ceFJQs',
    description: 'Bản phụ trợ với chuyển cảnh mượt mà',
    thumbnail: 'https://i.ytimg.com/vi/kH8G0ceFJQs/maxresdefault.jpg'
  },
  {
    id: '3',
    title: 'PHIM ĐIỆN ẢNH THÁM TỬ LỪNG DANH CONAN: NGÔI SAO 5 CÁNH 1 TRIỆU ĐÔ',
    youtubeId: 'mH8G1ceFJQs',
    description: 'Trailer cho Movie "Ngôi Sao 5 Cánh 1 Triệu Đô"',
    thumbnail: 'https://i.ytimg.com/vi/mH8G1ceFJQs/maxresdefault.jpg'
  },
  {
    id: '4',
    title: 'Detective Conan: Phân Tích Trailer Conan Movie 28',
    youtubeId: 'nH9G2ceFJQs',
    description: 'Video phân tích tạo chiều sâu cho carousel',
    thumbnail: 'https://i.ytimg.com/vi/nH9G2ceFJQs/maxresdefault.jpg'
  },
  {
    id: '5',
    title: '[Official Trailer] Thám Tử Lừng Danh Conan - Movie #28',
    youtubeId: 'pH0G3ceFJQs',
    description: 'Trailer chính thức kết thúc carousel mạnh mẽ',
    thumbnail: 'https://i.ytimg.com/vi/pH0G3ceFJQs/maxresdefault.jpg'
  }
];

const TrailerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === trailerData.length - 1 ? 0 : prevIndex + 1
        );
      }, 7000); // 7 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isHovered]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? trailerData.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === trailerData.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentTrailer = trailerData[currentIndex];

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden bg-black">
      {/* Main Trailer Display */}
      <div 
        className="relative w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* YouTube Embed */}
            <iframe
              src={`https://www.youtube.com/embed/${currentTrailer.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${currentTrailer.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0&end=30`}
              title={currentTrailer.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Trailer Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm mb-4 border border-red-500/30">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span>🎬 Trailer Nổi Bật</span>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {currentTrailer.title}
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 mb-6 max-w-2xl">
              {currentTrailer.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:bg-gray-200"
              >
                <Play className="w-5 h-5" />
                <span>Xem trailer</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-gray-600/80 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:bg-gray-500/80"
              >
                <span>Thông tin</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToPrevious}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={goToNext}
            className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Play/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlayPause}
          className="absolute top-8 right-8 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm z-20"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Bottom Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {trailerData.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800/50 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-red-500 to-purple-500"
          initial={{ width: "0%" }}
          animate={{ width: isPlaying && !isHovered ? "100%" : "0%" }}
          transition={{ duration: 7, ease: "linear" }}
          key={currentIndex}
        />
      </div>
    </div>
  );
};

export default TrailerCarousel;
