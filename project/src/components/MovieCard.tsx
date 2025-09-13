import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Play, Plus, Heart, Info, Star, Clock, Calendar } from 'lucide-react';
import { Movie } from '../types';
import LazyImage from './LazyImage';
import toast from 'react-hot-toast';

interface MovieCardProps {
  movie: Movie;
  size?: 'small' | 'medium' | 'large';
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, size = 'medium' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Check if movie is in favorites on component mount
  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('phimtoc_favorites') || '[]');
    setIsFavorite(favorites.includes(movie.id));
  }, [movie.id]);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to movie detail page
    navigate(`/movie/${movie.id}`);
    
    // Scroll to video section after navigation
    setTimeout(() => {
      const videoSection = document.getElementById('movie-video-section');
      if (videoSection) {
        videoSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favorites = JSON.parse(localStorage.getItem('phimtoc_favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      // Remove from favorites
      newFavorites = favorites.filter((fav: string) => fav !== movie.id);
      setIsFavorite(false);
      toast.success('Đã xóa khỏi danh sách yêu thích', {
        icon: '💔',
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #1e293b, #3730a3)',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
        },
      });
    } else {
      // Add to favorites
      newFavorites = [...favorites, movie.id];
      setIsFavorite(true);
      toast.success('Đã thêm vào danh sách yêu thích', {
        icon: '❤️',
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #1e293b, #7c3aed)',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
        },
      });
    }
    
    localStorage.setItem('phimtoc_favorites', JSON.stringify(newFavorites));
    
    // Trigger storage event for other components to update
    window.dispatchEvent(new Event('storage'));
  };

  const sizeClasses = {
    small: 'w-28 sm:w-32 md:w-40',
    medium: 'w-36 sm:w-40 md:w-48',
    large: 'w-44 sm:w-48 md:w-64'
  };

  const heightClasses = {
    small: 'h-42 sm:h-48 md:h-60',
    medium: 'h-54 sm:h-60 md:h-72',
    large: 'h-66 sm:h-72 md:h-96'
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative flex-none cursor-pointer movie-card-hover scroll-snap-start ${sizeClasses[size]} ${
        isHovered ? 'z-30' : 'z-10'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${movie.id}`} className="block w-full h-full group">
        <motion.div 
          className="relative overflow-hidden rounded-2xl w-full h-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <LazyImage
            src={movie.image}
            alt={movie.title}
            className={`w-full object-cover transition-all duration-500 ${heightClasses[size]} ${
              isHovered ? 'scale-110 brightness-75' : 'brightness-90'
            }`}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
          
          {/* Rating Badge */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-20">
            <div className="flex items-center space-x-1 px-1.5 md:px-2 py-0.5 md:py-1 glass-morphism rounded-lg">
              <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-semibold">
                {movie.imdbRating || 'N/A'}
              </span>
            </div>
          </div>

          {/* Favorite Button - Always Visible */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 md:top-3 md:right-3 z-20 p-1.5 md:p-2 rounded-xl transition-all duration-300 ${
              isFavorite 
                ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg' 
                : 'glass-morphism text-gray-300 hover:text-white'
            }`}
          >
            <Heart className={`w-3 h-3 md:w-4 md:h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
          
          {/* Hover Overlay - Khít với poster */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 flex flex-col justify-between p-4"
              >
                {/* Top Section - Quick Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-1 md:space-x-2 text-xs text-gray-300">
                    <Calendar className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    <span>{movie.year}</span>
                    <span>•</span>
                    <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                    <span>{movie.duration}</span>
                  </div>
                </div>

                {/* Center Section - Title & Info */}
                <div className="flex-1 flex flex-col justify-center space-y-2 md:space-y-3">
                  <h3 className="text-white font-bold text-xs sm:text-sm md:text-base leading-tight line-clamp-2">
                    {movie.title}
                  </h3>

                  {/* Genres - Compact Pills */}
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.slice(0, 2).map((genre, index) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gradient-to-r from-blue-600/30 to-purple-600/30 text-blue-200 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border border-purple-400/20 backdrop-blur-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  {/* Description Preview */}
                  <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 hidden sm:block">
                    {movie.description}
                  </p>
                </div>

                {/* Bottom Section - Action Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-1.5 md:space-x-2">
                    {/* Play Button */}
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayClick}
                      className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-white to-gray-100 text-black rounded-xl hover:from-gray-100 hover:to-white transition-all duration-200 shadow-lg group"
                      title="Phát ngay"
                    >
                      <Play className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                    </motion.button>

                    {/* Add to List Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 glass-morphism text-white rounded-xl hover:bg-white/10 transition-all duration-200 group"
                      title="Thêm vào danh sách"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                    </motion.button>
                  </div>

                  {/* More Info Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-xl text-xs font-medium transition-all duration-200 shadow-lg group relative"
                  >
                    <Info className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover:scale-110 transition-transform" />
                    <span className="hidden md:inline">{t('info')}</span>
                    {/* Auto-trailer indicator */}
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle Border Glow */}
          <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
            isHovered 
              ? 'ring-2 ring-purple-500/50 shadow-2xl shadow-purple-500/20' 
              : 'ring-1 ring-white/10'
          }`} />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;