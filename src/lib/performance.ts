// Performance monitoring and optimization utilities

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

export class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
      this.measurePageLoad();
    }
  }

  private initializeObservers() {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  private measurePageLoad() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;
          
          // First Contentful Paint
          const paintEntries = performance.getEntriesByType('paint');
          const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
          if (fcpEntry) {
            this.metrics.firstContentfulPaint = fcpEntry.startTime;
          }

          // Time to Interactive (approximation)
          this.metrics.timeToInteractive = navigation.domInteractive - navigation.fetchStart;
        }, 0);
      });
    }
  }

  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  getWebVitals(): { lcp: number | null; fid: number | null; cls: number | null } {
    return {
      lcp: this.metrics.largestContentfulPaint || null,
      fid: this.metrics.firstInputDelay || null,
      cls: this.metrics.cumulativeLayoutShift || null,
    };
  }

  reportMetrics(endpoint: string = '/api/analytics/performance') {
    if (typeof window !== 'undefined' && Object.keys(this.metrics).length > 0) {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: this.metrics,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
      }).catch(error => {
        console.warn('Failed to report performance metrics:', error);
      });
    }
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization utilities
export const imageOptimization = {
  // Generate responsive image sizes
  generateSrcSet: (baseUrl: string, sizes: number[] = [320, 640, 768, 1024, 1280, 1920]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },

  // Generate sizes attribute for responsive images
  generateSizes: (breakpoints: { [key: string]: string } = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    default: '33vw'
  }) => {
    const sizeEntries = Object.entries(breakpoints);
    const mediaQueries = sizeEntries.slice(0, -1).map(([query, size]) => `${query} ${size}`);
    const defaultSize = breakpoints.default || '100vw';
    return [...mediaQueries, defaultSize].join(', ');
  },

  // Lazy loading intersection observer
  createLazyLoadObserver: (callback: (entry: IntersectionObserverEntry) => void) => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      return new IntersectionObserver(
        (entries) => {
          entries.forEach(callback);
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01,
        }
      );
    }
    return null;
  },
};

// Code splitting utilities
export const codeSplitting = {
  // Dynamic import with error handling
  dynamicImport: async <T>(importFn: () => Promise<T>): Promise<T | null> => {
    try {
      return await importFn();
    } catch (error) {
      console.error('Dynamic import failed:', error);
      return null;
    }
  },

  // Preload critical resources
  preloadResource: (href: string, as: string = 'script') => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    }
  },

  // Prefetch non-critical resources
  prefetchResource: (href: string) => {
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  },
};

// Memory management utilities
export const memoryManagement = {
  // Clean up event listeners
  cleanupEventListeners: (element: Element | Window, events: string[], handler: EventListener) => {
    events.forEach(event => {
      element.removeEventListener(event, handler);
    });
  },

  // Debounce function for performance
  debounce: <T extends (...args: any[]) => any>(func: T, wait: number): T => {
    let timeout: NodeJS.Timeout;
    return ((...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    }) as T;
  },

  // Throttle function for performance
  throttle: <T extends (...args: any[]) => any>(func: T, limit: number): T => {
    let inThrottle: boolean;
    return ((...args: any[]) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }) as T;
  },
};

// Bundle size analyzer (development only)
export const bundleAnalyzer = {
  logBundleSize: () => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      
      console.group('Bundle Analysis');
      console.log('Script files:', scripts.length);
      console.log('Stylesheet files:', styles.length);
      console.groupEnd();
    }
  },
};

// Initialize performance monitoring
let performanceMonitor: PerformanceMonitor | null = null;

export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined' && !performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
    
    // Report metrics after page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceMonitor?.reportMetrics();
      }, 5000); // Wait 5 seconds after load
    });
  }
  return performanceMonitor;
};

export const getPerformanceMonitor = () => performanceMonitor;

