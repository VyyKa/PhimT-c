import React, { useMemo } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { phimapiService } from '../services/phimapiService';
import { useAuth } from '../contexts/AuthContext';
import { useRecommendations } from '../hooks/useRecommendations';
import MovieRow from '../components/MovieRow';

// Inline HLS player; avoid popup modal

const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [sp] = useSearchParams();
  const serverIndex = Math.max(0, Number(sp.get('server') ?? 0));
  const epIndex = Math.max(0, Number(sp.get('ep') ?? 0));
  const { user } = useAuth();

  const [state, setState] = React.useState<any>({ loading: true, error: null, detail: null });
  const [lightsOff, setLightsOff] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    let cancelled = false;
    (async () => {
      try {
        if (!id) return;
        const detail = await phimapiService.getMovieDetail(id);
        if (!cancelled) setState({ loading: false, error: null, detail });
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
    if (!isM3U8 || !src) return;
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
  }, [isM3U8, src]);

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

      <div className="max-w-6xl mx-auto relative z-50">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Link to={`/movie/${id}`} className="px-3 py-1 rounded border border-gray-600 hover:bg-white/10">← Chi tiết</Link>
          <div className="opacity-80 flex-1 truncate">{movie?.name || movie?.origin_name}</div>
          <button
            onClick={() => setLightsOff(prev => !prev)}
            className={`px-3 py-1 rounded-lg border text-sm transition-all duration-300 relative z-[60] ${
              lightsOff ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 hover:bg-yellow-400/30' : 'border-gray-600 hover:bg-white/10'
            }`}
            title="Nhấn L để bật/tắt đèn"
          >
            {lightsOff ? 'Bật đèn' : 'Tắt đèn'}
          </button>
        </div>

        <div className="bg-gradient-to-b from-gray-900/80 to-black rounded-xl overflow-hidden border border-gray-700 shadow-2xl relative z-[60]">
          {isM3U8 ? (
            <video
              ref={videoRef}
              className="w-full aspect-video bg-black"
              controls
              playsInline
              crossOrigin="anonymous"
              preload="metadata"
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

        {/* Server/Episode selectors */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 mt-6 relative z-[60]">
          <div>
            <div className="font-semibold mb-2">Chọn server</div>
            <div className="flex flex-wrap gap-2">
              {episodes?.map((s: any, i: number) => (
                <Link key={i} to={`/watch/${id}?server=${i}&ep=0`} className={`px-2 py-1 rounded border ${i===serverIndex? 'bg-white/10 border-white' : 'border-gray-600 hover:bg-white/5'}`}>{s?.server_name || `Server ${i+1}`}</Link>
              ))}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-2">Danh sách tập</div>
            <div className="flex flex-wrap gap-2">
              {(episodes?.[serverIndex]?.server_data || []).map((e: any, i: number) => (
                <Link key={i} to={`/watch/${id}?server=${serverIndex}&ep=${i}`} className={`text-sm px-2 py-1 rounded border ${i===epIndex? 'bg-white/10 border-white' : 'border-gray-600 hover:bg-white/5'}`}>{e?.name || e?.slug || e?.filename || `Tập ${i+1}`}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-12 relative z-[60]">
            <MovieRow title="Phim đề xuất cho bạn" movies={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;


