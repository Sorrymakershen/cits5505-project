/**
 * APIHandler Class
 * Manages all external API interactions including:
 * - GitHub API requests
 * - Image service integration
 * - Error handling and rate limiting
 */
class APIHandler {
    constructor() {
        this.baseURL = 'https://api.github.com';
        this.init();
    }

    /**
     * Initialize API configuration
     * Sets up headers and request options
     */
    init() {
        this.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
    }

    /**
     * Fetch repositories with error handling
     * @param {string} username - GitHub username
     * @returns {Promise} Repository data
     */
    async fetchUserRepos(username) {
        try {
            const response = await fetch(`${this.baseURL}/users/${username}/repos`, {
                method: 'GET',
                headers: this.headers
            });

            if (!response.ok) {
                throw new Error(`Error fetching repositories: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('APIHandler fetchUserRepos error:', error);
            throw error;
        }
    }
}

export default APIHandler;