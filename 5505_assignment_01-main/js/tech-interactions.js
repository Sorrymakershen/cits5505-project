/**
 * TechInteractions Class
 * Handles advanced UI interactions and effects
 * Features:
 * - Parallax scrolling
 * - Mouse tracking effects
 * - Scroll progress visualization
 */
class TechInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.initParallax();
        this.initMouseTracker();
        this.initScrollProgress();
    }

    initParallax() {
        document.querySelectorAll('.parallax-element').forEach(element => {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = element.dataset.rate || 0.5;
                element.style.transform = `translate3d(0, ${scrolled * rate}px, 0)`;
            });
        });
    }

    initMouseTracker() {
        const tracker = document.createElement('div');
        tracker.className = 'mouse-tracker';
        document.body.appendChild(tracker);

        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                tracker.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            });
        });
    }

    initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;

        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new TechInteractions();
});
