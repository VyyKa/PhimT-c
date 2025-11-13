import React, { useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Film as FilmIcon, Image as ImageIcon, Users, Eye } from 'lucide-react';
import { phimapiService } from '../services/phimapiService';
import { useAuth } from '../contexts/AuthContext';
import { useRecommendations } from '../hooks/useRecommendations';
import MovieRow from '../components/MovieRow';
import LazyImage from '../components/LazyImage';

// Inline HLS player; avoid popup modal

const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sp] = useSearchParams();
  const serverIndex = Math.max(0, Number(sp.get('server') ?? 0));
  const epIndex = Math.max(0, Number(sp.get('ep') ?? 0));
  const { user } = useAuth();

  const [state, setState] = React.useState<any>({ loading: true, error: null, detail: null });
  const [lightsOff, setLightsOff] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<'episodes' | 'images' | 'cast' | 'info'>('episodes');
  const [episodesList, setEpisodesList] = React.useState<any[]>([]);
  const [images, setImages] = React.useState<string[]>([]);
  const [cast, setCast] = React.useState<string[]>([]);

  // Reset playing state when server or episode changes
  React.useEffect(() => {
    setIsPlaying(false);
  }, [serverIndex, epIndex]);

  React.useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    let cancelled = false;
    (async () => {
      try {
        if (!id) return;
        const detail = await phimapiService.getMovieDetail(id);
        if (!cancelled) {
          setState({ loading: false, error: null, detail });
          
          // Set episodes, images, cast from detail
          const m = detail?.movie || {};
          const eps = (detail as any)?.episodes || [];
          setEpisodesList(eps);
          
          // Extract images from movie data
          const movieImages: string[] = [];
          if (m.poster_url) movieImages.push(phimapiService.formatImage(m.poster_url));
          if (m.thumb_url) movieImages.push(phimapiService.formatImage(m.thumb_url));
          if (m.cover_url) movieImages.push(phimapiService.formatImage(m.cover_url));
          setImages(movieImages);
          
          // Get all cast members
          setCast((m.actor || []).map((a: any) => typeof a === 'string' ? a : a?.name || '').filter(Boolean));
        }
      } catch (e) {
        console.error('Error fetching movie detail:', e);
        if (!cancelled) setState({ loading: false, error: e, detail: null });
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Lights off keyboard shortcut (L)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'l') setLightsOff(prev => !prev);
      if (e.key === 'Escape') setLightsOff(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const { src, isM3U8, movie, episodes } = useMemo(() => {
    const d = state.detail || {};
    const eps = d.episodes || [];
    const server = eps[serverIndex] || eps[0] || {};
    const list = server.server_data || [];
    const item = list[epIndex] || list[0] || {};
    const raw = item.link_m3u8 || item.link_embed || '';
    let s: string = raw || '';
    if (s.startsWith('//')) s = `https:${s}`;
    s = s.replace(/\s+/g, '');
    const m3u8 = /\.m3u8(\?|#|$)/i.test(s);
    
    
    return { src: s, isM3U8: m3u8, movie: d.movie || {}, episodes: eps };
  }, [state, serverIndex, epIndex]);

  // Setup simple HLS when needed
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  React.useEffect(() => {
    if (!isM3U8 || !src || !isPlaying) return;
    const el = videoRef.current;
    if (!el) return;

    if (el.canPlayType('application/vnd.apple.mpegurl')) {
      el.src = src;
      return;
    }
    let destroy: (() => void) | undefined;
    (async () => {
      try {
        const mod = await import('hls.js');
        const Hls = mod.default as any;
        if (Hls.isSupported()) {
          const hls = new Hls({ maxBufferLength: 60, enableWorker: true });
          hls.loadSource(src);
          hls.attachMedia(el);
          // Prefer highest quality by default once manifest is parsed
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            try {
              if (Array.isArray(hls.levels) && hls.levels.length > 0) {
                const highest = hls.levels.length - 1;
                hls.currentLevel = highest;
              }
            } catch {}
          });
          // Simple fallback: if there is a fatal media error, revert to Auto
          hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
            try {
              if (data?.fatal) {
                hls.currentLevel = -1; // Auto
              }
            } catch {}
          });
          destroy = () => hls.destroy();
        }
      } catch {}
    })();
    return () => { try { destroy && destroy(); } catch {} };
  }, [isM3U8, src, isPlaying]);

  const recommendations = useRecommendations(
    user?.favoriteMovies || [],
    user?.watchHistory || [],
    id
  );

  if (state.loading) {
    return <div className="min-h-screen text-white flex items-center justify-center">Đang tải nguồn phát…</div>;
  }

  if (state.error) {
    return <div className="min-h-screen text-white flex items-center justify-center">Lỗi tải dữ liệu.</div>;
  }

  return (
    <div className={`min-h-screen text-white pt-24 px-4 md:px-16 ${lightsOff ? 'bg-black overflow-hidden' : 'bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900'}`}>
      {/* Lights Off overlay - only darkens background, not controls */}
      {lightsOff && (
        <div className="fixed inset-0 bg-black/80 z-40 transition-opacity pointer-events-none"></div>
      )}

      <div className="max-w-6xl mx-auto relative">
        <div className="mb-4 flex items-center gap-2 text-sm relative z-10">
          <Link to={`/movie/${id}`} className="px-3 py-1 rounded border border-gray-600 hover:bg-white/10">← Chi tiết</Link>
          <div className="opacity-80 flex-1 truncate">{movie?.name || movie?.origin_name}</div>
          <button
            onClick={() => setLightsOff(prev => !prev)}
            className={`px-3 py-1 rounded-lg border text-sm transition-all duration-300 ${
              lightsOff ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 hover:bg-yellow-400/30' : 'border-gray-600 hover:bg-white/10'
            }`}
            title="Nhấn L để bật/tắt đèn"
          >
            {lightsOff ? 'Bật đèn' : 'Tắt đèn'}
          </button>
        </div>

        <div className="bg-gradient-to-b from-gray-900/80 to-black rounded-xl overflow-hidden border border-gray-700 shadow-2xl relative" style={{ zIndex: 45 }}>
          {!isPlaying ? (
            // Poster with Play Button
            <div className="relative aspect-video w-full group cursor-pointer" onClick={() => setIsPlaying(true)}>
              <LazyImage
                src={phimapiService.formatImage(movie?.poster_url || movie?.thumb_url || movie?.cover_url)}
                alt={movie?.name || movie?.origin_name || 'Movie'}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"
                >
                  <Play className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white ml-1" fill="white" />
                </motion.button>
              </div>
              
              {/* Movie Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 xs:p-6 md:p-8">
                <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  {movie?.name || movie?.origin_name || 'Phim'}
                </h2>
                <p className="text-gray-300 text-sm xs:text-base">Nhấn để phát</p>
              </div>
            </div>
          ) : isM3U8 ? (
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
              controls
              playsInline
              crossOrigin="anonymous"
              preload="metadata"
              autoPlay
            />
          ) : src ? (
            <div className="aspect-video w-full">
              <iframe
                src={src}
                title={movie?.name || ''}
                className="w-full h-full"
                referrerPolicy="no-referrer"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                allowFullScreen
                frameBorder={0}
              />
            </div>
          ) : (
            <div className="aspect-video w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-4">🎬</div>
                <div className="text-2xl font-bold mb-4 text-white">Phim chưa có nguồn phát</div>
                <div className="text-gray-400 mb-6">
                  Phim này hiện tại chưa có link phát. Vui lòng thử lại sau hoặc chọn phim khác.
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    to={`/movie/${id}`} 
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300"
                  >
                    ← Quay lại chi tiết
                  </Link>
                  <Link 
                    to="/browse" 
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-300"
                  >
                    Duyệt phim khác
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        {movie && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative mt-6 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-xl overflow-hidden border border-gray-700/50"
            style={{ zIndex: 50 }}
          >
            {/* Overlay for tabs when lights off */}
            {lightsOff && (
              <div className="absolute inset-0 bg-black/80 z-10 rounded-xl pointer-events-none"></div>
            )}
            <div className="p-4 xs:p-6 relative z-20">
              <div className="flex flex-wrap items-center gap-2 xs:gap-3 border-b border-gray-700/50 pb-4">
                {/* Tập phim Tab */}
                <button
                  onClick={() => setActiveTab('episodes')}
                  className={`flex items-center space-x-2 px-4 xs:px-6 py-3 rounded-t-lg transition-all duration-300 ${
                    activeTab === 'episodes'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <FilmIcon className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span className="text-sm xs:text-base font-medium">Tập phim</span>
                  {episodesList.length > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === 'episodes' ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {episodesList.reduce((total, server) => total + (server?.server_data?.length || 0), 0)}
                    </span>
                  )}
                </button>

                {/* Hình ảnh Tab */}
                <button
                  onClick={() => setActiveTab('images')}
                  className={`flex items-center space-x-2 px-4 xs:px-6 py-3 rounded-t-lg transition-all duration-300 ${
                    activeTab === 'images'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span className="text-sm xs:text-base font-medium">Hình ảnh</span>
                  {images.length > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === 'images' ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {images.length}
                    </span>
                  )}
                </button>

                {/* Diễn viên Tab */}
                <button
                  onClick={() => setActiveTab('cast')}
                  className={`flex items-center space-x-2 px-4 xs:px-6 py-3 rounded-t-lg transition-all duration-300 ${
                    activeTab === 'cast'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Users className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span className="text-sm xs:text-base font-medium">Diễn viên</span>
                  {cast.length > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === 'cast' ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {cast.length}
                    </span>
                  )}
                </button>

                {/* Thông tin Tab */}
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex items-center space-x-2 px-4 xs:px-6 py-3 rounded-t-lg transition-all duration-300 ${
                    activeTab === 'info'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Eye className="w-4 h-4 xs:w-5 xs:h-5" />
                  <span className="text-sm xs:text-base font-medium">Thông tin</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-6 xs:mt-8">
                {/* Episodes Content */}
                {activeTab === 'episodes' && (
                  <div className="space-y-6">
                    {episodesList.length > 0 ? (
                      <>
                        <h3 className="text-xl xs:text-2xl font-bold text-white mb-6">Các bản chiếu</h3>
                        {episodesList.map((server, sIndex) => {
                          const serverName = server.server_name || `Server ${sIndex + 1}`;
                          const serverData = server.server_data || [];
                          const totalEpisodes = serverData.length;
                          
                          return (
                            <motion.div
                              key={sIndex}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: sIndex * 0.1 }}
                              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 xs:p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                            >
                              <div className="flex flex-col md:flex-row gap-4 xs:gap-6">
                                {/* Poster */}
                                <div className="flex-shrink-0 w-full md:w-32 lg:w-40">
                                  <LazyImage
                                    src={phimapiService.formatImage(movie?.poster_url || movie?.thumb_url || movie?.cover_url)}
                                    alt={movie?.name || movie?.origin_name || 'Movie'}
                                    className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                                  />
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1">
                                  <div className="mb-3">
                                    <h4 className="text-lg xs:text-xl font-bold text-white mb-1">
                                      #{serverName}
                                    </h4>
                                    <p className="text-gray-400 text-sm xs:text-base mb-2">{movie?.name || movie?.origin_name}</p>
                                    {totalEpisodes > 0 && (
                                      <p className="text-gray-500 text-xs xs:text-sm">
                                        {totalEpisodes} {totalEpisodes === 1 ? 'tập' : 'tập'}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {/* Episodes Grid */}
                                  {totalEpisodes > 0 ? (
                                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 xs:gap-3 mb-4">
                                      {serverData.map((_ep: any, epIdx: number) => (
                                        <motion.button
                                          key={epIdx}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => {
                                            window.location.href = `/watch/${id}?server=${sIndex}&ep=${epIdx}`;
                                          }}
                                          className={`flex items-center justify-center text-white px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg text-xs xs:text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg ${
                                            sIndex === serverIndex && epIdx === epIndex
                                              ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                                              : 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-600'
                                          }`}
                                        >
                                          Tập {String(epIdx + 1).padStart(2, '0')}
                                        </motion.button>
                                      ))}
                                    </div>
                                  ) : null}
                                  
                                  {/* Watch Button */}
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                      window.location.href = `/watch/${id}?server=${sIndex}&ep=0`;
                                    }}
                                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 xs:px-6 py-2.5 xs:py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                                  >
                                    <Play className="w-4 h-4 xs:w-5 xs:h-5" />
                                    <span className="text-sm xs:text-base">Xem bản này</span>
                                  </motion.button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">Chưa có tập phim</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Images Content */}
                {activeTab === 'images' && (
                  <div>
                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 xs:gap-4">
                        {images.map((img, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative aspect-[2/3] overflow-hidden rounded-lg cursor-pointer group"
                            onClick={() => window.open(img, '_blank')}
                          >
                            <LazyImage
                              src={img}
                              alt={`${movie?.name || movie?.origin_name || 'Movie'} - Image ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">Chưa có hình ảnh</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Cast Content */}
                {activeTab === 'cast' && (
                  <div>
                    {cast.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl xs:text-2xl font-bold text-white">
                            Diễn viên ({cast.length})
                          </h3>
                        </div>
                        <div className="space-y-3 xs:space-y-4">
                          {cast.map((actor, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center space-x-3 xs:space-x-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg p-3 xs:p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                            >
                              {/* Avatar */}
                              <div className="flex-shrink-0 w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-lg xs:text-xl sm:text-2xl font-bold shadow-lg">
                                {actor.charAt(0).toUpperCase()}
                              </div>
                              
                              {/* Actor Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm xs:text-base font-semibold truncate">{actor}</p>
                                <p className="text-gray-400 text-xs xs:text-sm truncate">Diễn viên</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">Chưa có thông tin diễn viên</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Info Content */}
                {activeTab === 'info' && (
                  <div className="space-y-6 xs:space-y-8">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-xl xs:text-2xl font-bold text-white mb-4 xs:mb-6">Thông tin cơ bản</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6">
                        {movie?.director && (
                          <div>
                            <h4 className="text-gray-400 text-sm xs:text-base mb-2">Đạo diễn</h4>
                            <p className="text-white text-base xs:text-lg font-medium">{movie.director}</p>
                          </div>
                        )}
                        {movie?.country && (
                          <div>
                            <h4 className="text-gray-400 text-sm xs:text-base mb-2">Quốc gia</h4>
                            <p className="text-white text-base xs:text-lg font-medium">{movie.country}</p>
                          </div>
                        )}
                        {movie?.year && (
                          <div>
                            <h4 className="text-gray-400 text-sm xs:text-base mb-2">Năm sản xuất</h4>
                            <p className="text-white text-base xs:text-lg font-medium">{movie.year}</p>
                          </div>
                        )}
                        {movie?.rating && (
                          <div>
                            <h4 className="text-gray-400 text-sm xs:text-base mb-2">Chất lượng</h4>
                            <p className="text-white text-base xs:text-lg font-medium">{movie.rating}</p>
                          </div>
                        )}
                        {movie?.duration && (
                          <div>
                            <h4 className="text-gray-400 text-sm xs:text-base mb-2">Thời lượng</h4>
                            <p className="text-white text-base xs:text-lg font-medium">{movie.duration}</p>
                          </div>
                        )}
                        {movie?.category && (
                          <div>
                            <h4 className="text-gray-400 text-sm xs:text-base mb-2">Thể loại</h4>
                            <p className="text-white text-base xs:text-lg font-medium">{movie.category}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {movie?.description && (
                      <div>
                        <h3 className="text-xl xs:text-2xl font-bold text-white mb-4 xs:mb-6">Nội dung</h3>
                        <p className="text-gray-300 text-sm xs:text-base leading-relaxed whitespace-pre-line">
                          {movie.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12 relative z-50">
            <MovieRow title="Phim đề xuất cho bạn" movies={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;


