/**
 * CITS5505 Assignment - Best Practices Page JavaScript
 * This file handles the functionality of the best practices page,
 * including local storage for saving checked practices and AJAX requests
 * for fetching a cute animal image when the success criteria is met.
 */

// Array of best practices with titles and descriptions
const bestPractices = [
    {
        id: 'semantic-html',
        title: 'Use Semantic HTML Elements',
        description: 'Semantic HTML elements clearly describe their meaning to both the browser and the developer. They improve accessibility, SEO, and make your code more readable.'
    },
    {
        id: 'responsive-design',
        title: 'Implement Responsive Design',
        description: 'Design your website to look and function well on various screen sizes and devices. Use media queries, flexible grid layouts, and responsive images.'
    },
    {
        id: 'css-organization',
        title: 'Organize CSS with a Methodology',
        description: 'Use methodologies like BEM, SMACSS, or OOCSS to structure your CSS in a scalable and maintainable way, reducing specificity conflicts and improving readability.'
    },
    {
        id: 'accessibility',
        title: 'Ensure Web Accessibility',
        description: 'Make your website accessible to all users, including those with disabilities, by following WCAG guidelines. Use proper heading structure, alt text for images, and ARIA attributes when necessary.'
    },
    {
        id: 'perf-optimization',
        title: 'Optimize Performance',
        description: 'Optimize loading speed by minimizing HTTP requests, compressing assets, using lazy loading, and implementing proper caching techniques.'
    },
    {
        id: 'clean-js',
        title: 'Write Clean JavaScript Code',
        description: 'Follow principles like DRY (Don\'t Repeat Yourself), modularize your code, use modern ES6+ features, and add meaningful comments for better maintainability.'
    },
    {
        id: 'version-control',
        title: 'Use Version Control',
        description: 'Implement a version control system like Git to track changes, collaborate with others, and maintain code history.'
    },
    {
        id: 'browser-compatibility',
        title: 'Ensure Cross-Browser Compatibility',
        description: 'Test your website across multiple browsers and versions to ensure consistent behavior. Use feature detection and polyfills when necessary.'
    },
    {
        id: 'mobile-first',
        title: 'Apply Mobile-First Approach',
        description: 'Design for mobile devices first, then progressively enhance for larger screens. This ensures better performance and user experience on mobile devices.'
    },
    {
        id: 'seo-practices',
        title: 'Implement SEO Best Practices',
        description: 'Optimize your website for search engines by using proper meta tags, structured data, semantic HTML, and optimizing page load speed.'
    },
    {
        id: 'security-measures',
        title: 'Implement Security Measures',
        description: 'Protect against common vulnerabilities like XSS and CSRF attacks, use HTTPS, sanitize user inputs, and follow security best practices.'
    },
    {
        id: 'code-comments',
        title: 'Add Descriptive Comments',
        description: 'Include meaningful comments to explain complex code, functionality, and the reason behind implementation decisions for better team collaboration.'
    },
    {
        id: 'progressive-enhancement',
        title: 'Use Progressive Enhancement',
        description: 'Build a basic, functional experience first, then add advanced features for modern browsers while maintaining functionality for all users.'
    },
    {
        id: 'css-variables',
        title: 'Use CSS Custom Properties (Variables)',
        description: 'Leverage CSS variables for easier theming, maintenance, and consistency across your stylesheets.'
    },
    {
        id: 'code-linting',
        title: 'Implement Code Linting',
        description: 'Use linting tools like ESLint, Stylelint, or HTMLHint to enforce coding standards and catch errors early in development.'
    }
];

// Constants
const STORAGE_KEY = 'bestPracticesChecked';
const SUCCESS_THRESHOLD = 12;
const TOTAL_PRACTICES = bestPractices.length;

// DOM elements
const $practicesList = document.getElementById('practicesList');
const $progressBar = document.getElementById('progressBar');
const $summaryText = document.getElementById('summaryText');
const $rewardContainer = document.getElementById('rewardContainer');
const $animalImage = document.getElementById('animalImage');
const $newRewardBtn = document.getElementById('newRewardBtn');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Animate navbar on scroll
    window.addEventListener('scroll', handleNavScroll);
    
    // Render the best practices list
    renderPracticesList();
    
    // Load saved checkboxes from local storage
    loadSavedPractices();
    
    // Update summary based on initial state
    updateSummary();
    
    // Add event listener for new reward button
    $newRewardBtn.addEventListener('click', fetchCuteAnimal);
    
    // Add initial fade in animation for the content
    animatePageLoad();
});

/**
 * Animates elements on page load
 */
function animatePageLoad() {
    const header = document.querySelector('.hero');
    const practicesSection = document.querySelector('.best-practices');
    const summarySection = document.querySelector('.summary');
    
    // Add staggered animations for sections
    setTimeout(() => {
        header.classList.add('visible');
    }, 100);
    
    setTimeout(() => {
        practicesSection.classList.add('visible');
    }, 300);
    
    setTimeout(() => {
        summarySection.classList.add('visible');
    }, 500);
}

