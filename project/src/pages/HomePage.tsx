import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { Movie } from '../types';
import { phimapiService } from '../services/phimapiService';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const [sections, setSections] = useState<{
    title: string;
    movies: Movie[];
  }[]>([]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    let cancelled = false;
    (async () => {
      try {
        const [phimLe, phimBo, hoatHinh, tvShows] = await Promise.all([
          phimapiService.getList('phim-le', { page: 1, limit: 18, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('phim-bo', { page: 1, limit: 18, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('hoat-hinh', { page: 1, limit: 18, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('tv-shows', { page: 1, limit: 18, sort_field: 'modified.time', sort_type: 'desc' })
        ]);

        const mapItems = (items: any[]): Movie[] =>
          (items || []).map((it: any) => ({
            id: it.slug || it._id,
            title: it.name,
            description: '',
            image: phimapiService.formatImage(it.poster_url || it.thumb_url),
            backdropImage: it.thumb_url || undefined,
            year: String(it.year || ''),
            rating: '',
            duration: '',
            genre: (it.category || []).map((c: any) => c?.name || '').filter(Boolean),
            videoUrl: '',
            category: (it.category && it.category[0]?.name) || 'Khác',
            imdbRating: it.tmdb?.vote_average ? parseFloat(it.tmdb.vote_average) : undefined
          }));

        const newSections = [
          { title: `${t('topRated') || 'Phim lẻ'}`, movies: mapItems(phimLe.data?.items || []) },
          { title: `${t('trendingNow') || 'Phim bộ'}`, movies: mapItems(phimBo.data?.items || []) },
          { title: `Anime`, movies: mapItems(hoatHinh.data?.items || []) },
          { title: `TV Shows`, movies: mapItems(tvShows.data?.items || []) }
        ];

        if (!cancelled) setSections(newSections);
      } catch (e) {
        if (!cancelled) setSections([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden safe-area-top"
    >
      {/* Hero Section */}
      <motion.div variants={sectionVariants}>
        <Hero />
      </motion.div>

      {/* API sections */}
      
      {/* Movie Sections */}
      <motion.div 
        variants={sectionVariants}
        className="pb-16 xs:pb-20 -mt-24 xs:-mt-28 sm:-mt-32 relative z-10"
      >
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-purple-500/5 rounded-full blur-2xl"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
            >
              <MovieRow
                title={section.title}
                movies={section.movies}
                isLarge={index === 0}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional curated rows can be added using phimapiService if needed */}
      </motion.div>

      {/* Footer Section moved to global layout */}
    </motion.div>
  );
};

export default HomePage;