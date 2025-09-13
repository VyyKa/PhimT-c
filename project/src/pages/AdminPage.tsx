import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Film, BarChart3 } from 'lucide-react';
import { Movie } from '../types';
import { phimapiService } from '../services/phimapiService';
import toast from 'react-hot-toast';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'movies' | 'users'>('dashboard');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch movies from API
  useEffect(() => {
    let cancelled = false;
    
    (async () => {
      try {
        setLoading(true);
        
        // Get recent movies from different categories
        const [phimLe, phimBo, hoatHinh, tvShows] = await Promise.all([
          phimapiService.getList('phim-le', { page: 1, limit: 10, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('phim-bo', { page: 1, limit: 10, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('hoat-hinh', { page: 1, limit: 10, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('tv-shows', { page: 1, limit: 10, sort_field: 'modified.time', sort_type: 'desc' })
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
          
          setMovies(mappedMovies);
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
  }, []);

  const handleDeleteMovie = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      setMovies(movies.filter(movie => movie.id !== id));
      toast.success('Đã xóa phim thành công');
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: BarChart3 },
    { id: 'movies', label: 'Quản lý phim', icon: Film },
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="px-4 md:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Trang quản trị</h1>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Tổng số phim</p>
                      <p className="text-3xl font-bold text-white">{movies.length}</p>
                    </div>
                    <Film className="w-8 h-8 text-purple-500" />
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Người dùng</p>
                      <p className="text-3xl font-bold text-white">1,234</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Lượt xem hôm nay</p>
                      <p className="text-3xl font-bold text-white">5,678</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Doanh thu tháng</p>
                      <p className="text-3xl font-bold text-white">$12,345</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Phim được xem nhiều nhất</h3>
                <div className="space-y-3">
                  {movies.slice(0, 5).map((movie, index) => (
                    <div key={movie.id} className="flex items-center space-x-4">
                      <span className="text-2xl font-bold text-gray-500 w-8">
                        {index + 1}
                      </span>
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{movie.title}</h4>
                        <p className="text-gray-400 text-sm">{movie.year} • {movie.rating}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{Math.floor(Math.random() * 1000) + 100}k</p>
                        <p className="text-gray-400 text-sm">lượt xem</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Movies Tab */}
          {activeTab === 'movies' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Quản lý phim</h2>
                <button
                  onClick={() => setIsAddingMovie(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm phim mới</span>
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="text-gray-400">Đang tải danh sách phim...</div>
                </div>
              ) : (

              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Phim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Thể loại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Năm
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Đánh giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {movies.map((movie) => (
                        <tr key={movie.id} className="hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={movie.image}
                                alt={movie.title}
                                className="w-12 h-16 object-cover rounded mr-4"
                              />
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {movie.title}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {movie.duration}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              {movie.genre.join(', ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {movie.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              {movie.imdbRating || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-400 hover:text-blue-300">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMovie(movie.id)}
                                className="text-purple-400 hover:text-purple-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Quản lý người dùng</h2>
              
              <div className="bg-gray-900 rounded-lg p-6">
                <p className="text-gray-400 text-center py-8">
                  Tính năng quản lý người dùng sẽ được phát triển trong phiên bản tiếp theo
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;