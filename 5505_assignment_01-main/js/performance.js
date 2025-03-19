/**
 * PerformanceOptimizer Class
 * Handles various performance optimizations including:
 * - Image lazy loading
 * - Event debouncing
 * - Resource hints
 * - Performance monitoring
 */
class PerformanceOptimizer {
    constructor() {
        this.initLazyLoading();
        this.initImageOptimization();
        this.debouncedEvents();
        this.initResourceHints();
    }

    /**
     * Initialize lazy loading for images using Intersection Observer
     * Improves initial page load time by deferring off-screen images
     */
    initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Optimize image loading attributes
     * Sets async decoding and native lazy loading where supported
     */
    initImageOptimization() {
        document.querySelectorAll('img').forEach(img => {
            img.decoding = 'async';
            if (!img.hasAttribute('loading')) {
                img.loading = 'lazy';
            }
        });
    }

    /**
     * Setup debounced event handlers for better performance
     * Prevents excessive event firing during scroll/resize
     */
    debouncedEvents() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resize-disable-transitions');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('resize-disable-transitions');
            }, 400);
        });

        const scrollHandler = this.debounce(() => {
            requestAnimationFrame(() => {
                // 处理滚动相关的视觉更新
            });
        }, 20);

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    initResourceHints() {
        // 预加载关键资源
        this.addPreloadLink('css/styles.css', 'style');
        this.addPreloadLink('js/main.js', 'script');
        
        // 预连接到第三方域名
        this.addPreconnect('https://fonts.googleapis.com');
        this.addPreconnect('https://cdn.jsdelivr.net');
    }

    addPreloadLink(href, as) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = as;
        link.href = href;
        document.head.appendChild(link);
    }

    addPreconnect(url) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = url;
        document.head.appendChild(link);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// 初始化性能优化
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});
