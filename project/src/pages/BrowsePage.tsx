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
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('Tất cả');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]); // store genre slugs
  const [selectedYear, setSelectedYear] = useState<string>('Tất cả');
  const [selectedLang, setSelectedLang] = useState<string>('Tất cả');

  // Get category from URL params
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      // If category matches a genre slug, set it as selectedGenres
      // We'll resolve after genres are fetched
    }

    const countryParam = searchParams.get('country');
    if (countryParam) {
      // Accept either slug or display name in param; try to map later after countries load
      setSelectedCountry(countryParam);
    }

    const yearParam = searchParams.get('year');
    if (yearParam) setSelectedYear(yearParam);

    const langParam = searchParams.get('lang');
    if (langParam) setSelectedLang(langParam);
  }, [searchParams]);

  // Fetch genres and countries
  useEffect(() => {
    (async () => {
      try {
        const [genresData, countriesData] = await Promise.all([
          phimapiService.getGenres(),
          phimapiService.getCountries?.() || Promise.resolve(undefined)
        ]);
        const fetchedGenres = genresData?.data?.items || [];
        setGenres(fetchedGenres);
        if (countriesData?.data?.items) {
          setCountries(countriesData.data.items);
        } else {
          // Fallback minimal list if API not available
          setCountries([{ name: 'Việt Nam', slug: 'viet-nam' }]);
        }

        // If selectedCategory matches a genre by name or slug, preselect
        const matchBySlug = fetchedGenres.find((g: any) => g.slug === selectedCategory);
        const matchByName = fetchedGenres.find((g: any) => g.name === selectedCategory);
        if (matchBySlug?.slug) setSelectedGenres([matchBySlug.slug]);
        else if (matchByName?.slug) setSelectedGenres([matchByName.slug]);
      } catch (error) {
        console.error('Failed to fetch filters:', error);
        // Safe fallbacks
        if (countries.length === 0) {
          setCountries([{ name: 'Việt Nam', slug: 'viet-nam' }]);
        }
      }
    })();
  }, []);

  // Normalize selectedCountry to slug when building params
  const resolveCountrySlug = (value: string): string | undefined => {
    if (!value || value === 'Tất cả') return undefined;
    // If already a slug
    if (countries.some((c) => c.slug === value)) return value;
    // Try map by name
    const found = countries.find((c) => c.name === value);
    return found?.slug || undefined;
  };

  const langOptions = ['Tất cả', 'vietsub', 'thuyet-minh', 'long-tieng'];
  const currentYear = new Date().getFullYear();
  const yearOptions = ['Tất cả', ...Array.from({ length: 30 }, (_, i) => String(currentYear - i))];

  // Build labeled category options (base + genres)
  const baseCategoryOptions = [
    { value: 'Tất cả', label: 'Tất cả' },
    { value: 'phim-le', label: 'Phim Lẻ' },
    { value: 'phim-bo', label: 'Phim Bộ' },
    { value: 'hoat-hinh', label: 'Hoạt Hình' },
    { value: 'tv-shows', label: 'TV Shows' }
  ];
  const genreOptions = genres.map((g: any) => ({ value: g.slug, label: g.name }));
  const allCategoryOptions = [...baseCategoryOptions, ...genreOptions];
  const selectedCategoryLabel = allCategoryOptions.find(o => o.value === selectedCategory)?.label || selectedCategory;

  // Fetch movies based on category, selected genres, country and sort
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    
    (async () => {
      try {
        let response: any;
        const baseParams: any = {
          page: 1,
          limit: 50,
          sort_field: sortBy === 'year' ? 'year' : 'modified.time',
          sort_type: 'desc'
        };

        const countrySlug = resolveCountrySlug(selectedCountry);
        if (countrySlug) baseParams.country = countrySlug;
        if (selectedYear !== 'Tất cả') baseParams.year = Number(selectedYear);
        if (selectedLang !== 'Tất cả') baseParams.sort_lang = selectedLang as any;

        // If user chose multiple genres, merge results from those genres
        if (selectedGenres.length > 0) {
          const uniqueBySlug = new Map<string, any>();
          const results = await Promise.all(
            selectedGenres.map((slug) => phimapiService.getGenreDetail(slug, baseParams))
          );
          results.forEach((r) => {
            (r?.data?.items || []).forEach((item: any) => {
              const key = item.slug || item._id;
              if (!uniqueBySlug.has(key)) uniqueBySlug.set(key, item);
            });
          });
          response = { data: { items: Array.from(uniqueBySlug.values()) } };
        } else if (selectedCategory === 'Tất cả') {
          // Get all movies from different categories
          const [phimLe, phimBo, hoatHinh, tvShows] = await Promise.all([
            phimapiService.getList('phim-le', baseParams),
            phimapiService.getList('phim-bo', baseParams),
            phimapiService.getList('hoat-hinh', baseParams),
            phimapiService.getList('tv-shows', baseParams)
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
              // Try to find genre by name or slug
              const genre = genres.find(g => g.name === selectedCategory || g.slug === selectedCategory);
              if (genre) {
                response = await phimapiService.getGenreDetail(genre.slug, baseParams);
              } else {
                response = await phimapiService.getList('phim-le', baseParams);
              }
              break;
          }
          
          if (categorySlug) {
            response = await phimapiService.getList(categorySlug as any, baseParams);
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
  }, [selectedCategory, sortBy, genres, selectedCountry, selectedGenres, selectedYear, selectedLang]);

  const allCountries = ['Tất cả', ...countries.map((c: any) => c.name)];

  const toggleGenre = (slug: string) => {
    setSelectedGenres(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-20">
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-300 bg-clip-text text-transparent">
            Duyệt phim
          </h1>

          {/* Filters */}
          <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              {/* Category Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Thể loại</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm md:text-base backdrop-blur-sm"
                >
                  {allCategoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Quốc gia</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm md:text-base backdrop-blur-sm"
                >
                  {allCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Năm</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm md:text-base backdrop-blur-sm"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Ngôn ngữ</label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-sm md:text-base backdrop-blur-sm"
                >
                  {langOptions.map((l) => (
                    <option key={l} value={l}>{l === 'Tất cả' ? l : l.replace('-', ' ')}</option>
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

            {/* Multi-select Genres */}
            <div>
              <label className="block text-sm font-medium mb-2">Chọn nhiều thể loại</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {genres.map((g: any) => (
                  <button
                    key={g.slug}
                    onClick={() => toggleGenre(g.slug)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      selectedGenres.includes(g.slug)
                        ? 'bg-purple-600/30 border-purple-500/50 text-purple-200'
                        : 'bg-slate-800/50 border-slate-600 text-gray-300 hover:bg-slate-700/50'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
              {selectedGenres.length > 0 && (
                <p className="mt-2 text-xs text-gray-400">Đang lọc theo {selectedGenres.length} thể loại</p>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              {loading ? 'Đang tải...' : `Hiển thị ${movies.length} phim`}
              {selectedCategory !== 'Tất cả' && selectedGenres.length === 0 && ` trong thể loại "${selectedCategoryLabel}"`}
              {selectedGenres.length > 0 && ` • ${selectedGenres.length} thể loại`}
              {selectedCountry !== 'Tất cả' && ` • quốc gia "${selectedCountry}"`}
              {selectedYear !== 'Tất cả' && ` • năm ${selectedYear}`}
              {selectedLang !== 'Tất cả' && ` • ${selectedLang}`}
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
                Không có phim nào phù hợp với bộ lọc hiện tại
              </div>
              <button
                onClick={() => { setSelectedCategory('Tất cả'); setSelectedGenres([]); setSelectedCountry('Tất cả'); setSelectedYear('Tất cả'); setSelectedLang('Tất cả'); }}
                className="text-red-600 hover:text-red-500 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;