/**
 * Handles navbar appearance on scroll
 */
function handleNavScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}

/**
 * Renders the list of best practices with checkboxes
 */
function renderPracticesList() {
    let html = '';
    
    bestPractices.forEach((practice, index) => {
        html += `
            <div class="practice-item animate-fadeInUp" 
                 id="${practice.id}-item" 
                 data-index="${index}"
                 style="animation-delay: ${index * 0.1}s">
                <div class="practice-title">
                    <div class="form-check">
                        <input class="form-check-input practice-checkbox" type="checkbox" 
                               id="${practice.id}" data-practice-id="${practice.id}">
                        <label class="form-check-label" for="${practice.id}">
                            ${practice.title}
                        </label>
                    </div>
                </div>
                <p class="practice-description">${practice.description}</p>
            </div>
        `;
    });
    
    $practicesList.innerHTML = html;
    
    // Add event listeners to checkboxes and items
    document.querySelectorAll('.practice-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
    
    // Add hover effect listeners with more refined interactions
    document.querySelectorAll('.practice-item').forEach(item => {
        item.addEventListener('mouseenter', handleItemHover);
        item.addEventListener('mouseleave', handleItemLeave);
        item.addEventListener('click', handleItemClick);
    });
}

/**
 * Handles hover effect on practice items
 */
function handleItemHover(e) {
    const items = document.querySelectorAll('.practice-item');
    const hoveredIndex = parseInt(e.currentTarget.dataset.index);
    
    items.forEach((item, index) => {
        const distance = Math.abs(index - hoveredIndex);
        const opacity = 1 - (distance * 0.1);
        const scale = 1 - (distance * 0.01);
        
        if (item !== e.currentTarget) {
            item.style.transform = `scale(${scale})`;
            item.style.opacity = Math.max(opacity, 0.6);
            item.style.filter = 'blur(1px)';
        }
    });
    
    e.currentTarget.style.transform = 'scale(1.02) translateY(-5px)';
    e.currentTarget.style.zIndex = '5';
    e.currentTarget.style.filter = 'blur(0)';
    e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.12)';
    
    // Subtle border color change for focus
    e.currentTarget.style.borderLeftColor = 'var(--accent-color)';
}

/**
 * Handles item leave effect
 */
function handleItemLeave(e) {
    const items = document.querySelectorAll('.practice-item');
    items.forEach(item => {
        item.style.transform = '';
        item.style.opacity = '';
        item.style.zIndex = '';
        item.style.filter = '';
        item.style.boxShadow = '';
        item.style.borderLeftColor = '';
    });
}

/**
 * Handles click on practice items (focus on checkbox)
 */
function handleItemClick(e) {
    // Don't trigger if the click was on the checkbox directly
    if (e.target.type !== 'checkbox' && e.target.className !== 'form-check-label') {
        const checkbox = e.currentTarget.querySelector('.practice-checkbox');
        checkbox.checked = !checkbox.checked;
        
        // Dispatch change event to trigger handler
        const event = new Event('change');
        checkbox.dispatchEvent(event);
        
        // Add subtle "click" effect
        e.currentTarget.style.transform = 'scale(0.98)';
        setTimeout(() => {
            e.currentTarget.style.transform = '';
        }, 150);
    }
}

/**
 * Handles checkbox state changes
 * @param {Event} e - The change event object
 */
function handleCheckboxChange(e) {
    const practiceId = e.target.dataset.practiceId;
    const isChecked = e.target.checked;
    const practiceItem = document.getElementById(`${practiceId}-item`);
    
    // Add visual feedback when checking
    if (isChecked) {
        practiceItem.classList.add('checked');
    } else {
        practiceItem.classList.remove('checked');
    }
    
    // Animate the item
    animateCheckboxChange(practiceItem, isChecked);
    
    // Save to local storage
    saveToLocalStorage(practiceId, isChecked);
    
    // Update the summary with smoother animation
    updateSummary();
}

/**
 * Animates checkbox state change
 * @param {HTMLElement} item - The practice item element
 * @param {boolean} isChecked - Whether the practice is checked
 */
function animateCheckboxChange(item, isChecked) {
    // Reset any existing animations
    item.style.animation = 'none';
    item.offsetHeight; // Trigger reflow
    
    if (isChecked) {
        item.style.animation = 'checkPulse 0.5s ease forwards';
    } else {
        item.style.animation = 'uncheckPulse 0.5s ease forwards';
    }
}

/**
 * Saves the checkbox state to local storage
 * @param {string} practiceId - The ID of the practice
 * @param {boolean} isChecked - Whether the practice is checked
 */
