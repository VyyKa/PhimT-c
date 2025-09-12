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

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!id) return;
        const detail = await phimapiService.getMovieDetail(id);
        if (!cancelled) setState({ loading: false, error: null, detail });
      } catch (e) {
        if (!cancelled) setState({ loading: false, error: e, detail: null });
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

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
    <div className="min-h-screen text-white pt-24 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Link to={`/movie/${id}`} className="px-3 py-1 rounded border border-gray-600 hover:bg-white/10">← Chi tiết</Link>
          <div className="opacity-80">{movie?.name || movie?.origin_name}</div>
        </div>

        <div className="bg-black rounded-xl overflow-hidden border border-gray-700">
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
            <div className="aspect-video w-full flex items-center justify-center">Không có nguồn phát</div>
          )}
        </div>

        {/* Server/Episode selectors */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 mt-6">
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
          <div className="mt-12">
            <MovieRow title="Phim đề xuất cho bạn" movies={recommendations} />
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchPage;


