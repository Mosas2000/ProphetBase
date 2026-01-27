'use client';

import { Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  onLoad?: () => void;
}

// Optimized image component with lazy loading
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  className = '',
  onLoad,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <ImageIcon className="w-6 h-6 text-slate-600" />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          quality={quality}
          priority={priority}
          placeholder={placeholder}
          blurDataURL={blurDataURL || generateBlurDataURL()}
          onLoadingComplete={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          className={className}
        />
      )}
    </div>
  );
}

// Generate blur data URL
function generateBlurDataURL(): string {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzFhMjAyYyIvPjwvc3ZnPg==';
}

// Responsive image component
export function ResponsiveImage({
  src,
  alt,
  sizes = '100vw',
  className = '',
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={1200}
      height={800}
      className={className}
    />
  );
}

// Progressive image loader
export function ProgressiveImage({
  lowQualitySrc,
  highQualitySrc,
  alt,
  width,
  height,
  className = '',
}: {
  lowQualitySrc: string;
  highQualitySrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = highQualitySrc;
    img.onload = () => {
      setCurrentSrc(highQualitySrc);
      setIsHighQualityLoaded(true);
    };
  }, [highQualitySrc]);

  return (
    <div className={`relative ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-all duration-300 ${
          !isHighQualityLoaded ? 'blur-sm scale-105' : ''
        }`}
      />
    </div>
  );
}

// WebP conversion utility
export class ImageConverter {
  static async toWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Conversion failed'));
          },
          'image/webp',
          0.85
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  static supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }
}

// Image preloader
export class ImagePreloader {
  private cache: Map<string, HTMLImageElement> = new Map();

  preload(urls: string[]): Promise<void[]> {
    return Promise.all(
      urls.map((url) => {
        if (this.cache.has(url)) {
          return Promise.resolve();
        }

        return new Promise<void>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => {
            this.cache.set(url, img);
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        });
      })
    );
  }

  get(url: string): HTMLImageElement | undefined {
    return this.cache.get(url);
  }

  clear() {
    this.cache.clear();
  }

  getSize(): number {
    return this.cache.size;
  }
}

// Lazy image observer
export function useLazyImage(threshold = 0.1) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { imgRef, isVisible };
}

// CDN URL builder
export class CDNManager {
  private baseUrl: string;
  private transformations: Map<string, string> = new Map();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  buildUrl(
    path: string,
    options?: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpg' | 'png';
      fit?: 'cover' | 'contain' | 'fill';
    }
  ): string {
    const params = new URLSearchParams();

    if (options?.width) params.append('w', options.width.toString());
    if (options?.height) params.append('h', options.height.toString());
    if (options?.quality) params.append('q', options.quality.toString());
    if (options?.format) params.append('f', options.format);
    if (options?.fit) params.append('fit', options.fit);

    const queryString = params.toString();
    return `${this.baseUrl}${path}${queryString ? '?' + queryString : ''}`;
  }

  optimizeForDevice(path: string, devicePixelRatio: number = 1): string {
    const width = Math.round(window.innerWidth * devicePixelRatio);
    return this.buildUrl(path, { width, format: 'webp', quality: 85 });
  }
}

// Image compression
export class ImageCompressor {
  static async compress(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {}
  ): Promise<Blob> {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.85 } = options;

    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failed'));
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
}

// Responsive image srcset generator
export function generateSrcSet(basePath: string, sizes: number[]): string {
  return sizes.map((size) => `${basePath}?w=${size} ${size}w`).join(', ');
}

// Image loading performance monitor
export class ImageLoadMonitor {
  private loads: Map<
    string,
    {
      startTime: number;
      endTime?: number;
      size?: number;
      cached?: boolean;
    }
  > = new Map();

  startLoad(url: string) {
    this.loads.set(url, {
      startTime: performance.now(),
    });
  }

  endLoad(url: string, cached: boolean = false) {
    const load = this.loads.get(url);
    if (load) {
      load.endTime = performance.now();
      load.cached = cached;
    }
  }

  getLoadTime(url: string): number | null {
    const load = this.loads.get(url);
    if (load && load.endTime) {
      return load.endTime - load.startTime;
    }
    return null;
  }

  getAverageLoadTime(): number {
    const times = Array.from(this.loads.values())
      .filter((load) => load.endTime)
      .map((load) => load.endTime! - load.startTime);

    if (times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getCacheHitRate(): number {
    const total = this.loads.size;
    if (total === 0) return 0;

    const cached = Array.from(this.loads.values()).filter(
      (load) => load.cached
    ).length;
    return cached / total;
  }

  getMetrics() {
    return {
      totalImages: this.loads.size,
      averageLoadTime: this.getAverageLoadTime(),
      cacheHitRate: this.getCacheHitRate(),
    };
  }
}

// Blur hash generator (simplified)
export function generateBlurHash(
  imageData: ImageData,
  componentX: number = 4,
  componentY: number = 3
): string {
  // Simplified blur hash implementation
  // In production, use a library like 'blurhash'
  return `blur-${componentX}x${componentY}`;
}

// Export singleton instances
export const imagePreloader = new ImagePreloader();
export const imageLoadMonitor = new ImageLoadMonitor();
export const cdnManager = new CDNManager(process.env.NEXT_PUBLIC_CDN_URL || '');
