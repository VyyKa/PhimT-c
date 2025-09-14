import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Movie } from '../types';
import { phimapiService } from '../services/phimapiService';
import MovieCard from '../components/MovieCard';

const FavoritesPage: React.FC = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const favorites = JSON.parse(localStorage.getItem('phimtoc_favorites') || '[]');
        
        if (favorites.length === 0) {
          setFavoriteMovies([]);
          setIsLoading(false);
          return;
        }
        
        // Fetch movie details for each favorite
        const moviePromises = favorites.map(async (id: string) => {
          try {
            const detail = await phimapiService.getMovieDetail(id);
            const movie = detail?.movie;
            if (!movie) return null;
            
            return {
              id: movie.slug || movie._id || id,
              title: movie.name || movie.origin_name || 'Không rõ',
              description: movie.content || '',
              image: phimapiService.formatImage(movie.poster_url || movie.thumb_url),
              backdropImage: phimapiService.formatImage(movie.cover_url || movie.thumb_url),
              year: String(movie.year || ''),
              rating: '',
              duration: movie.time || '',
              genre: (movie.category || []).map((c: any) => c?.name || '').filter(Boolean),
              videoUrl: '',
              category: (movie.category && movie.category[0]?.name) || 'Khác',
              imdbRating: movie.tmdb?.vote_average ? String(movie.tmdb.vote_average) : undefined
            } as Movie;
          } catch (error) {
            console.error(`Failed to fetch movie ${id}:`, error);
            return null;
          }
        });
        
        const movies = (await Promise.all(moviePromises))
          .filter((movie): movie is Movie => movie !== null);
        
        setFavoriteMovies(movies);
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setFavoriteMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadFavorites();
    };

    // Listen for custom storage events from MovieCard
    const handleCustomStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <Heart className="w-8 h-8 text-purple-500 fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">Phim yêu thích</h1>
          </div>

          {favoriteMovies.length > 0 ? (
            <>
              <p className="text-gray-400 mb-8">
                Bạn có {favoriteMovies.length} phim trong danh sách yêu thích
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favoriteMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} size="medium" />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <div className="text-gray-400 text-lg mb-4">
                Danh sách yêu thích trống
              </div>
              <p className="text-gray-500 mb-6">
                Thêm phim vào danh sách yêu thích để xem lại sau
              </p>
              <a
                href="/"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg"
              >
                Khám phá phim
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;