// js/api.js
const API_BASE = "http://localhost:5135/api";

const API = {
  debug: {
    async seedInfo() {
      const res = await fetch(`${API_BASE}/Debug/seed-info`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  },
  users: {
    async list() {
      const res = await fetch(`${API_BASE}/Users`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async create(user) {
      const res = await fetch(`${API_BASE}/Users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  },
  symptoms: {
    async list() {
      const res = await fetch(`${API_BASE}/Symptoms`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async createEntry(entry) {
      const res = await fetch(`${API_BASE}/Symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    async createDetail(detail) {
      const res = await fetch(`${API_BASE}/Symptoms/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(detail),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
  },
    groups: {
        async list() {
            const res = await fetch(`${API_BASE}/Groups`);
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        async create(group) {
            const res = await fetch(`${API_BASE}/Groups`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(group),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        async join(groupId) {
            const res = await fetch(`${API_BASE}/Groups/${groupId}/join`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        async leave(groupId) {
            const res = await fetch(`${API_BASE}/Groups/${groupId}/leave`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        async getMembers(groupId) {
            const res = await fetch(`${API_BASE}/Groups/${groupId}/members`);
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
    
    messages: {
        async getGroupMessages(groupId) {
            const res = await fetch(`${API_BASE}/Messages/group/${groupId}`);
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        async sendGroupMessage(groupId, messageText) {
            const res = await fetch(`${API_BASE}/Messages/group/${groupId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messageText }),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        async getMyGroups() {
            const res = await fetch(`${API_BASE}/Messages/my-groups`);
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
  auth: {
    /**
     * Login user with email and password
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User object
     */
    async login(email, password) {
      try {
        // Get all users to find matching email
        const users = await API.users.list();
        const user = users.find(u => u.email === email);
        
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        // For demo purposes, we'll accept any password
        // In a real app, you'd verify the password hash
        if (!password) {
          throw new Error('Password is required');
        }
        
        // Return user object (without password hash)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          dateJoined: user.dateJoined
        };
      } catch (error) {
        console.error('Login error:', error);
        throw new Error('Login failed. Please check your credentials.');
      }
    },
    
    /**
     * Register new user
     * @param {string} name - User full name
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Created user object
     */
    async register(name, email, password) {
      try {
        // Check if user already exists
        const users = await API.users.list();
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
          throw new Error('An account with this email already exists');
        }
        
        // Create new user
        const userData = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          passwordHash: password // In a real app, this would be hashed
        };
        
        const newUser = await API.users.create(userData);
        
        // Return user object (without password hash)
        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          dateJoined: newUser.dateJoined
        };
      } catch (error) {
        console.error('Registration error:', error);
        if (error.message.includes('already exists')) {
          throw error;
        }
        throw new Error('Registration failed. Please try again.');
      }
    },
    
    /**
     * Get user by email
     * @param {string} email - User email
     * @returns {Promise<Object|null>} User object or null
     */
    async getUserByEmail(email) {
      try {
        const users = await API.users.list();
        return users.find(u => u.email === email.toLowerCase()) || null;
      } catch (error) {
        console.error('Get user by email error:', error);
        return null;
      }
    }
  },
};

// Make it globally available
window.API = API;
window.API_BASE = API_BASE;

console.log("✅ API loaded at", API_BASE);
