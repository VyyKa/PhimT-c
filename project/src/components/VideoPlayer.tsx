import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Maximize, X } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  isYouTubeTrailer?: boolean;
  driveUrl?: string;
  hlsUrl?: string; // optional .m3u8 source for quality selection
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUrl, 
  title, 
  isOpen, 
  onClose, 
  isYouTubeTrailer = false,
  driveUrl,
  hlsUrl
}) => {
  
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSource, setCurrentSource] = useState<'youtube' | 'drive'>('youtube');
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  const hlsVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [levels, setLevels] = useState<{ index: number; height?: number }[]>([]);
  const hlsInstanceRef = useRef<any>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setHasError(false);
      setIsLoading(true);
      
      // Set timeout for loading detection
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      // Watchdog: if still not loaded after 8s, show error fallback UI
      const failTimeout = setTimeout(() => {
        if (isOpen) {
          setIsLoading(false);
          setHasError(true);
        }
      }, 8000);

      return () => {
        clearTimeout(loadingTimeout);
        clearTimeout(failTimeout);
      };
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset source when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSource(isYouTubeTrailer ? 'youtube' : 'drive');
      setHasError(false);
      setIsLoading(true);
    }
  }, [isOpen, isYouTubeTrailer]);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen not supported:', error);
    }
  };

  const switchSource = (source: 'youtube' | 'drive') => {
    setCurrentSource(source);
    setHasError(false);
    setIsLoading(true);
  };

  const getCurrentVideoUrl = () => {
    if (currentSource === 'youtube' && isYouTubeTrailer) {
      return videoUrl;
    }
    return driveUrl || videoUrl;
  };

  // Convert various video URLs to proper embed format
  const getEmbedUrl = (url: string) => {
    // Handle Google Drive URLs
    if (url.includes('drive.google.com')) {
      // Extract file ID from various Google Drive URL formats
      let fileId = '';
      
      if (url.includes('/file/d/')) {
        fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || '';
      } else if (url.includes('id=')) {
        fileId = url.match(/id=([a-zA-Z0-9_-]+)/)?.[1] || '';
      }
      
      if (fileId) {
        // Use the preview format for better embedding
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
      return url;
    }
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      // Check if it's already an embed URL
      if (url.includes('/embed/')) {
        return url;
      }
      
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&origin=${window.location.origin}` : url;
    }
    
    return url;
  };

  const getDirectUrl = (embedUrl: string) => {
    // Handle Google Drive URLs
    if (embedUrl.includes('drive.google.com')) {
      const fileId = embedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
      return fileId ? `https://drive.google.com/file/d/${fileId}/view` : embedUrl;
    }
    
    // Handle YouTube URLs
    const videoId = embedUrl.match(/\/embed\/([^?&]+)/)?.[1];
    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : embedUrl;
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const currentVideoUrl = getCurrentVideoUrl();
  const isGoogleDrive = currentVideoUrl.includes('drive.google.com');
  const embedUrl = getEmbedUrl(currentVideoUrl);
  const directUrl = getDirectUrl(embedUrl);

  // Setup HLS when hlsUrl is provided
  useEffect(() => {
    if (!isOpen || !hlsUrl) return;
    const videoEl = hlsVideoRef.current;
    if (!videoEl) return;

    (async () => {
      try {
        // Native HLS support
        if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
          videoEl.src = hlsUrl;
          setLevels([]);
          return;
        }
        const mod = await import('hls.js');
        const Hls = mod.default;
        if (Hls.isSupported()) {
          const hls = new Hls({
            maxBufferLength: 60,
            enableWorker: true,
            lowLatencyMode: false,
            // Force fetch loader and strip referrer
            fetchSetup: (_context: any, initParams: any) => {
              const next = { ...initParams, referrerPolicy: 'no-referrer' };
              return next;
            },
            // For older loaders, fallback
            xhrSetup: (xhr: XMLHttpRequest) => {
              try { xhr.withCredentials = false; } catch {}
            }
          } as any);
          hls.loadSource(hlsUrl);
          hls.attachMedia(videoEl);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            const lvls = hls.levels.map((l: any, i: number) => ({ index: i, height: l.height }));
            setLevels(lvls);
            // Default to highest quality
            try {
              if (Array.isArray(hls.levels) && hls.levels.length > 0) {
                const highest = hls.levels.length - 1;
                hls.currentLevel = highest;
              }
            } catch {}
          });
          // Fallback to Auto if fatal error occurs
          hls.on(Hls.Events.ERROR, (_e: any, data: any) => {
            try {
              if (data?.fatal) {
                hls.currentLevel = -1;
              }
            } catch {}
          });
          hlsInstanceRef.current = hls;
        }
      } catch (e) {
        console.warn('HLS init failed', e);
      }
    })();

    return () => {
      if (hlsInstanceRef.current) {
        try { hlsInstanceRef.current.destroy(); } catch {}
        hlsInstanceRef.current = null;
      }
    };
  }, [isOpen, hlsUrl]);

  const setQuality = (level: number) => {
    const inst = hlsInstanceRef.current;
    if (inst && typeof level === 'number') {
      // -1 = auto
      inst.currentLevel = level;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Controls Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold truncate pr-4">{title}</h3>
                  {isYouTubeTrailer && driveUrl && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span>Tự động tìm thấy trailer YouTube</span>
                      </div>
                      <button
                        onClick={() => switchSource('youtube')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          currentSource === 'youtube'
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        🎬 Trailer YouTube
                      </button>
                      <button
                        onClick={() => switchSource('drive')}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          currentSource === 'drive'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        🎥 Bản đầy đủ
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {hlsUrl && (
                    <div className="relative">
                      <select
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/20"
                        defaultValue={-1}
                      >
                        <option value={-1}>Auto</option>
                        {levels.map(l => (
                          <option key={l.index} value={l.index}>{l.height ? `${l.height}p` : `Level ${l.index}`}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={toggleFullscreen}
                    className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 p-2 rounded-full hover:bg-white/10 transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Player or Error State */}
            {!hasError ? (
              <>
                {hlsUrl ? (
                  <video
                    ref={hlsVideoRef}
                    className="w-full h-full bg-black"
                    controls
                    playsInline
                    onLoadedData={handleIframeLoad as any}
                    onError={handleIframeError as any}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <iframe
                    ref={videoRef}
                    src={embedUrl}
                    title={title}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                    frameBorder="0"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    style={{ border: 'none' }}
                  />
                )}
                
                {/* Loading Overlay */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-gray-900 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-white text-lg">Đang tải video...</p>
                        <p className="text-gray-400 text-sm mt-2">
                          {isGoogleDrive ? 'Đang kết nối với Google Drive' : 'Đang tải từ YouTube'}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center max-w-md mx-auto p-6">
                  <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-red-600" />
                  </div>
                  
                  <h3 className="text-white text-xl font-semibold mb-4">Video không thể phát</h3>
                  
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {isGoogleDrive 
                      ? currentSource === 'youtube' 
                        ? 'Trailer YouTube không thể tải hoặc bị hạn chế. Hãy thử chuyển sang bản đầy đủ trên Drive.'
                        : 'Video Google Drive không thể nhúng hoặc bị hạn chế quyền truy cập.'
                      : currentSource === 'youtube'
                        ? 'Trailer YouTube không cho phép nhúng hoặc bị hạn chế. Hãy thử chuyển sang bản đầy đủ.'
                        : 'Video này không cho phép nhúng hoặc bị hạn chế bởi chủ sở hữu.'
                    }
                  </p>
                  
                  {/* Source switching buttons in error state */}
                  {isYouTubeTrailer && driveUrl && (
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-xs text-yellow-400 mb-2">
                        💡 Thử chuyển nguồn video khác:
                      </div>
                      <button
                        onClick={() => switchSource(currentSource === 'youtube' ? 'drive' : 'youtube')}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all text-sm font-medium shadow-lg"
                      >
                        {currentSource === 'youtube' ? '🎥 Chuyển sang Drive' : '🎬 Chuyển sang YouTube'}
                      </button>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <a
                      href={directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      <span>
                        {isGoogleDrive 
                          ? 'Xem trên Google Drive' 
                          : currentSource === 'youtube' 
                            ? 'Xem trên YouTube' 
                            : 'Xem video gốc'
                        }
                      </span>
                      {isGoogleDrive ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6.5 2L3 6.5L6.5 11H10L13.5 6.5L10 2H6.5ZM14 2L17.5 6.5L14 11H17.5L21 6.5L17.5 2H14ZM6.5 13L3 17.5L6.5 22H10L13.5 17.5L10 13H6.5Z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      )}
                    </a>
                    
                    <div className="text-xs text-gray-500">
                      Video sẽ mở trong tab mới
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom gradient for better visibility */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoPlayer;