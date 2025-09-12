import React from 'react';
import { motion } from 'framer-motion';
import { useLazyImage } from '../hooks/useLazyImage';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PC9zdmc+',
  onLoad,
  onError
}) => {
  const { imageSrc, isLoaded, isError, imgRef } = useLazyImage({ src, placeholder });

  React.useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
    if (isError && onError) {
      onError();
    }
  }, [isLoaded, isError, onLoad, onError]);

  if (isError) {
    return (
      <div className={`bg-gray-800/50 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-gray-400 text-xs mb-2">Lỗi tải ảnh</div>
          <div className="w-8 h-8 bg-gray-700/50 rounded mx-auto flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0.7 }}
      transition={{ duration: 0.3 }}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
};

export default LazyImage;