function saveToLocalStorage(practiceId, isChecked) {
    // Get current saved practices
    const savedPractices = getSavedPractices();
    
    // Update the saved practices
    if (isChecked) {
        if (!savedPractices.includes(practiceId)) {
            savedPractices.push(practiceId);
        }
    } else {
        const index = savedPractices.indexOf(practiceId);
        if (index !== -1) {
            savedPractices.splice(index, 1);
        }
    }
    
    // Save back to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedPractices));
}

/**
 * Gets saved practices from local storage
 * @returns {Array} - Array of saved practice IDs
 */
function getSavedPractices() {
    const savedPractices = localStorage.getItem(STORAGE_KEY);
    return savedPractices ? JSON.parse(savedPractices) : [];
}

/**
 * Loads saved practices from local storage and updates checkboxes
 */
function loadSavedPractices() {
    const savedPractices = getSavedPractices();
    
    // Update checkboxes based on saved practices
    savedPractices.forEach(practiceId => {
        const checkbox = document.getElementById(practiceId);
        const practiceItem = document.getElementById(`${practiceId}-item`);
        
        if (checkbox) {
            checkbox.checked = true;
            
            if (practiceItem) {
                practiceItem.classList.add('checked');
            }
        }
    });
}

/**
 * Updates the summary section based on checked practices
 */
function updateSummary() {
    const savedPractices = getSavedPractices();
    const checkedCount = savedPractices.length;
    const percentage = Math.round((checkedCount / TOTAL_PRACTICES) * 100);
    
    // 使用新的深蓝色渐变进度条样式
    $progressBar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
    $progressBar.style.width = `${percentage}%`;
    $progressBar.setAttribute('aria-valuenow', percentage);
    $progressBar.textContent = `${percentage}%`;
    
    // 更新摘要文本
    const oldText = $summaryText.textContent;
    const newText = `You have selected ${checkedCount} out of ${TOTAL_PRACTICES} best practices.`;
    if (oldText !== newText) {
        $summaryText.style.opacity = '0';
        $summaryText.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            $summaryText.textContent = newText;
            $summaryText.style.opacity = '1';
            $summaryText.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // 检查是否达到成功标准
    if (checkedCount >= SUCCESS_THRESHOLD) {
        if ($rewardContainer.classList.contains('d-none')) {
            $rewardContainer.classList.remove('d-none');
            $rewardContainer.style.opacity = '0';
            $rewardContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                $rewardContainer.style.opacity = '1';
                $rewardContainer.style.transform = 'translateY(0)';
                fetchCuteAnimal();
            }, 300);
        }
    } else {
        if (!$rewardContainer.classList.contains('d-none')) {
            $rewardContainer.style.opacity = '0';
            $rewardContainer.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                $rewardContainer.classList.add('d-none');
            }, 300);
        }
    }
}

// Utility function to adjust color brightness
function adjustBrightness(hex, percent) {
    // Handle named colors
    if (hex.startsWith('var(--')) {
        // For CSS variables, just return them
        return hex;
    }
    
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

/**
 * Fetches a cute animal image from an API with improved animations
 */
function fetchCuteAnimal() {
    // Show loading spinner with fade effect
    $animalImage.innerHTML = `
        <div class="spinner-container animate-fadeInUp">
            <div class="spinner-border text-primary animate-pulse" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Fetching a cute animal for you...</p>
        </div>
    `;
    
    // Fetch random image from Dog API (public API)
    fetch('https://dog.ceo/api/breeds/image/random')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const img = new Image();
            img.src = data.message;
            img.onload = () => {
                // First fade out existing content
                const currentContent = $animalImage.querySelector('.spinner-container');
                if (currentContent) {
                    currentContent.style.opacity = '0';
                    currentContent.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        // Then fade in new image
                        $animalImage.innerHTML = `
                            <div class="animate-fadeInUp">
                                <img src="${data.message}" alt="Cute dog as a reward" 
                                     class="img-fluid animate-float" 
                                     style="border-radius: var(--border-radius); box-shadow: var(--box-shadow);">
                                <p class="text-muted mt-2">A reward for following best practices!</p>
                            </div>
                        `;
                    }, 300);
                }
            };
        })
        .catch(error => {
            console.error('Error fetching cute animal:', error);
            $animalImage.innerHTML = `
                <div class="alert alert-warning animate-fadeInUp" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Sorry, we couldn't fetch a cute animal right now. Please try again later.
                </div>
            `;
        });
}

/**
 * BestPracticesManager Class
 * Manages the best practices checklist and progress tracking
 * Features:
 * - Practice item state management
 * - Progress calculation and visualization
 * - Local storage integration
 * - Reward system implementation
 */
class BestPracticesManager {
    constructor() {
        this.initializeState();
        this.bindEvents();
        this.loadSavedProgress();
    }

    // ... existing code ...

    /**
     * Calculate and update progress
     * Updates progress bar and summary text
     * Triggers reward system when threshold is met
     */
    updateProgress() {
        // ... existing code ...
    }

    /**
     * Save progress to local storage
     * Ensures progress persistence across sessions
     */
    saveProgress() {
        // ... existing code ...
    }
}