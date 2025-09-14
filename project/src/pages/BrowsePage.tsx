import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { phimapiService } from '../services/phimapiService';

const BrowsePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('title');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<any[]>([]);

  // Get category from URL params
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Fetch genres
  useEffect(() => {
    (async () => {
      try {
        const genresData = await phimapiService.getGenres();
        setGenres(genresData?.data?.items || []);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      }
    })();
  }, []);

  // Fetch movies based on category and sort
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    
    (async () => {
      try {
        let response;
        const params: any = {
          page: 1,
          limit: 50,
          sort_field: sortBy === 'year' ? 'year' : 'modified.time',
          sort_type: sortBy === 'year' ? 'desc' : 'desc'
        };

        if (selectedCategory === 'Tất cả') {
          // Get all movies from different categories
          const [phimLe, phimBo, hoatHinh, tvShows] = await Promise.all([
            phimapiService.getList('phim-le', params),
            phimapiService.getList('phim-bo', params),
            phimapiService.getList('hoat-hinh', params),
            phimapiService.getList('tv-shows', params)
          ]);
          
          const allMovies = [
            ...(phimLe.data?.items || []),
            ...(phimBo.data?.items || []),
            ...(hoatHinh.data?.items || []),
            ...(tvShows.data?.items || [])
          ];
          
          response = { data: { items: allMovies } };
        } else {
          // Map category names to API endpoints
          let categorySlug = '';
          switch (selectedCategory) {
            case 'phim-le':
              categorySlug = 'phim-le';
              break;
            case 'phim-bo':
              categorySlug = 'phim-bo';
              break;
            case 'hoat-hinh':
            case 'Anime':
              categorySlug = 'hoat-hinh';
              break;
            case 'tv-shows':
            case 'TV Shows':
              categorySlug = 'tv-shows';
              break;
            default:
              // Try to find genre by name
              const genre = genres.find(g => g.name === selectedCategory);
              if (genre) {
                response = await phimapiService.getGenreDetail(genre.slug, params);
              } else {
                response = await phimapiService.getList('phim-le', params);
              }
              break;
          }
          
          if (categorySlug) {
            response = await phimapiService.getList(categorySlug as any, params);
          }
        }

        if (!cancelled) {
          const items = response?.data?.items || [];
          const mappedMovies: Movie[] = items.map((item: any) => ({
            id: item.slug || item._id,
            title: item.name,
            description: '',
            image: phimapiService.formatImage(item.poster_url || item.thumb_url),
            backdropImage: phimapiService.formatImage(item.thumb_url || item.poster_url),
            year: String(item.year || ''),
            rating: '',
            duration: '',
            genre: (item.category || []).map((c: any) => c?.name || '').filter(Boolean),
            videoUrl: '',
            category: (item.category && item.category[0]?.name) || 'Khác',
            imdbRating: item.tmdb?.vote_average ? parseFloat(item.tmdb.vote_average) : undefined
          }));

          // Sort movies
          const sortedMovies = mappedMovies.sort((a, b) => {
            switch (sortBy) {
              case 'year':
                return parseInt(b.year) - parseInt(a.year);
              case 'rating':
                return (b.imdbRating || 0) - (a.imdbRating || 0);
              case 'title':
              default:
                return a.title.localeCompare(b.title);
            }
          });

          setMovies(sortedMovies);
        }
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        if (!cancelled) {
          setMovies([]);
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
  }, [selectedCategory, sortBy, genres]);

  const allCategories = ['Tất cả', 'phim-le', 'phim-bo', 'hoat-hinh', 'tv-shows', ...genres.map(g => g.name)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-20">
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-300 bg-clip-text text-transparent">
            Duyệt phim
          </h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Thể loại</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm md:text-base backdrop-blur-sm"
              >
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Sắp xếp theo</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm md:text-base backdrop-blur-sm"
              >
                <option value="title">Tên phim (A-Z)</option>
                <option value="year">Năm phát hành (Mới nhất)</option>
                <option value="rating">Đánh giá (Cao nhất)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              {loading ? 'Đang tải...' : `Hiển thị ${movies.length} phim`}
              {selectedCategory !== 'Tất cả' && ` trong thể loại "${selectedCategory}"`}
            </p>
          </div>

          {/* Movies Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-800 rounded-lg aspect-[2/3] mb-2"></div>
                  <div className="bg-gray-800 h-3 md:h-4 rounded mb-1"></div>
                  <div className="bg-gray-800 h-2 md:h-3 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} size="medium" />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-400 text-lg mb-4">
                Không có phim nào trong thể loại này
              </div>
              <button
                onClick={() => setSelectedCategory('Tất cả')}
                className="text-red-600 hover:text-red-500 transition-colors"
              >
                Xem tất cả phim
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;