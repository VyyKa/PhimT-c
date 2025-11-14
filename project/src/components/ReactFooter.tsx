import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HelpCircle, Mail, Bug, MessageCircle } from 'lucide-react';

const ReactFooter: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="px-4 md:px-16 py-8 md:py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto">
        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-10">
          {/* Left Column - Header Section */}
          <div className="text-left">
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <img 
                src="/favico.png" 
                alt="PhimTộc Logo" 
                className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0"
              />
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                PhimTộc
              </h2>
            </div>
            <p className="text-gray-300 text-sm md:text-base font-light mb-4 md:mb-6">
              {t('websiteIntro')}
            </p>
            
            {/* Website Description */}
            {t('websiteDescription1') && (
              <div className="mb-6 md:mb-8">
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {t('websiteDescription1')}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {/* Categories */}
          <div className="text-left">
            <h3 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 relative">
              {t('categories')}
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link 
                  to="/browse?category=phim-le" 
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-sm md:text-base font-medium">{t('featureFilms')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=phim-bo" 
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-sm md:text-base font-medium">{t('tvSeries')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=hoat-hinh" 
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-sm md:text-base font-medium">{t('anime')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=tv-shows" 
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-sm md:text-base font-medium">{t('tvShows')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div className="text-left">
            <h3 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 relative">
              {t('genres')}
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link 
                  to="/browse?category=hanh-dong" 
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-sm md:text-base font-medium">{t('action')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=hai-kich" 
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-sm md:text-base font-medium">{t('comedy')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=kinh-di" 
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-sm md:text-base font-medium">{t('horror')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=lang-man" 
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-sm md:text-base font-medium">{t('romance')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-left">
            <h3 className="text-white font-bold text-base md:text-lg mb-3 md:mb-4 relative">
              {t('support')}
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></div>
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a 
                  href="https://www.facebook.com/phimtocc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <HelpCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm md:text-base font-medium">{t('helpCenter')}</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/phimtocc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm md:text-base font-medium">{t('contact')}</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/phimtocc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <Bug className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm md:text-base font-medium">{t('reportBug')}</span>
                </a>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="group flex items-center text-gray-400 hover:text-white transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm md:text-base font-medium">{t('faq')}</span>
                </Link>
              </li>
            </ul>
          </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gradient-to-r from-transparent via-gray-700 to-transparent pt-4 md:pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm md:text-base font-medium">
              &copy; 2025 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">PhimTộc</span>
            </p>
            <div className="mt-2 md:mt-3 flex justify-center">
              <div className="w-16 md:w-20 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ReactFooter;


