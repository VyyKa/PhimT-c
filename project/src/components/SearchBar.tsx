import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '../hooks/useDebounce';
import { phimapiService } from '../services/phimapiService';
import { Movie } from '../types';

interface SearchBarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onToggle }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsLoading(true);
      (async () => {
        try {
          const res = await phimapiService.search({ keyword: debouncedQuery, page: 1, limit: 8 });
          const items = res.data?.items || [];
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
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          onToggle();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleMovieClick = (movieId: string) => {
    navigate(`/movie/${movieId}`);
    setQuery('');
    setResults([]);
    onToggle();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setResults([]);
      onToggle();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute right-0 top-0"
          >
            <form onSubmit={handleSubmit} className="flex items-center">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-64 md:w-80 px-4 py-2 pl-10 bg-black/80 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 backdrop-blur-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {query.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-md border border-purple-500/30 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
                >
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="py-2">
                      {results.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => handleMovieClick(movie.id)}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-purple-500/10 transition-colors text-left"
                        >
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{movie.title}</h4>
                            <p className="text-gray-400 text-sm">{movie.year} • {movie.genre.join(', ')}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      <p>Không tìm thấy kết quả cho "{query}"</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <button
          onClick={onToggle}
          className="text-gray-300 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
        >
          <Search className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;