import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { getMovieById } from '../data/movies';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';

const FavoritesPage: React.FC = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      const favorites = JSON.parse(localStorage.getItem('phimtoc_favorites') || '[]');
      const movies = favorites
        .map((id: string) => getMovieById(id))
        .filter((movie: Movie | undefined): movie is Movie => movie !== undefined);
      
      setFavoriteMovies(movies);
      setIsLoading(false);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <Heart className="w-8 h-8 text-red-600 fill-current" />
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
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded transition-colors"
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