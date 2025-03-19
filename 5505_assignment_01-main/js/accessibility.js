/**
 * AccessibilityEnhancer Class
 * Improves website accessibility through:
 * - ARIA attribute management
 * - Keyboard navigation support
 * - Focus management
 * - Screen reader optimization
 */
class AccessibilityEnhancer {
    constructor() {
        this.initAccessibility();
        this.setupKeyboardNav();
    }

    /**
     * Initialize accessibility features
     * Sets up ARIA labels and roles
     */
    initAccessibility() {
        // Add ARIA labels to interactive elements
        document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
            if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
                el.setAttribute('aria-label', el.innerText || el.value || el.placeholder || 'Interactive element');
            }
        });

        // Add roles to elements
        document.querySelectorAll('nav').forEach(el => el.setAttribute('role', 'navigation'));
        document.querySelectorAll('header').forEach(el => el.setAttribute('role', 'banner'));
        document.querySelectorAll('main').forEach(el => el.setAttribute('role', 'main'));
        document.querySelectorAll('footer').forEach(el => el.setAttribute('role', 'contentinfo'));
    }

    /**
     * Setup keyboard navigation
     * Implements focus trapping and keyboard shortcuts
     */
    setupKeyboardNav() {
        // Focus trapping for modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    const focusableElements = modal.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        });

        // Keyboard shortcuts for navigation
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === '1') {
                document.querySelector('nav a[href="index.html"]').focus();
            } else if (e.altKey && e.key === '2') {
                document.querySelector('nav a[href="cv.html"]').focus();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityEnhancer();
});