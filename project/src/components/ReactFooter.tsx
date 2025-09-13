import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Facebook, HelpCircle, Mail, Bug, MessageCircle, Star, Zap, Heart } from 'lucide-react';

const ReactFooter: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="px-4 md:px-16 py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            PhimTộc
          </h2>
          <p className="text-gray-300 text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto">
            {t('websiteIntro')}
          </p>
          
          {/* Website Description */}
          <div className="max-w-5xl mx-auto mb-12">
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
              {t('websiteDescription1')}
            </p>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
              {t('websiteDescription2')}
            </p>
            
            {/* Demo Info */}
            <div className="inline-flex items-center px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50">
              <p className="text-gray-400 text-sm">
                {t('demoInfo')} 
                <a 
                  href="https://github.com/vyyka" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300 ml-1 font-medium"
                >
                  @vyyka
                </a>
              </p>
            </div>
          </div>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-bold text-xl mb-3">{t('highQuality')}</h4>
              <p className="text-gray-400 text-base leading-relaxed">{t('highQualityDesc')}</p>
            </div>
            
            <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 mb-6 group-hover:shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-bold text-xl mb-3">{t('fastLoading')}</h4>
              <p className="text-gray-400 text-base leading-relaxed">{t('fastLoadingDesc')}</p>
            </div>
            
            <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-400/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 mb-6 group-hover:shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-white font-bold text-xl mb-3">{t('free')}</h4>
              <p className="text-gray-400 text-base leading-relaxed">{t('freeDesc')}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-16">
          {/* Categories */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-xl mb-6 relative">
              {t('categories')}
              <div className="absolute -bottom-2 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/browse?category=phim-le" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-lg font-medium">{t('featureFilms')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=phim-bo" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-lg font-medium">{t('tvSeries')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=hoat-hinh" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-lg font-medium">{t('anime')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=tv-shows" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-lg font-medium">{t('tvShows')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Genres */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-xl mb-6 relative">
              {t('genres')}
              <div className="absolute -bottom-2 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/browse?category=hanh-dong" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-lg font-medium">{t('action')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=hai-kich" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-lg font-medium">{t('comedy')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=kinh-di" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-lg font-medium">{t('horror')}</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse?category=lang-man" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-lg font-medium">{t('romance')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold text-xl mb-6 relative">
              {t('support')}
              <div className="absolute -bottom-2 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500"></div>
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://www.facebook.com/phimtocc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <HelpCircle className="w-5 h-5 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-medium">{t('helpCenter')}</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/phimtocc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <Mail className="w-5 h-5 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-medium">{t('contact')}</span>
                </a>
              </li>
              <li>
                <a 
                  href="https://www.facebook.com/phimtocc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <Bug className="w-5 h-5 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-medium">{t('reportBug')}</span>
                </a>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="group flex items-center justify-center md:justify-start text-gray-400 hover:text-white transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-lg font-medium">{t('faq')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gradient-to-r from-transparent via-gray-700 to-transparent pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-lg font-medium">
              &copy; 2025 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">PhimTộc</span>. {t('copyright')}
            </p>
            <div className="mt-4 flex justify-center">
              <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ReactFooter;


