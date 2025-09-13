import { useMemo, useState, useEffect } from 'react';
import { Movie } from '../types';
import { phimapiService } from '../services/phimapiService';

export function useRecommendations(
  favoriteMovies: string[],
  watchHistory: string[],
  currentMovieId?: string
): Movie[] {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    (async () => {
      try {
        setLoading(true);
        
        // Get recent movies from different categories
        const [phimLe, phimBo, hoatHinh, tvShows] = await Promise.all([
          phimapiService.getList('phim-le', { page: 1, limit: 8, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('phim-bo', { page: 1, limit: 8, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('hoat-hinh', { page: 1, limit: 8, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('tv-shows', { page: 1, limit: 8, sort_field: 'modified.time', sort_type: 'desc' })
        ]);
        
        if (!cancelled) {
          // Combine all movies
          const allMovies = [
            ...(phimLe.data?.items || []),
            ...(phimBo.data?.items || []),
            ...(hoatHinh.data?.items || []),
            ...(tvShows.data?.items || [])
          ];
          
          // Map to Movie format
          const mappedMovies: Movie[] = allMovies.map((item: any) => ({
            id: item.slug || item._id,
            title: item.name,
            description: '',
            image: phimapiService.formatImage(item.poster_url || item.thumb_url),
            backdropImage: phimapiService.formatImage(item.thumb_url || item.poster_url),
            year: String(item.year || ''),
            rating: '',
            duration: item.time || '',
            genre: (item.category || []).map((c: any) => c?.name || '').filter(Boolean),
            videoUrl: '',
            category: (item.category && item.category[0]?.name) || 'Khác',
            imdbRating: item.tmdb?.vote_average ? String(item.tmdb.vote_average) : undefined
          }));
          
          // Filter out current movie and already watched/favorited
          const filteredMovies = mappedMovies.filter(movie => {
            if (movie.id === currentMovieId) return false;
            if (favoriteMovies.includes(movie.id)) return false;
            if (watchHistory.includes(movie.id)) return false;
            return true;
          });
          
          // Sort by rating and take top 10
          const sortedMovies = filteredMovies
            .sort((a, b) => {
              const aRating = parseFloat(a.imdbRating || '0');
              const bRating = parseFloat(b.imdbRating || '0');
              return bRating - aRating;
            })
            .slice(0, 10);
          
          setRecommendations(sortedMovies);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        if (!cancelled) {
          setRecommendations([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    
    return () => {
      cancelled = true;
    };
  }, [favoriteMovies, watchHistory, currentMovieId]);

  return recommendations;
}
