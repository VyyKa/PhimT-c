import { useMemo, useState, useEffect } from 'react';
import { Movie } from '../types';
import { movieData } from '../data/movies';
// Removed TasteDive integration

export function useRecommendations(
  favoriteMovies: string[],
  watchHistory: string[],
  currentMovieId?: string
): Movie[] {
  const [tasteDiveRecommendations, setTasteDiveRecommendations] = useState<never[]>([]);

  // Get user's favorite movies for TasteDive API
  const userMovies = useMemo(() => {
    return movieData.filter(movie => 
      favoriteMovies.includes(movie.id) || watchHistory.includes(movie.id)
    );
  }, [favoriteMovies, watchHistory]);

  // TasteDive removed: keep state for minimal code churn
  useEffect(() => {
    setTasteDiveRecommendations([]);
  }, [userMovies]);

  return useMemo(() => {
    // Try to match TasteDive recommendations with our movie data
    const matchedRecommendations: Movie[] = [];
    
    // TasteDive removed

    // If we have TasteDive recommendations, use them
    if (matchedRecommendations.length > 0) {
      return matchedRecommendations.slice(0, 10);
    }

    // Fallback to local recommendation algorithm
    const userGenres = userMovies.flatMap(movie => movie.genre);
    const genreCount = userGenres.reduce((acc, genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Sort genres by frequency
    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre);

    // Find recommendations based on top genres
    const recommendations = movieData
      .filter(movie => {
        // Exclude current movie and already watched/favorited
        if (movie.id === currentMovieId) return false;
        if (favoriteMovies.includes(movie.id)) return false;
        if (watchHistory.includes(movie.id)) return false;
        
        // Include if movie has any of user's top genres
        return movie.genre.some(genre => topGenres.includes(genre));
      })
      .sort((a, b) => {
        // Sort by genre match count and rating
        const aGenreMatches = a.genre.filter(g => topGenres.includes(g)).length;
        const bGenreMatches = b.genre.filter(g => topGenres.includes(g)).length;
        
        if (aGenreMatches !== bGenreMatches) {
          return bGenreMatches - aGenreMatches;
        }
        
        return (b.imdbRating || 0) - (a.imdbRating || 0);
      })
      .slice(0, 10);

    // If no recommendations based on preferences, return popular movies
    if (recommendations.length === 0) {
      return movieData
        .filter(movie => movie.id !== currentMovieId)
        .sort((a, b) => (b.imdbRating || 0) - (a.imdbRating || 0))
        .slice(0, 10);
    }

    return recommendations;
  }, [favoriteMovies, watchHistory, currentMovieId, userMovies, tasteDiveRecommendations]);
}

// Hook for getting TasteDive recommendations for a specific movie
// TasteDive per-movie recommendations hook removed