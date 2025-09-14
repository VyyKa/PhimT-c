import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  isLarge?: boolean;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, movies, isLarge = false }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.75;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);
      
      container.scrollTo({ 
        left: newPosition, 
        behavior: 'smooth' 
      });
      setScrollPosition(newPosition);
      
      // Update arrow visibility
      setTimeout(() => {
        setShowLeftArrow(newPosition > 0);
        setShowRightArrow(newPosition < container.scrollWidth - container.clientWidth - 10);
      }, 300);
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const currentScroll = container.scrollLeft;
      setScrollPosition(currentScroll);
      setShowLeftArrow(currentScroll > 0);
      setShowRightArrow(currentScroll < container.scrollWidth - container.clientWidth - 10);
    }
  };

  const handleViewAll = () => {
    // Map title to appropriate browse category
    let category = '';
    if (title.includes('Phim lẻ') || title.includes('topRated')) {
      category = 'phim-le';
    } else if (title.includes('Phim bộ') || title.includes('trendingNow')) {
      category = 'phim-bo';
    } else if (title.includes('Anime')) {
      category = 'hoat-hinh';
    } else if (title.includes('TV Shows')) {
      category = 'tv-shows';
    }
    
    // Navigate to browse page with category filter
    navigate(`/browse${category ? `?category=${category}` : ''}`);
  };

  if (movies.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-16 mb-8 xs:mb-10 sm:mb-12 safe-area-left safe-area-right"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-between mb-4 xs:mb-5 sm:mb-6"
      >
        <div className="flex items-center space-x-3">
          <h2 className="text-lg xs:text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
            {title}
          </h2>
        </div>
        
        {/* View All Link */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleViewAll}
          className="text-xs xs:text-sm text-gray-400 hover:text-purple-400 transition-colors font-medium cursor-pointer touch-button"
        >
          {t('viewAll')} →
        </motion.button>
      </motion.div>
      
      <div className="relative group px-2 xs:px-4 sm:px-6 md:px-12">
        {/* Left Arrow - Enhanced 3D Effect */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              whileHover={{ 
                scale: 1.15, 
                rotateY: -15,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.3)"
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              className="absolute -left-1 xs:-left-2 md:-left-6 top-1/2 transform -translate-y-1/2 z-30 w-8 h-8 xs:w-10 xs:h-10 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl opacity-90 hover:opacity-100 border-2 border-white/30 hover:border-white/60 touch-button perspective-1000"
              style={{ 
                transformStyle: 'preserve-3d',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)'
              }}
            >
              <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5 md:w-7 md:h-7" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Right Arrow - Enhanced 3D Effect */}
        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              whileHover={{ 
                scale: 1.15, 
                rotateY: 15,
                boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.3)"
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              className="absolute -right-1 xs:-right-2 md:-right-6 top-1/2 transform -translate-y-1/2 z-30 w-8 h-8 xs:w-10 xs:h-10 md:w-14 md:h-14 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl opacity-90 hover:opacity-100 border-2 border-white/30 hover:border-white/60 touch-button perspective-1000"
              style={{ 
                transformStyle: 'preserve-3d',
                boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)'
              }}
            >
              <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5 md:w-7 md:h-7" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Movies Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex space-x-2 xs:space-x-3 sm:space-x-3 md:space-x-4 lg:space-x-6 overflow-x-auto scroll-smooth hide-scrollbar scroll-snap-x pb-3 xs:pb-4 px-0.5 xs:px-1 md:px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <MovieCard
                movie={movie}
                size={isLarge ? 'large' : 'medium'}
              />
            </motion.div>
          ))}
        </div>

        {/* Small Scroll Indicators */}
        <div className="flex justify-center mt-3 xs:mt-4 space-x-1.5">
          {Array.from({ length: Math.ceil(movies.length / 6) }).map((_, index) => {
            const container = containerRef.current;
            if (!container) return null;
            
            const scrollWidth = container.scrollWidth - container.clientWidth;
            const currentPage = scrollWidth > 0 ? Math.round((scrollPosition / scrollWidth) * (Math.ceil(movies.length / 6) - 1)) : 0;
            
            const handleDotClick = () => {
              const targetPosition = (scrollWidth / (Math.ceil(movies.length / 6) - 1)) * index;
              container.scrollTo({ 
                left: targetPosition, 
                behavior: 'smooth' 
              });
              setScrollPosition(targetPosition);
            };
            
            return (
              <motion.button
                key={index}
                onClick={handleDotClick}
                whileHover={{ 
                  scale: 1.2, 
                  rotateZ: 90,
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.9 }}
                className={`rounded-full transition-all duration-300 touch-button ${
                  currentPage === index
                    ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 scale-110 shadow-md shadow-purple-500/30'
                    : 'bg-gray-600/40 hover:bg-gray-500/60'
                }`}
                style={{
                  width: '6px',
                  height: '6px',
                  minWidth: '6px',
                  minHeight: '6px',
                  boxShadow: currentPage === index 
                    ? '0 0 8px rgba(59, 130, 246, 0.3), 0 0 16px rgba(139, 92, 246, 0.2)' 
                    : 'none'
                }}
              />
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieRow;