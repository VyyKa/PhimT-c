import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Heart, ArrowLeft, Star, Clock, Calendar, Users, User } from 'lucide-react';
// Load detail from KKPhim (phimapi.com)
import { phimapiService } from '../services/phimapiService';
import { Movie, Review } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useRecommendations } from '../hooks/useRecommendations';
import VideoPlayer from '../components/VideoPlayer';
// In future we can fetch real detail and episodes via phimapiService
import MovieRow from '../components/MovieRow';
import ReviewSystem from '../components/ReviewSystem';
import LazyImage from '../components/LazyImage';
import toast from 'react-hot-toast';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const recommendations = useRecommendations(
    user?.favoriteMovies || [],
    user?.watchHistory || [],
    movie?.id
  );
  // TasteDive removed

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      try {
        const detail = await phimapiService.getMovieDetail(id);
        const m = detail?.movie;
        if (!m) throw new Error('No movie');
        // Try to extract first available episode links
        const eps = (detail as any)?.episodes || [];
        let firstEmbed: string | undefined;
        let firstM3u8: string | undefined;
        if (Array.isArray(eps)) {
          // Prefer any m3u8 across all servers/episodes
          for (const server of eps) {
            const data = server?.server_data || [];
            for (const item of data) {
              if (!firstEmbed) firstEmbed = item?.link_embed || firstEmbed;
              if (item?.link_m3u8) {
                firstM3u8 = item.link_m3u8;
                break;
              }
            }
            if (firstM3u8) break;
          }
        }
        const mapped: Movie = {
          id: m.slug || m._id || id,
          title: m.name || m.origin_name || 'Không rõ',
          description: m.content || '',
          image: phimapiService.formatImage(m.poster_url || m.thumb_url),
          backdropImage: m.cover_url || m.thumb_url,
          year: String(m.year || ''),
          rating: '',
          duration: '',
          genre: (m.category || []).map((c: any) => c?.name || '').filter(Boolean),
          videoUrl: firstEmbed || '',
          category: (m.category && m.category[0]?.name) || 'Khác',
          imdbRating: undefined,
          cast: (m.actor || []).slice(0, 5),
          director: Array.isArray(m.director) ? m.director[0] : m.director
        };
        // attach hls url for player if available
        (mapped as any).hlsUrl = firstM3u8;
        if (!cancelled) {
          setMovie(mapped);
          const favorites = JSON.parse(localStorage.getItem('phimtoc_favorites') || '[]');
          setIsFavorite(favorites.includes(mapped.id));
          const movieReviews = JSON.parse(localStorage.getItem(`phimtoc_reviews_${mapped.id}`) || '[]');
          setReviews(movieReviews);
        }
      } catch (e) {
        if (!cancelled) navigate('/');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleAddReview = (newReview: Omit<Review, 'id' | 'createdAt'>) => {
    if (!movie) return;
    
    const review: Review = {
      ...newReview,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    
    // Save to localStorage
    localStorage.setItem(`phimtoc_reviews_${movie.id}`, JSON.stringify(updatedReviews));
  };

  const toggleFavorite = () => {
    if (!movie) return;
    
    const favorites = JSON.parse(localStorage.getItem('phimtoc_favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter((fav: string) => fav !== movie.id);
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } else {
      newFavorites = [...favorites, movie.id];
      toast.success('Đã thêm vào danh sách yêu thích');
    }
    
    localStorage.setItem('phimtoc_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Đang tải thông tin phim...</p>
        </motion.div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-4">Không tìm thấy phim</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white pt-24 md:pt-28">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-screen"
      >
        <div className="absolute inset-0">
          <LazyImage
            src={movie.backdropImage || movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={() => navigate(-1)}
          className="absolute top-24 left-4 md:left-16 z-20 bg-slate-900/60 hover:bg-slate-900/80 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        {/* Content */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 flex items-center h-full px-4 md:px-16"
        >
          <div className="max-w-4xl flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Large Poster */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex-shrink-0"
            >
              <LazyImage
                src={movie.image}
                alt={movie.title}
                className="w-64 md:w-80 h-96 md:h-[480px] object-cover rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Movie Info */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                {movie.title}
              </h1>
              
              {/* Movie Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-lg">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{movie.imdbRating || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-5 h-5" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5" />
                  <span>{movie.duration}</span>
                </div>
                <span className="bg-gray-700 px-3 py-1 rounded text-sm font-medium">
                  {movie.rating}
                </span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genre.map((genre, index) => (
                  <span key={index} className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-purple-400/20">
                    {genre}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-base md:text-lg mb-6 text-gray-200 leading-relaxed max-w-2xl">
                {movie.description}
              </p>
              
              {/* Cast & Director */}
              {(movie.cast || movie.director) && (
                <div className="mb-8 space-y-2">
                  {movie.director && (
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Đạo diễn:</span>
                      <span className="text-white">{movie.director}</span>
                    </div>
                  )}
                  {movie.cast && movie.cast.length > 0 && (
                    <div className="flex items-start space-x-2">
                      <Users className="w-4 h-4 text-gray-400 mt-1" />
                      <span className="text-gray-400">Diễn viên:</span>
                      <span className="text-white">{movie.cast.slice(0, 3).join(', ')}</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Trailer removed */}
                
                {/* Watch Full Movie Button - Open popup modal */}
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if ((movie as any).hlsUrl) {
                      navigate(`/watch/${movie.id}`);
                    } else {
                      setIsPlaying(true);
                    }
                  }}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg group whitespace-nowrap"
                >
                  <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Xem phim ngay</span>
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFavorite}
                  className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm whitespace-nowrap ${
                    isFavorite 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
                      : 'bg-slate-700/80 text-white hover:bg-slate-600/80 border border-purple-500/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="text-sm">{isFavorite ? 'Đã yêu thích' : 'Yêu thích'}</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Video Player Modal */}
      <VideoPlayer
        videoUrl={movie.videoUrl}
        title={movie.title}
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
        isYouTubeTrailer={false}
        driveUrl={movie.videoUrl}
        hlsUrl={(movie as any).hlsUrl || undefined}
      />

      {/* Trailer section removed */}

      {/* Review System */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="px-4 md:px-16 py-12"
      >
        <div className="max-w-6xl mx-auto">
          <ReviewSystem
            movieId={movie.id}
            reviews={reviews}
            onAddReview={handleAddReview}
          />
        </div>
      </motion.div>

      {/* TasteDive Recommendations removed */}

      {/* Local Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="pb-20"
        >
          <MovieRow
            title="Phim đề xuất cho bạn"
            movies={recommendations}
          />
        </motion.div>
      )}
    </div>
  );
};

export default MovieDetailPage;