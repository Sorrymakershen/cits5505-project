/**
 * CITS5505 Assignment - CV Page JavaScript
 * This file handles the functionality for the CV page,
 * including the AOS animation initialization and 
 * the GitHub repository API integration.
 */
// DOM elements
const $githubUsername = document.getElementById('githubUsername');
const $fetchReposBtn = document.getElementById('fetchReposBtn');
const $reposContainer = document.getElementById('reposContainer');
const $loadingSpinner = document.getElementById('loadingSpinner');
const $profilePlaceholder = document.getElementById('profile-placeholder');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Animate navbar on scroll
    window.addEventListener('scroll', handleNavScroll);
    
    // Initialize AOS animation library with improved settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        offset: 100,
        delay: 100,
        mirror: true // Animations trigger each time the element is scrolled into view
    });
    
    // Generate placeholder profile image if actual image doesn't load
    $profilePlaceholder.addEventListener('error', generatePlaceholderAvatar);
    
    // Add event listener for GitHub username search
    $fetchReposBtn.addEventListener('click', fetchRepositories);
    $githubUsername.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchRepositories();
        }
    });
    
    // Add focus/blur effects for input field
    $githubUsername.addEventListener('focus', handleInputFocus);
    $githubUsername.addEventListener('blur', handleInputBlur);
    
    // Set placeholder image source for demo
    createPlaceholderImage();
    
    // Add scroll animations for timeline/sections
    addScrollAnimations();
});

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
 * Add subtle animations on scroll for various sections
 */
function addScrollAnimations() {
    const sections = document.querySelectorAll('section');
    const timeline = document.querySelectorAll('.timeline-item');
    
    // Track scroll position to add subtle parallax effects
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Subtle parallax effect on sections
        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;
            const speed = section.dataset.speed || 0.1;
            if (top < window.innerHeight && top > -window.innerHeight) {
                section.style.transform = `translateY(${scrollY * speed}px)`;
            }
        });
        
        // Add staggered animation to timeline items
        timeline.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            if (itemTop < window.innerHeight * 0.85 && itemTop > 0) {
                setTimeout(() => {
                    item.classList.add('timeline-visible');
                }, index * 100);
            }
        });
    });
}

/**
 * Handle input field focus with subtle animation
 */
function handleInputFocus(e) {
    const parent = e.target.closest('.card');
    if (parent) {
        parent.style.transform = 'scale(1.01)';
        parent.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.15)';
    }
}

/**
 * Handle input field blur
 */
function handleInputBlur(e) {
    const parent = e.target.closest('.card');
    if (parent) {
        parent.style.transform = '';
        parent.style.boxShadow = '';
    }
}

/**
 * Creates a placeholder image for the profile
 */
function createPlaceholderImage() {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 220;
    canvas.height = 220;
    
    // Get the context
    const ctx = canvas.getContext('2d');
    
    // Fill background with UWA Blue
    ctx.fillStyle = '#003087'; // UWA Blue color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add UWA gold accent
    ctx.fillStyle = '#DAAA00'; // UWA Gold color
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    
    // Draw initial letters
    ctx.font = 'bold 80px Inter, Arial';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('JD', canvas.width / 2, canvas.height / 2 - 10);
    
    // Set as profile image
    $profilePlaceholder.src = canvas.toDataURL('image/png');
}

/**
 * Generates a placeholder avatar if image fails to load
 */
function generatePlaceholderAvatar() {
    createPlaceholderImage();
}

/**
 * Fetches repositories for the entered GitHub username
 * with improved animation and error handling
 */
function fetchRepositories() {
    const username = $githubUsername.value.trim();
    
    if (!username) {
        showError('Please enter a GitHub username');
        shakeElement($githubUsername);
        return;
    }
    
    // Disable button and add loading state
    $fetchReposBtn.disabled = true;
    $fetchReposBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Fetching...';
    
    // Show loading spinner with fade
    $loadingSpinner.style.opacity = '0';
    $loadingSpinner.classList.remove('d-none');
    setTimeout(() => {
        $loadingSpinner.style.opacity = '1';
    }, 10);
    
    // Fade out existing content
    if ($reposContainer.innerHTML.trim() !== '') {
        $reposContainer.style.opacity = '0';
        setTimeout(() => {
            $reposContainer.innerHTML = '';
        }, 300);
    }
    
    // Fetch repositories from GitHub API
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(repositories => {
            // Hide loading spinner with fade
            $loadingSpinner.style.opacity = '0';
            setTimeout(() => {
                $loadingSpinner.classList.add('d-none');
                
                // Re-enable button and restore text
                $fetchReposBtn.disabled = false;
                $fetchReposBtn.innerHTML = 'Fetch Repositories';
                
                // Display repositories with staggered animation
                displayRepositories(repositories);
            }, 300);
        })
        .catch(error => {
            // Hide loading spinner with fade
            $loadingSpinner.style.opacity = '0';
            setTimeout(() => {
                $loadingSpinner.classList.add('d-none');
                
                // Re-enable button and restore text
                $fetchReposBtn.disabled = false;
                $fetchReposBtn.innerHTML = 'Fetch Repositories';
                
                // Show error message
                showError(`Failed to fetch repositories: ${error.message}`);
            }, 300);
        });
}

