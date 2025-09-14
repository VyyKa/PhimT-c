import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, ChevronDown, LogOut, Settings, Heart, Film, Menu, X, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { phimapiService } from '../services/phimapiService';
import SearchBar from './SearchBar';
import LanguageSwitcher from './LanguageSwitcher';

interface Notification {
  id: string;
  type: 'movie_update' | 'system';
  title: string;
  message: string;
  movieId?: string;
  timestamp: Date;
  read: boolean;
}

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('browse'), path: '/browse' },
    { name: t('favorites'), path: '/favorites' },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // Fetch notifications from API
  useEffect(() => {
    let cancelled = false;
    
    const fetchNotifications = async () => {
      try {
        // Get recently updated movies
        const [phimLe, phimBo, hoatHinh, tvShows] = await Promise.all([
          phimapiService.getList('phim-le', { page: 1, limit: 3, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('phim-bo', { page: 1, limit: 3, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('hoat-hinh', { page: 1, limit: 3, sort_field: 'modified.time', sort_type: 'desc' }),
          phimapiService.getList('tv-shows', { page: 1, limit: 3, sort_field: 'modified.time', sort_type: 'desc' })
        ]);
        
        if (!cancelled) {
          const allMovies = [
            ...(phimLe.data?.items || []),
            ...(phimBo.data?.items || []),
            ...(hoatHinh.data?.items || []),
            ...(tvShows.data?.items || [])
          ];
          
          // Create notifications for new movies
          const newNotifications: Notification[] = allMovies.slice(0, 5).map((movie: any, index: number) => ({
            id: `movie-${movie.slug || movie._id}`,
            type: 'movie_update' as const,
            title: t('newMovieAdded'),
            message: `${movie.name} ${t('newMovieAdded')}`,
            movieId: movie.slug || movie._id,
            timestamp: new Date(movie.modified?.time || Date.now()),
            read: false
          }));
          
          // Add system notification
          const systemNotification: Notification = {
            id: 'system-update',
            type: 'system',
            title: t('systemNotification'),
            message: 'Website đã được cập nhật với nhiều tính năng mới',
            timestamp: new Date(),
            read: false
          };
          
          setNotifications([systemNotification, ...newNotifications]);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Navigate to movie if it's a movie notification
    if (notification.movieId) {
      window.location.href = `/movie/${notification.movieId}`;
    }
    
    // Close notification dropdown
    setIsNotificationOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.notification-dropdown') && !target.closest('.profile-dropdown')) {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-purple-500/20 backdrop-blur-md bg-black/40"
    >
      <div className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-16 py-3 xs:py-4 safe-area-left safe-area-right">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent neon-text">
                  PhimTộc
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              </div>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to={item.path}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActive(item.path) 
                      ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl border border-purple-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-2 md:space-x-3">
            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/5 touch-button"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 xs:w-5 xs:h-5" /> : <Menu className="w-4 h-4 xs:w-5 xs:h-5" />}
            </motion.button>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden sm:block"
            >
              <SearchBar
                isOpen={isSearchOpen}
                onToggle={() => setIsSearchOpen(!isSearchOpen)}
              />
            </motion.div>

            {/* Language Switcher */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden sm:block"
            >
              <LanguageSwitcher />
            </motion.div>

            {/* Notifications */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="relative notification-dropdown"
            >
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsNotificationOpen(!isNotificationOpen);
                }}
                className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/5 group"
              >
                <Bell className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                {unreadCount > 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                )}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
              </motion.button>
              
              {/* Notification Dropdown */}
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-72 xs:w-80 glass-morphism rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold text-sm">Thông báo</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">
                            {unreadCount} mới
                          </span>
                        )}
                      </div>
                      
                      {notifications.length > 0 ? (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <button
                              key={notification.id}
                              onClick={() => handleNotificationClick(notification)}
                              className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                                notification.read 
                                  ? 'bg-gray-800/50 border-gray-700/50' 
                                  : 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-1.5 rounded-lg ${
                                  notification.type === 'movie_update' 
                                    ? 'bg-blue-500/20 text-blue-400' 
                                    : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {notification.type === 'movie_update' ? (
                                    <Film className="w-3 h-3" />
                                  ) : (
                                    <Settings className="w-3 h-3" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-xs font-medium truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center space-x-1 mt-2">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <span className="text-gray-500 text-xs">
                                      {notification.timestamp.toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0 mt-1"></div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">Không có thông báo mới</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Profile Dropdown */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="relative profile-dropdown"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-1 md:space-x-2 p-1.5 md:p-2 rounded-xl hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 md:w-4 md:h-4 text-gray-300 transition-all duration-300 ${isProfileOpen ? 'rotate-180 text-white' : 'group-hover:text-white'} hidden sm:block`} />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 xs:w-56 glass-morphism rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-purple-500/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
                        <p className="text-white font-semibold text-sm">{user?.name}</p>
                        <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                        {user?.isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-medium rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                        >
                          <Settings className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                          <span className="text-sm">Hồ sơ</span>
                        </Link>
                        
                        <Link
                          to="/favorites"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                        >
                          <Heart className="w-4 h-4 group-hover:text-pink-400 transition-colors" />
                          <span className="text-sm">Yêu thích</span>
                        </Link>

                        {user?.isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                          >
                            <Film className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                            <span className="text-sm">Quản trị</span>
                          </Link>
                        )}
                      </div>
                      
                      <div className="border-t border-purple-500/20 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2.5 text-gray-300 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full text-left group"
                        >
                          <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                          <span className="text-sm">Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-purple-500/20 bg-black/50 backdrop-blur-md"
          >
            <div className="px-3 xs:px-4 py-4 safe-area-left safe-area-right">
              {/* Mobile Search */}
              <div className="mb-4 sm:hidden">
                <SearchBar
                  isOpen={isSearchOpen}
                  onToggle={() => setIsSearchOpen(!isSearchOpen)}
                />
              </div>

              {/* Mobile Language Switcher */}
              <div className="mb-4 sm:hidden">
                <LanguageSwitcher />
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive(item.path) 
                        ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;