/**
 * FlipCardController Class
 * Manages interactive card flip animations with:
 * - Mouse/touch interactions
 * - Keyboard accessibility
 * - ARIA attributes for screen readers
 * - Smooth transition effects
 */
class FlipCardController {
    constructor() {
        this.initFlipCards();
        this.initKeyboardControl();
    }

    initFlipCards() {
        document.querySelectorAll('.flip-card-container').forEach(container => {
            const card = container.querySelector('.flip-card');
            const trigger = container.querySelector('.flip-trigger');

            trigger?.addEventListener('click', () => this.toggleFlip(card));
        });
    }

    initKeyboardControl() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const focused = document.activeElement;
                if (focused.classList.contains('flip-trigger')) {
                    const card = focused.closest('.flip-card');
                    this.toggleFlip(card);
                }
            }
        });
    }

    toggleFlip(card) {
        card.classList.toggle('flipped');
        const isFlipped = card.classList.contains('flipped');
        const trigger = card.querySelector('.flip-trigger');
        trigger.setAttribute('aria-label', isFlipped ? 'Show front' : 'Show back');
        trigger.setAttribute('aria-pressed', isFlipped);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlipCardController();
});
