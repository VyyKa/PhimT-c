import { useState, useEffect } from 'react';
import { Movie } from '../types';
import { youtubeService } from '../services/youtubeService';

export interface TrailerData {
  hasYouTubeTrailer: boolean;
  youtubeEmbedUrl: string | null;
  driveUrl: string | null;
  isLoading: boolean;
  trailerInfo?: { title: string; description: string };
}

export function useTrailerData(movie: Movie): TrailerData {
  const [trailerData, setTrailerData] = useState<TrailerData>({
    hasYouTubeTrailer: false,
    youtubeEmbedUrl: null,
    driveUrl: null,
    isLoading: true
  });

  useEffect(() => {
    const loadTrailerData = async () => {
      setTrailerData(prev => ({ ...prev, isLoading: true }));

      try {
        // Check if movie already has YouTube trailer
        if (movie.youtubeTrailer) {
          const embedUrl = youtubeService.getEmbedUrl(movie.youtubeTrailer);
          const trailerInfo = youtubeService.getTrailerInfo(movie.youtubeTrailer);
          
          setTrailerData({
            hasYouTubeTrailer: true,
            youtubeEmbedUrl: embedUrl,
            driveUrl: movie.driveUrl || movie.videoUrl,
            isLoading: false,
            trailerInfo
          });
          return;
        }

        // Search for YouTube trailer automatically
        const youtubeVideoId = await youtubeService.searchTrailer(movie.title, movie.year);
        
        if (youtubeVideoId) {
          const embedUrl = youtubeService.getEmbedUrl(youtubeVideoId);
          const trailerInfo = youtubeService.getTrailerInfo(youtubeVideoId);
          
          setTrailerData({
            hasYouTubeTrailer: true,
            youtubeEmbedUrl: embedUrl,
            driveUrl: movie.videoUrl, // Keep original as drive URL
            isLoading: false,
            trailerInfo
          });
        } else {
          setTrailerData({
            hasYouTubeTrailer: false,
            youtubeEmbedUrl: null,
            driveUrl: movie.videoUrl,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error loading trailer data:', error);
        setTrailerData({
          hasYouTubeTrailer: false,
          youtubeEmbedUrl: null,
          driveUrl: movie.videoUrl,
          isLoading: false
        });
      }
    };

    if (movie.id && movie.title) {
      loadTrailerData();
    }
  }, [movie.id, movie.title, movie.year, movie.youtubeTrailer, movie.videoUrl, movie.driveUrl]);

  return trailerData;
}