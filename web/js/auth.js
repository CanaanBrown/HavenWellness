// Haven Wellness Authentication Helper
// Handles session management and authentication state

const Auth = {
    // Session key for localStorage
    SESSION_KEY: 'havenWellnessSession',
    
    /**
     * Save user session to localStorage
     * @param {Object} user - User object with id, name, email and any additional profile data
     */
    saveSession(user) {
        const session = {
            userId: user.id,
            name: user.name,
            email: user.email,
            isAuthenticated: true,
            loginTime: user.loginTime || new Date().toISOString(),
            // Preserve any additional profile data
            age: user.age,
            location: user.location,
            bio: user.bio,
            conditions: user.conditions,
            interests: user.interests
        };
        
        try {
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
            console.log('✅ Session saved for user:', user.name);
        } catch (error) {
            console.error('❌ Failed to save session:', error);
            throw new Error('Failed to save session');
        }
    },
    
    /**
     * Get current session from localStorage
     * @returns {Object|null} Session object or null if not authenticated
     */
    getSession() {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            if (!sessionData) return null;
            
            const session = JSON.parse(sessionData);
            
            // Check if session is still valid (24 hours)
            const loginTime = new Date(session.loginTime);
            const now = new Date();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursSinceLogin > 24) {
                this.clearSession();
                return null;
            }
            
            return session;
        } catch (error) {
            console.error('❌ Failed to get session:', error);
            this.clearSession();
            return null;
        }
    },
    
    /**
     * Clear user session from localStorage
     */
    clearSession() {
        try {
            localStorage.removeItem(this.SESSION_KEY);
            console.log('✅ Session cleared');
        } catch (error) {
            console.error('❌ Failed to clear session:', error);
        }
    },
    
    /**
     * Check if user is currently authenticated
     * @returns {boolean} True if authenticated, false otherwise
     */
    isAuthenticated() {
        const session = this.getSession();
        return session && session.isAuthenticated === true;
    },
    
    /**
     * Get current user ID
     * @returns {number|null} User ID or null if not authenticated
     */
    getCurrentUserId() {
        const session = this.getSession();
        return session ? session.userId : null;
    },
    
    /**
     * Get current user name
     * @returns {string|null} User name or null if not authenticated
     */
    getCurrentUserName() {
        const session = this.getSession();
        return session ? session.name : null;
    },
    
    /**
     * Get current user email
     * @returns {string|null} User email or null if not authenticated
     */
    getCurrentUserEmail() {
        const session = this.getSession();
        return session ? session.email : null;
    },
    
    /**
     * Get current user object with all available data
     * @returns {Object|null} User object or null if not authenticated
     */
    getCurrentUser() {
        const session = this.getSession();
        if (!session) return null;
        
        return {
            id: session.userId,
            name: session.name,
            email: session.email,
            isAuthenticated: session.isAuthenticated,
            loginTime: session.loginTime,
            // Include all profile data
            age: session.age,
            location: session.location,
            bio: session.bio,
            conditions: session.conditions,
            interests: session.interests
        };
    },
    
    /**
     * Logout user and redirect to landing page
     */
    logout() {
        this.clearSession();
        // Trigger app re-render
        if (window.HavenWellnessApp) {
            window.HavenWellnessApp.render();
        }
    },
    
    /**
     * Update user session with new data
     * @param {Object} updates - Object with fields to update
     */
    updateSession(updates) {
        const session = this.getSession();
        if (!session) {
            throw new Error('No active session to update');
        }
        
        const updatedSession = { ...session, ...updates };
        this.saveSession(updatedSession);
    }
};

// Make Auth globally available
window.Auth = Auth;

console.log('✅ Auth helper loaded');