/**
 * Displays repositories in the container with staggered animations
 * @param {Array} repositories - Array of repository objects
 */
function displayRepositories(repositories) {
    if (repositories.length === 0) {
        $reposContainer.style.opacity = '0';
        setTimeout(() => {
            $reposContainer.innerHTML = `
                <div class="alert alert-info animate-fadeInUp" role="alert">
                    <i class="fas fa-info-circle me-2"></i>
                    No public repositories found for this user.
                </div>
            `;
            $reposContainer.style.opacity = '1';
        }, 300);
        return;
    }
    
    let html = '<div class="list-group">';
    
    repositories.forEach((repo, index) => {
        // Format date
        const updatedDate = new Date(repo.updated_at).toLocaleDateString();
        
        // Get topic colors - use UWA colors for accents
        const languageColor = getLanguageColor(repo.language);
        
        html += `
            <div class="repo-item animate-fadeInUp" style="animation-delay: ${index * 100}ms;">
                <div class="repo-name">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                        ${repo.name}
                    </a>
                </div>
                <p class="repo-description">
                    ${repo.description || 'No description available'}
                </p>
                <div class="repo-meta">
                    ${repo.language ? 
                        `<span><span class="language-color" style="background-color: ${languageColor};"></span> ${repo.language}</span>` : ''}
                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span><i class="fas fa-clock"></i> Updated on ${updatedDate}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Set HTML with fade animation
    $reposContainer.style.opacity = '0';
    setTimeout(() => {
        $reposContainer.innerHTML = html;
        $reposContainer.style.opacity = '1';
    }, 300);
}

/**
 * Returns a color for a programming language
 * @param {string} language - Programming language name
 * @return {string} - Hex color code
 */
function getLanguageColor(language) {
    if (!language) return '#ccc';
    
    // Common language colors (with UWA blue and gold for some)
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C#': '#178600',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Swift': '#F05138',
        'Kotlin': '#A97BFF',
        'Rust': '#dea584',
        'C++': '#f34b7d',
        'C': '#555555',
        'Shell': '#89e051',
        'R': '#198CE7',
        'Dart': '#00B4AB',
        'Jupyter Notebook': '#DA5B0B',
        'Scala': '#c22d40',
        'Haskell': '#5e5086',
        'Vue': '#41b883',
        'React': '#61dafb',
        'Angular': '#dd1b16'
    };
    
    // Return color or default UWA blue if not found
    return colors[language] || '#003087';
}

/**
 * Shows an error message in the repositories container with improved styling
 * @param {string} message - The error message to display
 */
function showError(message) {
    $reposContainer.style.opacity = '0';
    setTimeout(() => {
        $reposContainer.innerHTML = `
            <div class="alert alert-danger animate-fadeInUp" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
        $reposContainer.style.opacity = '1';
    }, 300);
}

/**
 * Shake element for error indication
 * @param {HTMLElement} element - Element to shake
 */
function shakeElement(element) {
    element.classList.add('shake-animation');
    setTimeout(() => {
        element.classList.remove('shake-animation');
    }, 600);
}

// Add CSS for new animations
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        /* Timeline visibility animation */
        .timeline-item {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .timeline-item.timeline-visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Shake animation for error */
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake-animation {
            animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        /* Language color dot */
        .language-color {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 5px;
        }
        
        /* Navbar scrolled style */
        .navbar-scrolled {
            background: rgba(0, 48, 135, 0.98) !important;
            padding: 10px 0 !important;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2) !important;
        }
        
        /* Input field transitions */
        #githubUsername {
            transition: all 0.3s ease;
        }
        #githubUsername:focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 0.2rem rgba(0, 48, 135, 0.25);
        }
        
        /* Card transitions */
        .card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        /* Add smooth reveal for repository items */
        .repo-item {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

/**
 * CV Page Controller
 * Manages all interactive features of the CV page including:
 * - Profile information management
 * - GitHub repository fetching
 * - Skills visualization
 * - Animation controls
 */
class CVController {
    constructor() {
        this.initializeComponents();
        this.bindEventListeners();
    }

    /**
     * Initialize all page components
     * Sets up charts, animations and data fetching
     */
    initializeComponents() {
        // ...existing code...
    }

    /**
     * Fetch and display GitHub repositories
     * @param {string} username - GitHub username to fetch repos for
     */
    async fetchGitHubRepos(username) {
        // ...existing code...
    }
}