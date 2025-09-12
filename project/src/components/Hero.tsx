import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getFeaturedMovie } from '../data/movies';

const Hero: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const featuredMovie = getFeaturedMovie();
  const { t } = useTranslation();

  return (
    <div className="relative h-screen flex items-center justify-start overflow-hidden">
      {/* Background with Parallax Effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src={featuredMovie.backdropImage || featuredMovie.image}
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
      <div className="relative z-10 px-4 md:px-8 lg:px-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-4"
          >
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-sm font-medium text-purple-300">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-2 animate-pulse"></span>
              {featuredMovie.category}
            </span>
          </motion.div>

          {/* Title with Neon Effect */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent neon-text">
              {featuredMovie.title}
            </span>
          </motion.h1>

          {/* Movie Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center space-x-4 mb-6 text-sm text-gray-300"
          >
            <span className="flex items-center space-x-1">
              <span className="text-yellow-400">⭐</span>
              <span className="font-semibold">{featuredMovie.imdbRating || 'N/A'}</span>
            </span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span>{featuredMovie.year}</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span>{featuredMovie.duration}</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
            <span className="px-2 py-1 bg-gray-700/50 rounded text-xs">{featuredMovie.rating}</span>
          </motion.div>

          {/* Genres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {featuredMovie.genre.slice(0, 3).map((genre, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/20 rounded-full text-xs font-medium text-purple-200"
              >
                {genre}
              </span>
            ))}
          </motion.div>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed max-w-2xl line-clamp-3"
          >
            {featuredMovie.description}
          </motion.p>
          
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={`/movie/${featuredMovie.id}`}
                className="btn-primary flex items-center justify-center space-x-3 px-8 py-4 text-white font-semibold shadow-2xl group"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{t('play')}</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to={`/movie/${featuredMovie.id}`}
                className="btn-secondary flex items-center justify-center space-x-3 px-8 py-4 text-white font-semibold group"
              >
                <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{t('info')}</span>
              </Link>
            </motion.div>

            {/* Volume Control */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMuted(!isMuted)}
              className="hidden sm:flex items-center justify-center w-12 h-12 glass-morphism-light rounded-full text-white hover:bg-white/10 transition-all duration-300 group"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
              ) : (
                <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              )}
            </motion.button>
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

      {/* Bottom gradient with enhanced effect */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
      
      {/* Side fade effects */}
      <div className="absolute top-0 bottom-0 right-0 w-40 bg-gradient-to-l from-slate-900/50 to-transparent" />
    </div>
  );
};

export default Hero;