import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, ChevronDown, LogOut, Settings, Heart, Film } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from './SearchBar';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-purple-500/20 backdrop-blur-md bg-black/40"
    >
      <div className="px-4 md:px-8 lg:px-16 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent neon-text">
                  PhimTộc
                </h1>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              </div>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
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
          <div className="flex items-center space-x-3">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
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
            >
              <LanguageSwitcher />
            </motion.div>

            {/* Notifications */}
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/5 group"
            >
              <Bell className="w-5 h-5" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>
            </motion.button>

            {/* Profile Dropdown */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="relative"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-white/5 transition-all duration-300 group"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-300 transition-all duration-300 ${isProfileOpen ? 'rotate-180 text-white' : 'group-hover:text-white'}`} />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-56 glass-morphism rounded-2xl shadow-2xl overflow-hidden"
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
      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center justify-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-3 py-2 rounded-xl text-xs transition-all duration-300 ${
                isActive(item.path) 
                  ? 'text-white bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-purple-500/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;