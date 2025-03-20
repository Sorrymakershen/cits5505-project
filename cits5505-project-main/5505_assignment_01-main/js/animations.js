/**
 * AdvancedAnimations Class
 * Handles all website animations and transitions
 * Uses IntersectionObserver for performance-optimized scroll animations
 */
class AdvancedAnimations {
    constructor() {
        this.initIntersectionObserver();
        this.initScrollAnimations();
    }

    /**
     * Initialize IntersectionObserver for scroll-based animations
     * Ensures animations only trigger when elements are in viewport
     */
    initIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Initialize scroll-based animations
     * Uses requestAnimationFrame for smooth performance
     */
    initScrollAnimations() {
        window.addEventListener('scroll', () => {
            requestAnimationFrame(this.handleScrollAnimations.bind(this));
        });
    }

    handleScrollAnimations() {
        const scrolled = window.scrollY;
        document.querySelectorAll('.parallax-scroll').forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdvancedAnimations();
});
