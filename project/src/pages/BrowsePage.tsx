import React, { useState } from 'react';
import { movieData, categories } from '../data/movies';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';

const BrowsePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('title');

  const allCategories = ['Tất cả', ...categories];

  const getFilteredMovies = (): Movie[] => {
    let filtered = selectedCategory === 'Tất cả' 
      ? movieData 
      : movieData.filter(movie => movie.category === selectedCategory);

    // Sort movies
    return filtered.sort((a, b) => {
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
  };

  const filteredMovies = getFilteredMovies();

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Duyệt phim</h1>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Thể loại</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-red-600"
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
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-red-600"
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
              Hiển thị {filteredMovies.length} phim
              {selectedCategory !== 'Tất cả' && ` trong thể loại "${selectedCategory}"`}
            </p>
          </div>

          {/* Movies Grid */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMovies.map((movie) => (
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