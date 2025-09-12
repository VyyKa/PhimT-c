import { useState, useEffect, useRef } from 'react';

interface UseLazyImageProps {
  src: string;
  placeholder?: string;
}

export function useLazyImage({ src, placeholder }: UseLazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = imgRef.current;
            if (!element) return;
            const handleLoad = () => {
              setIsLoaded(true);
              element.removeEventListener('load', handleLoad);
              element.removeEventListener('error', handleError);
              observer.disconnect();
            };
            const handleError = () => {
              try {
                const url = new URL(src);
                if (url.hostname === 'phimapi.com' && url.pathname.includes('/image.php')) {
                  const original = url.searchParams.get('url');
                  if (original) {
                    setImageSrc(original);
                    return; // allow reload and keep listeners
                  }
                }
              } catch {}
              setIsError(true);
              element.removeEventListener('load', handleLoad);
              element.removeEventListener('error', handleError);
              observer.disconnect();
            };

            element.addEventListener('load', handleLoad);
            element.addEventListener('error', handleError);
            setImageSrc(src);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return { imageSrc, isLoaded, isError, imgRef };
}