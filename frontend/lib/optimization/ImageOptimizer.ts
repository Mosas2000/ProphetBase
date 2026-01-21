/**
 * Image Optimization Utilities
 * Handles lazy loading, WebP conversion, and responsive images
 */

interface ImageOptimizerOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  sizes?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: 'blur' | 'empty';
}

class ImageOptimizer {
  private observer: IntersectionObserver | null = null;
  private loadedImages: Set<string> = new Set();

  constructor() {
    this.initLazyLoading();
  }

  /**
   * Initialize lazy loading observer
   */
  private initLazyLoading(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            this.loadImage(img);
            this.observer?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );
  }

  /**
   * Optimize image URL
   */
  optimizeUrl(
    src: string,
    width?: number,
    height?: number,
    options?: ImageOptimizerOptions
  ): string {
    const url = new URL(src, window.location.origin);
    const params = new URLSearchParams(url.search);

    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (options?.quality) params.set('q', options.quality.toString());
    if (options?.format && options.format !== 'auto') {
      params.set('fm', options.format);
    }

    url.search = params.toString();
    return url.toString();
  }

  /**
   * Generate srcset for responsive images
   */
  generateSrcSet(src: string, widths: number[]): string {
    return widths
      .map((width) => `${this.optimizeUrl(src, width)} ${width}w`)
      .join(', ');
  }

  /**
   * Convert image to WebP
   */
  async convertToWebP(file: File, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to convert image'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Load image lazily
   */
  private loadImage(img: HTMLImageElement): void {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (src) {
      img.src = src;
      delete img.dataset.src;
    }

    if (srcset) {
      img.srcset = srcset;
      delete img.dataset.srcset;
    }

    img.classList.add('loaded');
    this.loadedImages.add(img.src);
  }

  /**
   * Observe image for lazy loading
   */
  observe(img: HTMLImageElement): void {
    if (this.observer) {
      this.observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  /**
   * Preload critical images
   */
  preload(src: string, options?: { as?: string; type?: string }): void {
    if (this.loadedImages.has(src)) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = options?.as || 'image';
    if (options?.type) link.type = options.type;

    document.head.appendChild(link);
    this.loadedImages.add(src);
  }

  /**
   * Get optimal image format based on browser support
   */
  getOptimalFormat(): 'webp' | 'avif' | 'jpeg' {
    if (typeof window === 'undefined') return 'jpeg';

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    // Check AVIF support
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      return 'avif';
    }

    // Check WebP support
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp';
    }

    return 'jpeg';
  }

  /**
   * Calculate responsive image sizes
   */
  calculateSizes(breakpoints: { [key: string]: number }): string {
    return Object.entries(breakpoints)
      .map(([bp, size]) => `(max-width: ${bp}) ${size}px`)
      .join(', ');
  }

  /**
   * Get image dimensions
   */
  async getDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  }

  /**
   * Compress image
   */
  async compress(
    file: File,
    maxWidth: number = 1920,
    quality: number = 0.8
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate blur placeholder
   */
  async generateBlurPlaceholder(src: string): Promise<string> {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Promise((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Create small blurred version
        canvas.width = 20;
        canvas.height = 20;
        ctx?.drawImage(img, 0, 0, 20, 20);

        resolve(canvas.toDataURL('image/jpeg', 0.1));
      };

      img.onerror = () => reject(new Error('Failed to generate placeholder'));
      img.src = src;
    });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.observer?.disconnect();
    this.loadedImages.clear();
  }
}

// Export singleton instance
export const imageOptimizer = new ImageOptimizer();

// React component for optimized images
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  quality = 80,
  sizes,
  onLoad,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
}) {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      imageOptimizer.observe(imgRef.current);
    }
  }, [loading]);

  const optimizedSrc = imageOptimizer.optimizeUrl(src, width, height, { quality });
  const srcSet = width
    ? imageOptimizer.generateSrcSet(src, [width, width * 2, width * 3])
    : undefined;

  return (
    <img
      ref={imgRef}
      src={loading === 'eager' ? optimizedSrc : undefined}
      data-src={loading === 'lazy' ? optimizedSrc : undefined}
      srcSet={loading === 'eager' ? srcSet : undefined}
      data-srcset={loading === 'lazy' ? srcSet : undefined}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      loading={loading}
      onLoad={() => {
        setIsLoaded(true);
        onLoad?.();
      }}
    />
  );
}

import React from 'react';
