import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { phimapiService } from '../services/phimapiService';
import LazyImage from './LazyImage';

const Hero: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useTranslation();

  // Lấy phim lẻ mới cập nhật từ API
  useEffect(() => {
    let cancelled = false;
    
    const fetchRecentMovies = async () => {
      try {
        const transformMovie = (it: any) => ({
          id: it.slug || it._id,
          title: it.name || it.origin_name || '',
          description: it.origin_name || it.content || '',
          image: phimapiService.formatImage(it.poster_url || it.thumb_url),
          backdropImage: phimapiService.formatImage(it.thumb_url || it.poster_url),
          year: it.year || '',
          duration: it.time || '',
          rating: it.quality || '',
          imdbRating: it.tmdb?.vote_average ? parseFloat(it.tmdb.vote_average) : undefined,
          genre: (it.category || []).map((c: any) => c?.name || ''),
          category: (it.category && it.category[0]?.name) || 'Khác'
        });

        // Lấy phim lẻ mới cập nhật
        const recentMovies = await phimapiService.getList('phim-le', { 
          page: 1, 
          limit: 4, 
          sort_field: 'modified.time', 
          sort_type: 'desc' 
        });
        
        const foundMovies = (recentMovies.data?.items || []).map(transformMovie);

        if (!cancelled && foundMovies.length > 0) {
          setFeaturedMovies(foundMovies);
        }
      } catch (error) {
        console.error('Lỗi khi lấy phim:', error);
      }
    };

    fetchRecentMovies();
    
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-rotate movies every 8 seconds
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const currentMovie = featuredMovies[currentIndex];

  // If not ready, just render the background gradient area to avoid empty texts
  if (!currentMovie) {
    return (
      <div className="relative h-screen flex items-center justify-start overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
      </div>
    );
  }

  return (
    <div className="relative h-screen flex items-center justify-start overflow-hidden">
      {/* Background with Parallax Effect */}
      <motion.div 
        key={currentMovie.id}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={currentMovie.backdropImage || currentMovie.image}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        {/* Enhanced Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20" />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl float-animation"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full blur-2xl float-animation" style={{ animationDelay: '1s' }}></div>

      {/* Content */}
      <div className="relative z-10 px-4 xs:px-5 sm:px-6 md:px-8 lg:px-16 w-full safe-area-left safe-area-right">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-4 xs:gap-5 sm:gap-6 lg:gap-6 xl:gap-8">
          {/* Left Content */}
          <div className="flex-1 max-w-4xl w-full order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
          {/* Category Badge */}
          <motion.div
            key={`badge-${currentMovie.id}`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-3 xs:mb-4"
          >
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-sm font-medium text-purple-300">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-2 animate-pulse"></span>
              {currentMovie?.category || 'Châu Âu'}
            </span>
          </motion.div>

          {/* Title with Neon Effect */}
          <motion.h1 
            key={`title-${currentMovie.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-2 xs:mb-3 sm:mb-4 md:mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent neon-text">
              {currentMovie?.title || ''}
            </span>
          </motion.h1>

          {/* Movie Info */}
          <motion.div
            key={`info-${currentMovie.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-5 md:mb-6 text-xs xs:text-sm text-gray-300"
          >
            <span className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span className="font-semibold">
                {currentMovie?.imdbRating ? parseFloat(currentMovie.imdbRating).toFixed(1) : 'N/A'}
              </span>
            </span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span>{currentMovie?.year || ''}</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span>{currentMovie?.duration || ''}</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className="px-2 py-1 bg-gray-700/50 rounded text-xs">{currentMovie?.rating || ''}</span>
          </motion.div>

          {/* Genres */}
          <motion.div
            key={`genres-${currentMovie.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-1.5 xs:gap-2 mb-3 xs:mb-4 sm:mb-5 md:mb-6"
          >
            {(currentMovie?.genre || []).slice(0, 3).map((genre: string, index: number) => (
              <span 
                key={index}
                className="px-2 xs:px-3 py-0.5 xs:py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/20 rounded-full text-xs font-medium text-purple-200"
              >
                {genre}
              </span>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p 
            key={`desc-${currentMovie.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl mb-3 xs:mb-4 sm:mb-5 md:mb-8 text-gray-200 leading-relaxed max-w-2xl line-clamp-2 xs:line-clamp-3 md:line-clamp-none"
          >
            {currentMovie?.description || ''}
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link 
                to={currentMovie ? `/movie/${currentMovie.id}` : '#'}
                className="relative btn-primary flex items-center justify-center space-x-1 xs:space-x-2 md:space-x-3 px-4 xs:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 text-white font-semibold shadow-2xl group text-xs xs:text-sm md:text-base touch-button overflow-hidden rounded-lg"
              >
                {/* Animated gradient background */}
                <div 
                  className="absolute inset-0 animate-gradient rounded-lg"
                  style={{
                    background: 'linear-gradient(90deg, #2563eb, #7c3aed, #ec4899, #7c3aed, #2563eb)',
                  }}
                ></div>
                
                {/* Glow effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm rounded-lg"></div>
                
                {/* Button content */}
                <div className="relative z-10 flex items-center space-x-1 xs:space-x-2 md:space-x-3">
                  <Play className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">{t('play')}</span>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-lg"></div>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link 
                to={currentMovie ? `/movie/${currentMovie.id}` : '#'}
                className="relative btn-secondary flex items-center justify-center space-x-1 xs:space-x-2 md:space-x-3 px-4 xs:px-6 md:px-8 py-2.5 xs:py-3 md:py-4 text-white font-semibold group text-xs xs:text-sm md:text-base touch-button overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300 rounded-lg"
              >
                {/* Glow effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/50 via-slate-500/50 to-slate-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm rounded-lg"></div>
                
                {/* Button content */}
                <div className="relative z-10 flex items-center space-x-1 xs:space-x-2 md:space-x-3">
                  <Info className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                  <span className="font-bold">{t('info')}</span>
                </div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-lg"></div>
              </Link>
            </motion.div>

          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-8 text-sm text-gray-400"
          >
            <p>{t('subtitlesAvailable')}</p>
          </motion.div>
        </motion.div>
          </div>

          {/* Right Poster - HZPhim Style */}
          <motion.div
            key={`poster-${currentMovie.id}`}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-end order-1 lg:order-2 mb-4 xs:mb-5 lg:mb-0"
          >
            <Link
              to={currentMovie ? `/movie/${currentMovie.id}` : '#'}
              className="group relative block"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Poster Image */}
                <div className="relative w-32 xs:w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 aspect-[2/3] rounded-lg xs:rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 group-hover:border-purple-500/50 transition-all duration-300">
                  <LazyImage
                    src={currentMovie.image}
                    alt={currentMovie.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 transition-all duration-300 blur-xl"></div>
                  
                  {/* Play Icon Overlay on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30"
                    >
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient with enhanced effect */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
      
      {/* Side fade effects */}
      <div className="absolute top-0 bottom-0 right-0 w-40 bg-gradient-to-l from-slate-900/50 to-transparent" />

      {/* Carousel Indicators - Small and positioned in top right */}
      {featuredMovies.length > 1 && (
        <div className="absolute top-16 xs:top-20 md:top-32 right-3 xs:right-4 md:right-8 flex flex-col space-y-1 xs:space-y-1.5">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`rounded-lg transition-all duration-300 touch-button bg-transparent hover:bg-white/60 border border-white/20 hover:border-white/40 ${
                index === currentIndex 
                  ? 'scale-110' 
                  : ''
              }`}
              style={{
                width: '6px',
                height: '20px',
                minWidth: '6px',
                minHeight: '20px'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;