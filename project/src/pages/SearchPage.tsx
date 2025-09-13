import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { phimapiService } from '../services/phimapiService';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
      performSearch(searchQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await phimapiService.search({ keyword: searchQuery, page: 1, limit: 20 });
      const items = res.data?.items || [];
      // Map remote items into local Movie shape as best-effort for display in cards
      const mapped: Movie[] = items.map((it) => ({
        id: it.slug || it._id,
        title: it.name,
        description: '',
        image: phimapiService.formatImage(it.poster_url || it.thumb_url),
        year: String(it.year || ''),
        rating: '',
        duration: '',
        genre: (it.category || []).map(c => c.name || '').filter(Boolean),
        videoUrl: '',
        category: (it.category && it.category[0]?.name) || 'Khác'
      }));
      setResults(mapped);
    } catch (e) {
      setResults([]);
    }
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm kiếm phim, thể loại..."
                className="w-full px-6 py-4 pl-12 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <>
              {query && (
                <h2 className="text-2xl md:text-3xl font-bold mb-8">
                  {results.length > 0 
                    ? `Kết quả tìm kiếm cho "${query}" (${results.length} phim)`
                    : `Không tìm thấy kết quả cho "${query}"`
                  }
                </h2>
              )}

              {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {results.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} size="medium" />
                  ))}
                </div>
              ) : query && !isLoading ? (
                <div className="text-center py-20">
                  <div className="text-gray-400 text-lg mb-4">
                    Không tìm thấy phim nào phù hợp
                  </div>
                  <p className="text-gray-500">
                    Hãy thử tìm kiếm với từ khóa khác hoặc duyệt qua các danh mục phim
                  </p>
                </div>
              ) : !query ? (
                <div className="text-center py-20">
                  <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <div className="text-gray-400 text-lg mb-4">
                    Tìm kiếm phim yêu thích của bạn
                  </div>
                  <p className="text-gray-500">
                    Nhập tên phim hoặc thể loại để bắt đầu tìm kiếm
                  </p>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;