// Haven Wellness SPA Controller
// Main application controller following .cursorrules guidelines

class HavenWellnessApp {
    constructor() {
        this.currentView = 'landing';
        this.currentSection = 'dashboard';
        this.isAuthenticated = false;
        this.init();
    }
    
    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.render();
    }
    
    checkAuth() {
        this.isAuthenticated = Auth.isAuthenticated();
        if (this.isAuthenticated) {
            this.currentView = 'dashboard';
        } else {
            this.currentView = 'landing';
        }
    }
    
    setupEventListeners() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            this.handleRoute(e.state);
        });
        
        // Handle hash changes
        window.addEventListener('hashchange', (e) => {
            this.handleRoute();
        });
    }
    
    handleRoute(state = null) {
        const hash = window.location.hash.substring(1);
        const route = hash || 'landing';
        
        switch (route) {
            case 'auth':
                this.showAuth();
                break;
            case 'dashboard':
                if (this.isAuthenticated) {
                    this.showDashboard();
                } else {
                    this.showAuth();
                }
                break;
            case 'symptoms':
                if (this.isAuthenticated) {
                    this.showSymptoms();
                } else {
                    this.showAuth();
                }
                break;
            case 'groups':
                if (this.isAuthenticated) {
                    this.showGroups();
                } else {
                    this.showAuth();
                }
                break;
            case 'analytics':
                if (this.isAuthenticated) {
                    this.showAnalytics();
                } else {
                    this.showAuth();
                }
                break;
            case 'chats':
                if (this.isAuthenticated) {
                    this.showChats();
                } else {
                    this.showAuth();
                }
                break;
            case 'pairing':
                if (this.isAuthenticated) {
                    this.showPairing();
                } else {
                    this.showAuth();
                }
                break;
            default:
                this.showLanding();
        }
    }
    
    render() {
        const app = document.getElementById('app');
        if (!app) return;
        
        // Clear app content
        app.innerHTML = '';
        
        // Render current view
        switch (this.currentView) {
            case 'landing':
                app.innerHTML = Views.landing();
                this.attachLandingEventListeners();
                break;
            case 'auth':
                app.innerHTML = Views.auth();
                this.attachAuthEventListeners();
                break;
            case 'dashboard':
                app.innerHTML = Views.dashboard();
                this.attachDashboardEventListeners();
                this.loadDashboardContent();
                break;
            case 'profilePage':
                console.log('Rendering profile page...');
                console.log('Views object available:', typeof Views);
                console.log('Views.profilePage available:', typeof Views.profilePage);
                
                if (!Views || !Views.profilePage) {
                    console.error('Views or Views.profilePage not available!');
                    app.innerHTML = '<div class="alert alert-danger">Profile page not available</div>';
                    break;
                }
                
                const profilePageHTML = Views.profilePage();
                console.log('Profile page HTML length:', profilePageHTML.length);
                console.log('Profile page HTML contains profilePageName:', profilePageHTML.includes('profilePageName'));
                
                app.innerHTML = profilePageHTML;
                
                console.log('Profile page HTML set, app content length:', app.innerHTML.length);
                
                // Load profile data after DOM is updated with retry mechanism
                setTimeout(() => {
                    this.loadProfilePageData();
                    this.setupProfilePageForm();
                }, 300);
                break;
        }
    }
    
    // Navigation Methods
    showLanding() {
        this.currentView = 'landing';
        this.render();
        this.updateURL('landing');
    }
    
    showAuth() {
        this.currentView = 'auth';
        this.render();
        this.updateURL('auth');
    }
    
    showDashboard() {
        if (!this.isAuthenticated) {
            this.showAuth();
      return;
        }
        this.currentView = 'dashboard';
        this.currentSection = 'dashboard';
        this.render();
        this.updateURL('dashboard');
    }
    
    showSymptoms() {
        if (!this.isAuthenticated) {
            this.showAuth();
            return;
        }
        this.currentView = 'dashboard';
        this.currentSection = 'symptoms';
        this.render();
        this.loadSectionContent('symptoms');
        this.updateURL('symptoms');
    }
    
    showGroups() {
        if (!this.isAuthenticated) {
            this.showAuth();
            return;
        }
        this.currentView = 'dashboard';
        this.currentSection = 'groups';
        
        // Only render if we're not already in dashboard view
        if (document.getElementById('app').innerHTML === '' || !document.getElementById('dashboardContent')) {
            this.render();
        }
        
        this.loadSectionContent('groups');
        this.updateURL('groups');
        this.loadGroups();
    }
    
    showSection(section) {
        if (!this.isAuthenticated) {
            this.showAuth();
            return;
        }
        this.currentView = 'dashboard';
        this.currentSection = section;
        
        // Only render if we're not already in dashboard view
        if (document.getElementById('app').innerHTML === '' || !document.getElementById('dashboardContent')) {
            this.render();
        }
        
        this.loadSectionContent(section);
        this.updateURL(section);
    }
    
    showProfile() {
        console.log('showProfile called, isAuthenticated:', this.isAuthenticated);
        
        if (!this.isAuthenticated) {
            this.showAuth();
            return;
        }
        this.currentView = 'dashboard';
        this.currentSection = 'profile';
        
        // Only render if we're not already in dashboard view
        if (document.getElementById('app').innerHTML === '' || !document.getElementById('dashboardContent')) {
            console.log('Rendering dashboard...');
            this.render();
        }
        
        console.log('Loading profile section content...');
        this.loadSectionContent('profile');
        this.updateURL('profile');
    }
    
    showProfilePage() {
        console.log('showProfilePage called, isAuthenticated:', this.isAuthenticated);
        
        if (!this.isAuthenticated) {
            this.showAuth();
            return;
        }
        
        this.currentView = 'profilePage';
        this.render();
        this.updateURL('profile');
        
        // Debug: Check if profile page elements exist after render
        setTimeout(() => {
            console.log('Checking profile page elements after render...');
            console.log('profilePageName exists:', !!document.getElementById('profilePageName'));
            console.log('profilePageEmail exists:', !!document.getElementById('profilePageEmail'));
            console.log('profilePageForm exists:', !!document.getElementById('profilePageForm'));
            
            this.loadProfilePageData();
            this.setupProfilePageForm();
        }, 300);
    }
    
    showCreateGroup() {
        if (!this.isAuthenticated) {
            this.showAuth();
            return;
        }
        this.currentView = 'dashboard';
        this.currentSection = 'createGroup';
        this.render();
        this.loadSectionContent('createGroup');
        this.updateURL('createGroup');
    }
    
    async loadGroups() {
        try {
            console.log('Loading groups...');
            const groups = await API.groups.list();
            console.log('Groups loaded:', groups);
            console.log('Number of groups:', groups.length);
            this.renderGroupsList(groups);
            console.log('Groups list rendered');
        } catch (error) {
            console.error('Error loading groups:', error);
            this.renderGroupsList([]);
        }
    }
    
    renderGroupsList(groups) {
        console.log('Rendering groups list with', groups.length, 'groups');
        const groupsList = document.getElementById('groupsList');
        if (!groupsList) {
            console.error('Groups list element not found!');
            return;
        }
        
        if (groups.length === 0) {
            groupsList.innerHTML = `
                <div class="text-center py-5">
                    <div class="mb-3" style="font-size: 3rem; color: #f59e0b;">👥</div>
                    <h4 style="color: #fef3c7;">No groups found</h4>
                    <p style="color: #fbbf24;">Be the first to create a support group!</p>
                    <button class="btn btn-primary" onclick="showCreateGroup()" 
                            style="background: #d97706; border-color: #d97706;">
                        <i class="fas fa-plus me-2"></i>Create Group
                    </button>
                </div>
            `;
            return;
        }
        
        const groupsHtml = groups.map(group => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title mb-0" style="color: #fef3c7;">${group.groupName}</h5>
                            <span class="badge" style="background: #d97706; color: white;">${group.category || 'General'}</span>
                        </div>
                        <p class="card-text flex-grow-1" style="color: #fbbf24;">${group.description}</p>
                        
                        ${group.tags && group.tags.length > 0 ? `
                            <div class="mb-3">
                                <div class="d-flex flex-wrap gap-1">
                                    ${group.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).map(tag => `
                                        <span class="badge" style="background: rgba(217, 119, 6, 0.2); color: #f59e0b; border: 1px solid #d97706;">
                                            ${tag}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                           <div class="d-flex justify-content-between align-items-center">
                               <small class="text-muted" style="color: #a16207;">
                                   <i class="fas fa-users me-1"></i>${group.memberCount || 0} members
                                   ${group.userRole === 'Owner' ? '<span class="badge ms-2" style="background: #d97706; color: white;">Owner</span>' : ''}
                               </small>
                               ${group.isMember ? 
                                   (group.userRole === 'Owner' ? 
                                       '<button class="btn btn-sm btn-outline-warning" onclick="manageGroup(' + group.id + ')" style="border-color: #f59e0b; color: #f59e0b;">Manage</button>' :
                                       '<button class="btn btn-sm btn-outline-danger" onclick="leaveGroup(' + group.id + ')" style="border-color: #dc2626; color: #dc2626;">Leave</button>'
                                   ) : 
                                   '<button class="btn btn-sm btn-outline-primary" onclick="joinGroup(' + group.id + ')" style="border-color: #d97706; color: #d97706;">Join Group</button>'
                               }
                           </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        groupsList.innerHTML = `<div class="row">${groupsHtml}</div>`;
    }
    
    async handleCreateGroup(event) {
        event.preventDefault();
        
        const tagsInput = document.getElementById('groupTags').value;
        const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0).join(', ') : '';
        
        const formData = {
            groupName: document.getElementById('groupName').value,
            description: document.getElementById('groupDescription').value,
            category: document.getElementById('groupCategory').value,
            tags: tags,
            isPrivate: document.getElementById('isPrivate').checked
        };
        
        console.log('Creating group with data:', formData);
        
        try {
            console.log('Creating group...');
            const newGroup = await API.groups.create(formData);
            console.log('Group created successfully:', newGroup);
            
            // Clear the form
            document.getElementById('createGroupForm').reset();
            
            // Ensure user is still authenticated
            this.checkAuth();
            console.log('User authenticated:', this.isAuthenticated);
            console.log('Current view:', this.currentView);
            
            // First ensure we're in dashboard view, then show groups
            if (this.currentView !== 'dashboard') {
                this.showDashboard();
            }
            
            // Navigate to groups section and refresh the list
            this.currentSection = 'groups';
            this.loadSectionContent('groups');
            this.updateURL('groups');
            this.loadGroups();
            this.showNotification('Group created successfully!', 'success');
            
            console.log('Group creation flow completed');
        } catch (error) {
            console.error('Error creating group:', error);
            this.showNotification('Failed to create group. Please try again.', 'error');
        }
    }
    
    async joinGroup(groupId) {
        try {
            await API.groups.join(groupId);
            this.showNotification('Successfully joined the group!', 'success');
            this.loadGroups(); // Refresh the groups list
            
            // If we're currently viewing chats, refresh the chat list too
            if (this.currentSection === 'chats') {
                this.loadGroupChats();
            }
        } catch (error) {
            console.error('Error joining group:', error);
            this.showNotification('Failed to join group. Please try again.', 'error');
        }
    }
    
    async leaveGroup(groupId) {
        try {
            await API.groups.leave(groupId);
            this.showNotification('Successfully left the group!', 'success');
            this.loadGroups(); // Refresh the groups list
            
            // If we're currently viewing chats, refresh the chat list too
            if (this.currentSection === 'chats') {
                this.loadGroupChats();
            }
        } catch (error) {
            console.error('Error leaving group:', error);
            this.showNotification('Failed to leave group. Please try again.', 'error');
        }
    }
    
    manageGroup(groupId) {
        // For now, just show a message. In the future, this could open a group management interface
        this.showNotification('Group management features coming soon!', 'info');
    }
    
    filterGroups() {
        const searchTerm = document.getElementById('groupSearch')?.value.toLowerCase() || '';
        const filterType = document.getElementById('groupFilter')?.value || 'all';
        
        // Get all groups and filter them
        this.loadGroups().then(() => {
            const groupCards = document.querySelectorAll('#groupsList .col-md-6');
            groupCards.forEach(card => {
                const groupName = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                const groupDescription = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
                const groupTags = Array.from(card.querySelectorAll('.badge')).map(badge => badge.textContent.toLowerCase()).join(' ');
                
                const matchesSearch = !searchTerm || 
                    groupName.includes(searchTerm) || 
                    groupDescription.includes(searchTerm) ||
                    groupTags.includes(searchTerm);
                
                const matchesFilter = filterType === 'all' || 
                    (filterType === 'my-groups' && card.querySelector('.btn').textContent.includes('Leave')) ||
                    (filterType === 'available' && card.querySelector('.btn').textContent.includes('Join'));
                
                card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
            });
        });
    }
    
    addTag(tag) {
        const tagsInput = document.getElementById('groupTags');
        if (!tagsInput) return;
        
        const currentTags = tagsInput.value.trim();
        if (currentTags) {
            // Check if tag already exists
            const existingTags = currentTags.split(',').map(t => t.trim());
            if (existingTags.includes(tag)) return;
            
            tagsInput.value = currentTags + ', ' + tag;
        } else {
            tagsInput.value = tag;
        }
        
        // Focus back to the input
        tagsInput.focus();
    }
    
    showAnalytics() {
        if (!this.isAuthenticated) {
            this.showAuth();
            return;
        }
        this.currentView = 'dashboard';
        this.currentSection = 'analytics';
        this.render();
        this.loadSectionContent('analytics');
        this.updateURL('analytics');
    }
    
    showChats() {
        if (!this.isAuthenticated) {
            this.showAuth();
            return;
        }
        this.currentView = 'dashboard';
        this.currentSection = 'chats';
        this.render();
        this.loadSectionContent('chats');
        this.updateURL('chats');
    }
    
    showPairing() {
        if (!this.isAuthenticated) {
            this.showAuth();
            return;
        }
        this.currentView = 'dashboard';
        this.currentSection = 'pairing';
        this.render();
        this.loadSectionContent('pairing');
        this.updateURL('pairing');
    }
    
    updateURL(view) {
        const url = view === 'landing' ? '' : `#${view}`;
        if (window.location.hash !== url) {
            window.history.pushState({ view }, '', url);
        }
    }
    
    // Event Listeners
    attachLandingEventListeners() {
        // Landing page event listeners
        const authButtons = document.querySelectorAll('[onclick*="showAuth"]');
        authButtons.forEach(btn => {
            btn.onclick = () => this.showAuth();
        });
    }
    
    attachAuthEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleLogin();
            });
        }
        
        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleRegister();
            });
        }
    }
    
    attachDashboardEventListeners() {
        // Sidebar navigation
        const sidebarButtons = document.querySelectorAll('.sidebar button, .offcanvas-body button');
        sidebarButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.target.textContent.trim();
                if (text.includes('Dashboard')) this.showDashboard();
                else if (text.includes('Symptoms')) this.showSymptoms();
                else if (text.includes('Groups')) this.showGroups();
                else if (text.includes('Analytics')) this.showAnalytics();
                else if (text.includes('Chats')) this.showChats();
                else if (text.includes('Pairing')) this.showPairing();
            });
        });
    }
    
    // Authentication Handlers
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');
        
        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
    return;
  }
  
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';
            
            const user = await API.auth.login(email, password);
            Auth.saveSession(user);
            this.isAuthenticated = true;
            this.showToast('Welcome back!', 'success');
            this.showDashboard();
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Sign In';
        }
    }
    
    async handleRegister() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        const submitBtn = document.querySelector('#registerForm button[type="submit"]');
        
        if (!name || !email || !password || !confirmPassword) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }
  
        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating account...';
            
            const user = await API.auth.register(name, email, password);
            Auth.saveSession(user);
            this.isAuthenticated = true;
            this.showToast('Account created successfully!', 'success');
            this.showDashboard();
        } catch (error) {
            this.showToast(error.message, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Create Account';
        }
    }
    
    // Content Loading
    async loadDashboardContent() {
        const content = document.getElementById('dashboardContent');
        if (!content) return;
        
        content.innerHTML = Views.dashboardHome();
        
        // Small delay to ensure DOM is ready
        setTimeout(async () => {
            await this.loadDashboardStats();
            await this.loadRecentActivity();
        }, 100);
    }
    
    async loadSectionContent(section) {
        const content = document.getElementById('dashboardContent');
        if (!content) return;
        
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);
        }
        
        // Update active sidebar item
        document.querySelectorAll('.sidebar .nav-link, .offcanvas-body .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.textContent.toLowerCase().includes(section)) {
                link.classList.add('active');
            }
        });
        
        switch (section) {
            case 'symptoms':
                await this.loadSymptomsContent();
                break;
            case 'groups':
                await this.loadGroupsContent();
                break;
            case 'createGroup':
                await this.loadCreateGroupContent();
                break;
            case 'analytics':
                await this.loadAnalyticsContent();
                break;
            case 'chats':
                await this.loadChatsContent();
                break;
            case 'profile':
                console.log('Loading profile content from loadSectionContent...');
                await this.loadProfileContent();
                break;
            case 'pairing':
                await this.loadPairingContent();
                break;
        }
    }
    
    async loadDashboardStats() {
        try {
            const userId = Auth.getCurrentUserId();
            const [symptoms, groups] = await Promise.all([
                API.symptoms.list(),
                API.groups.list()
            ]);
            
            const userSymptoms = symptoms.filter(s => s.userId === userId);
            const totalSymptoms = userSymptoms.reduce((sum, entry) => {
                return sum + (entry.symptomDetails ? entry.symptomDetails.length : 0);
            }, 0);
            
            const totalGroups = groups.length;
            
            // Calculate average pain level
            let totalPain = 0;
            let painCount = 0;
            userSymptoms.forEach(entry => {
                if (entry.symptomDetails) {
                    entry.symptomDetails.forEach(detail => {
                        totalPain += detail.painLevel;
                        painCount++;
                    });
                }
            });
            const avgPainLevel = painCount > 0 ? (totalPain / painCount).toFixed(1) : 0;
            
            // Calculate days active
            const uniqueDates = new Set();
            userSymptoms.forEach(entry => {
                uniqueDates.add(entry.date);
            });
            const daysActive = uniqueDates.size;
            
            // Update UI with null checks
            const totalSymptomsEl = document.getElementById('totalSymptoms');
            const totalGroupsEl = document.getElementById('totalGroups');
            const avgPainLevelEl = document.getElementById('avgPainLevel');
            const daysActiveEl = document.getElementById('daysActive');
            
            if (totalSymptomsEl) totalSymptomsEl.textContent = totalSymptoms;
            if (totalGroupsEl) totalGroupsEl.textContent = totalGroups;
            if (avgPainLevelEl) avgPainLevelEl.textContent = avgPainLevel;
            if (daysActiveEl) daysActiveEl.textContent = daysActive;
            
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        }
    }
    
    async loadRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;
        
        try {
            const userId = Auth.getCurrentUserId();
            const symptoms = await API.symptoms.list();
            const userSymptoms = symptoms
                .filter(s => s.userId === userId)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            
            if (userSymptoms.length === 0) {
                container.innerHTML = '<p class="text-muted">No recent activity. Start tracking your symptoms!</p>';
    return;
  }
  
            const activityHtml = userSymptoms.map(entry => {
                const date = new Date(entry.date).toLocaleDateString();
                const symptomsCount = entry.symptomDetails ? entry.symptomDetails.length : 0;
                
                return `
                    <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2">
                        <div>
                            <div class="fw-medium">${date}</div>
                            <div class="text-muted small">${symptomsCount} symptoms tracked</div>
                        </div>
                        <div class="text-primary fw-medium">${date}</div>
                    </div>
                `;
            }).join('');
            
            container.innerHTML = activityHtml;
            
        } catch (error) {
            console.error('Error loading recent activity:', error);
            container.innerHTML = '<p class="text-muted">Unable to load recent activity</p>';
        }
    }
    
    // Section Content Loaders
    async loadSymptomsContent() {
        const content = document.getElementById('dashboardContent');
        content.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Symptom Tracking</h2>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dailyCheckinModal">
                    Daily Check-In
                </button>
            </div>
            
            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">Recent Symptoms</h5>
                        </div>
                        <div class="card-body">
                            <div id="symptomsList">
                                <div class="text-center py-4">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <div class="mt-2">Loading symptoms...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm">
                        <div class="card-header bg-white">
                            <h5 class="mb-0">Add Symptom</h5>
                        </div>
                        <div class="card-body">
                            <form id="symptomForm">
                                <div class="mb-3">
                                    <label for="symptomName" class="form-label">Symptom Name</label>
                                    <input type="text" class="form-control" id="symptomName" placeholder="e.g., Headache" required>
                                </div>
                                <div class="mb-3">
                                    <label for="painLevel" class="form-label">Pain Level (1-10)</label>
                                    <select class="form-select" id="painLevel" required>
                                        <option value="">Select pain level</option>
                                        ${Array.from({length: 10}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="notes" class="form-label">Notes (Optional)</label>
                                    <textarea class="form-control" id="notes" rows="3" placeholder="Additional details..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Add Symptom</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Daily Check-in Modal -->
            <div class="modal fade" id="dailyCheckinModal" tabindex="-1" aria-labelledby="dailyCheckinModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="dailyCheckinModalLabel">Daily Check-In</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="dailyCheckinForm">
                                <div id="symptomRows">
                                    <!-- Default 3 rows will be added by JavaScript -->
                                </div>
                                <div class="mt-3">
                                    <button type="button" class="btn btn-outline-secondary btn-sm" id="addSymptomRow">
                                        + Add another symptom
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="submitCheckin">Submit Check-In</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Attach event listeners
        this.attachSymptomsEventListeners();
        await this.loadSymptomsData();
    }
    
    attachSymptomsEventListeners() {
        // Symptom form submission
        const symptomForm = document.getElementById('symptomForm');
        if (symptomForm) {
            symptomForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleSymptomSubmission();
            });
        }
        
        // Daily check-in modal events
        const addSymptomRowBtn = document.getElementById('addSymptomRow');
        if (addSymptomRowBtn) {
            addSymptomRowBtn.addEventListener('click', this.addSymptomRow);
        }
        
        const submitCheckinBtn = document.getElementById('submitCheckin');
        if (submitCheckinBtn) {
            submitCheckinBtn.addEventListener('click', async () => {
                await this.handleDailyCheckin();
            });
        }
        
        // Initialize modal with default rows
        this.initializeDailyCheckinModal();
    }
    
    async handleSymptomSubmission() {
        const name = document.getElementById('symptomName').value.trim();
        const painLevel = parseInt(document.getElementById('painLevel').value);
        const notes = document.getElementById('notes').value.trim();
        
        if (!name || !painLevel) {
            this.showToast('Please provide a symptom name and pain level', 'error');
            return;
        }
        
        try {
            const userId = Auth.getCurrentUserId();
            
            // Find or create today's symptom entry
            const today = new Date().toISOString().split('T')[0];
            const existing = await API.symptoms.list();
            const todayEntry = existing.find(e => e.userId === userId && e.date === today);
            
            let entryId;
            if (todayEntry) {
                entryId = todayEntry.id;
            } else {
                const newEntry = await API.symptoms.createEntry({
                    userId: userId,
                    date: today
                });
                entryId = newEntry.id;
            }
            
            // Add symptom detail
            await API.symptoms.createDetail({
                symptomEntryId: entryId,
                name: name,
                painLevel: painLevel,
                notes: notes
            });
            
            this.showToast('Symptom added successfully!', 'success');
            document.getElementById('symptomForm').reset();
            await this.loadSymptomsData();
            
            // Refresh analytics if currently viewing it
            if (this.currentSection === 'analytics' && window.Analytics) {
                await window.Analytics.refreshAnalytics();
            }
            
        } catch (error) {
            console.error('Error adding symptom:', error);
            this.showToast('Failed to add symptom', 'error');
        }
    }
    
    async loadSymptomsData() {
        const container = document.getElementById('symptomsList');
        if (!container) return;
        
        try {
            const userId = Auth.getCurrentUserId();
            const symptoms = await API.symptoms.list();
            const userSymptoms = symptoms
                .filter(s => s.userId === userId)
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10);
            
            if (userSymptoms.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-4">
                        <div class="display-4 mb-3">🩺</div>
                        <h5>No symptoms tracked yet</h5>
                        <p class="text-muted">Start tracking your symptoms to see them here</p>
                    </div>
                `;
                return;
            }
            
            const symptomsHtml = userSymptoms.map(entry => {
                const date = new Date(entry.date).toLocaleDateString();
                const symptoms = entry.symptomDetails || [];
                
                const symptomsList = symptoms.map(detail => {
                    const painClass = this.getPainLevelClass(detail.painLevel);
                    return `
                        <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2">
                            <div>
                                <div class="fw-medium">${detail.name}</div>
                                <div class="text-muted small">${detail.notes || 'No notes'}</div>
                            </div>
                            <span class="pain-indicator ${painClass}">${detail.painLevel}/10</span>
                        </div>
                    `;
                }).join('');
                
                return `
                    <div class="mb-4">
                        <h6 class="text-muted mb-3">${date}</h6>
                        ${symptomsList}
                    </div>
                `;
            }).join('');
            
            container.innerHTML = symptomsHtml;
            
        } catch (error) {
            console.error('Error loading symptoms:', error);
            container.innerHTML = '<p class="text-muted">Failed to load symptoms</p>';
        }
    }
    
    getPainLevelClass(painLevel) {
        if (painLevel <= 3) return 'pain-low';
        if (painLevel <= 6) return 'pain-moderate';
        return 'pain-high';
    }
    
    initializeDailyCheckinModal() {
        const container = document.getElementById('symptomRows');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            this.addSymptomRow();
        }
    }
    
    addSymptomRow() {
        const container = document.getElementById('symptomRows');
        if (!container) return;
        
        const rowId = `symptomRow${Date.now()}`;
        const rowHtml = `
    <div class="row mb-3" id="${rowId}">
      <div class="col-md-4">
        <label class="form-label">Symptom Name</label>
        <input type="text" class="form-control" name="symptomName" placeholder="e.g., Headache" required>
      </div>
      <div class="col-md-2">
        <label class="form-label">Pain Level</label>
        <select class="form-select" name="painLevel" required>
          <option value="">Select</option>
          ${Array.from({length: 10}, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
        </select>
      </div>
      <div class="col-md-5">
        <label class="form-label">Notes (Optional)</label>
        <textarea class="form-control" name="notes" rows="1" placeholder="Additional details..."></textarea>
      </div>
      <div class="col-md-1 d-flex align-items-end">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeSymptomRow('${rowId}')">
          ×
        </button>
      </div>
    </div>
  `;
        
        container.insertAdjacentHTML('beforeend', rowHtml);
}

    removeSymptomRow(rowId) {
  const row = document.getElementById(rowId);
  if (row) {
    row.remove();
  }
}

    async handleDailyCheckin() {
  const rows = document.querySelectorAll('#symptomRows .row');
  const symptoms = [];
  
  // Collect all symptom data
  rows.forEach(row => {
    const nameInput = row.querySelector('input[name="symptomName"]');
    const painSelect = row.querySelector('select[name="painLevel"]');
    const notesTextarea = row.querySelector('textarea[name="notes"]');
    
    const name = nameInput.value.trim();
    const painLevel = painSelect.value;
    const notes = notesTextarea.value.trim();
    
    // Only include rows with symptom name and pain level
    if (name && painLevel) {
      symptoms.push({
        name: name,
        painLevel: parseInt(painLevel, 10),
        notes: notes
      });
    }
  });
  
  if (symptoms.length === 0) {
            this.showToast('Please enter at least one symptom', 'error');
    return;
  }
  
  const submitBtn = document.getElementById('submitCheckin');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";
  
  try {
            const userId = Auth.getCurrentUserId();
            const today = new Date().toISOString().split('T')[0];
            
    // Create a single symptom entry for today
    const entry = await API.symptoms.createEntry({
                userId: userId,
                date: today
    });
    
    // Create details for each symptom
    const promises = symptoms.map(symptom => 
      API.symptoms.createDetail({
        symptomEntryId: entry.id,
        name: symptom.name,
        painLevel: symptom.painLevel,
        notes: symptom.notes
      })
    );
    
    await Promise.all(promises);
    
            this.showToast(`${symptoms.length} symptoms logged successfully!`, 'success');
    
    // Close modal and refresh symptoms
    const modal = bootstrap.Modal.getInstance(document.getElementById('dailyCheckinModal'));
    modal.hide();
    
    // Refresh the symptoms list
            await this.loadSymptomsData();
    
    // Refresh analytics if currently viewing it
            if (this.currentSection === 'analytics' && window.Analytics) {
                await window.Analytics.refreshAnalytics();
            }
    
  } catch (err) {
            this.showToast('Failed to submit symptoms: ' + err.message, 'error');
    console.error('Error submitting daily check-in:', err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

    async loadGroupsContent() {
        const content = document.getElementById('dashboardContent');
        content.innerHTML = Views.groups();
        this.loadGroups();
    }
    
    async loadCreateGroupContent() {
        const content = document.getElementById('dashboardContent');
        content.innerHTML = Views.createGroup();
        
        // Add event listener to the form after it's rendered
        setTimeout(() => {
            const form = document.getElementById('createGroupForm');
            if (form) {
                form.addEventListener('submit', (event) => {
                    this.handleCreateGroup(event);
                });
                console.log('Form event listener added successfully');
            } else {
                console.error('createGroupForm not found');
            }
        }, 100);
    }

    async loadAnalyticsContent() {
        const content = document.getElementById('dashboardContent');
        content.innerHTML = Views.analytics();
        
        // Initialize analytics after DOM is updated
        setTimeout(() => {
            console.log('📊 Initializing analytics after DOM update...');
            if (window.Analytics) {
                window.Analytics.init();
            } else {
                console.error('❌ Analytics module not available');
            }
        }, 200);
    }
    
    async updateAnalytics() {
        if (window.Analytics) {
            await window.Analytics.updateAnalytics();
        }
    }
    
    async loadChatsContent() {
        const content = document.getElementById('dashboardContent');
        if (!content) return;
        
        // Clear any existing chat refresh intervals
        this.clearChatRefresh();
        
        content.innerHTML = `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h2 class="h3 mb-4" style="color: #fef3c7;">Group Chats</h2>
                        <div id="chatsList">
                            <div class="text-center py-5">
                                <div class="spinner-border" role="status" style="color: #f59e0b;">
                                    <span class="visually-hidden">Loading chats...</span>
                                </div>
                                <div class="mt-3" style="color: #fbbf24;">Loading your group chats...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load the user's groups for chat
        this.loadGroupChats();
    }
    
    async loadGroupChats() {
        try {
            console.log('Loading group chats...');
            const groups = await API.messages.getMyGroups();
            console.log('Group chats loaded:', groups);
            this.renderGroupChats(groups);
        } catch (error) {
            console.error('Error loading group chats:', error);
            this.renderGroupChats([]);
        }
    }
    
    renderGroupChats(groups) {
        console.log('Rendering group chats with', groups.length, 'groups');
        const chatsList = document.getElementById('chatsList');
        if (!chatsList) {
            console.error('Chats list element not found!');
            return;
        }
        
        if (groups.length === 0) {
            chatsList.innerHTML = `
                <div class="text-center py-5">
                    <div class="mb-3" style="font-size: 3rem; color: #f59e0b;">💬</div>
                    <h4 style="color: #fef3c7;">No group chats yet</h4>
                    <p style="color: #fbbf24;">Join a group to start chatting with other members!</p>
                    <button class="btn btn-primary" onclick="showGroups()" 
                            style="background: #d97706; border-color: #d97706;">
                        <i class="fas fa-users me-2"></i>Browse Groups
                    </button>
                </div>
            `;
            return;
        }
        
        const chatsHtml = groups.map(group => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title mb-0" style="color: #fef3c7;">${group.groupName}</h5>
                            <span class="badge" style="background: #d97706; color: white;">${group.userRole}</span>
                        </div>
                        <p class="card-text flex-grow-1" style="color: #fbbf24;">${group.groupDescription}</p>
                        
                        ${group.lastMessage ? `
                            <div class="mb-3 p-2" style="background: rgba(69, 26, 3, 0.3); border-radius: 8px;">
                                <div class="d-flex justify-content-between align-items-center">
                                    <small style="color: #a16207;">Last message from ${group.lastMessage.userName}</small>
                                    <small style="color: #a16207;">${new Date(group.lastMessage.timestamp).toLocaleDateString()}</small>
                                </div>
                                <p class="mb-0 mt-1" style="color: #fef3c7; font-size: 0.9rem;">${group.lastMessage.messageText}</p>
                            </div>
                        ` : `
                            <div class="mb-3 p-2" style="background: rgba(69, 26, 3, 0.3); border-radius: 8px;">
                                <p class="mb-0" style="color: #a16207; font-style: italic;">No messages yet</p>
                            </div>
                        `}
                        
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted" style="color: #a16207;">
                                <i class="fas fa-users me-1"></i>${group.memberCount} members
                            </small>
                            <button class="btn btn-sm btn-primary" onclick="openGroupChat(${group.groupId})"
                                    style="background: #d97706; border-color: #d97706;">
                                <i class="fas fa-comments me-1"></i>Open Chat
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        chatsList.innerHTML = `<div class="row">${chatsHtml}</div>`;
    }
    
    openGroupChat(groupId) {
        console.log('Opening group chat for group ID:', groupId);
        this.currentGroupId = groupId;
        this.loadGroupChatInterface(groupId);
    }
    
    async loadGroupChatInterface(groupId) {
        const content = document.getElementById('dashboardContent');
        if (!content) return;
        
        // Get group info
        const groups = await API.messages.getMyGroups();
        const group = groups.find(g => g.groupId === groupId);
        
        if (!group) {
            this.showNotification('Group not found or you are not a member', 'error');
            return;
        }
        
        content.innerHTML = `
            <div class="container-fluid h-100">
                <div class="row h-100">
                    <div class="col-12 d-flex flex-column" style="height: 80vh;">
                        <!-- Chat Header -->
                        <div class="card mb-3" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="card-body py-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="d-flex align-items-center">
                                        <button class="btn btn-link me-3" onclick="loadChatsContent()" style="color: #fef3c7; text-decoration: none;">
                                            <i class="fas fa-arrow-left"></i>
                                        </button>
                                        <div>
                                            <h5 class="mb-0" style="color: #fef3c7;">${group.groupName}</h5>
                                            <small style="color: #a16207;">${group.memberCount} members • You are ${group.userRole}</small>
                                        </div>
                                    </div>
                                    <button class="btn btn-sm btn-outline-primary" onclick="refreshChat()" style="border-color: #d97706; color: #d97706;">
                                        <i class="fas fa-sync-alt"></i> Refresh
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Chat Messages -->
                        <div class="card flex-grow-1 mb-3" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="card-body d-flex flex-column p-0">
                                <div id="chatMessages" class="flex-grow-1 p-3" style="overflow-y: auto; max-height: 60vh;">
                                    <div class="text-center py-4">
                                        <div class="spinner-border" role="status" style="color: #f59e0b;">
                                            <span class="visually-hidden">Loading messages...</span>
                                        </div>
                                        <div class="mt-2" style="color: #fbbf24;">Loading messages...</div>
                                    </div>
                                </div>
                                
                                <!-- Message Input -->
                                <div class="border-top p-3" style="border-color: rgba(255, 255, 255, 0.1) !important;">
                                    <form id="chatMessageForm" onsubmit="sendMessage(event)">
                                        <div class="input-group">
                                            <input type="text" class="form-control" id="messageInput" placeholder="Type your message..." 
                                                   style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                   required>
                                            <button class="btn btn-primary" type="submit" style="background: #d97706; border-color: #d97706;">
                                                <i class="fas fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Load messages for this group
        this.loadGroupMessages(groupId);
        
        // Set up auto-refresh every 5 seconds
        this.chatRefreshInterval = setInterval(() => {
            this.loadGroupMessages(groupId);
        }, 5000);
    }
    
    async loadGroupMessages(groupId) {
        try {
            console.log('Loading messages for group:', groupId);
            const messages = await API.messages.getGroupMessages(groupId);
            console.log('Messages loaded:', messages);
            this.renderGroupMessages(messages);
        } catch (error) {
            console.error('Error loading group messages:', error);
            this.renderGroupMessages([]);
        }
    }
    
    renderGroupMessages(messages) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        if (messages.length === 0) {
            chatMessages.innerHTML = `
                <div class="text-center py-4">
                    <div class="mb-3" style="font-size: 2rem; color: #f59e0b;">💬</div>
                    <h6 style="color: #fef3c7;">No messages yet</h6>
                    <p style="color: #a16207;">Be the first to start the conversation!</p>
                </div>
            `;
            return;
        }
        
        const messagesHtml = messages.map(message => `
            <div class="mb-3">
                <div class="d-flex align-items-start">
                    <div class="flex-shrink-0 me-3">
                        <div class="rounded-circle d-flex align-items-center justify-content-center" 
                             style="width: 40px; height: 40px; background: #d97706; color: white; font-weight: bold;">
                            ${message.userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="mb-0" style="color: #fef3c7;">${message.userName}</h6>
                            <small style="color: #a16207;">${new Date(message.timestamp).toLocaleString()}</small>
                        </div>
                        <p class="mb-0" style="color: #fbbf24;">${message.messageText}</p>
                    </div>
                </div>
            </div>
        `).join('');
        
        chatMessages.innerHTML = messagesHtml;
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    async sendMessage(event) {
        event.preventDefault();
        
        const messageInput = document.getElementById('messageInput');
        const messageText = messageInput.value.trim();
        
        if (!messageText || !this.currentGroupId) return;
        
        try {
            console.log('Sending message:', messageText, 'to group:', this.currentGroupId);
            await API.messages.sendGroupMessage(this.currentGroupId, messageText);
            
            // Clear input
            messageInput.value = '';
            
            // Refresh messages
            this.loadGroupMessages(this.currentGroupId);
            
            this.showNotification('Message sent!', 'success');
        } catch (error) {
            console.error('Error sending message:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        }
    }
    
    refreshChat() {
        if (this.currentGroupId) {
            this.loadGroupMessages(this.currentGroupId);
            this.showNotification('Chat refreshed!', 'info');
        }
    }
    
    // Clean up chat refresh interval when leaving chat
    clearChatRefresh() {
        if (this.chatRefreshInterval) {
            clearInterval(this.chatRefreshInterval);
            this.chatRefreshInterval = null;
        }
    }
    
    async loadProfileContent() {
        const content = document.getElementById('dashboardContent');
        console.log('Loading profile content...');
        console.log('Views object available:', typeof Views);
        console.log('Views.profile available:', typeof Views.profile);
        
        if (!Views || !Views.profile) {
            console.error('Views or Views.profile not available!');
            console.log('Available Views methods:', Views ? Object.keys(Views) : 'Views is null');
            content.innerHTML = '<div class="alert alert-danger">Profile view not available</div>';
            return;
        }
        
        const profileHTML = Views.profile();
        console.log('Profile HTML length:', profileHTML.length);
        console.log('Profile HTML contains profileName:', profileHTML.includes('profileName'));
        
        content.innerHTML = profileHTML;
        
        console.log('Profile HTML set, dashboard content length:', content.innerHTML.length);
        
        // Store reference to content element for profile loading
        this.profileContentElement = content;
        
        // Load user profile data after DOM is updated
        setTimeout(() => {
            this.loadUserProfileWithRetry();
            this.setupProfileForm();
        }, 300);
    }
    
    async loadUserProfileWithRetry(retryCount = 0) {
        const maxRetries = 3;
        
        try {
            const user = Auth.getCurrentUser();
            if (!user) {
                console.error('No authenticated user found');
                return;
            }
            
            console.log(`Loading user profile for: ${user.name} (attempt ${retryCount + 1})`);
            
            // Use stored reference to content element
            const dashboardContent = this.profileContentElement || document.getElementById('dashboardContent');
            console.log('Dashboard content exists:', !!dashboardContent);
            if (dashboardContent) {
                console.log('Dashboard content HTML length:', dashboardContent.innerHTML.length);
                console.log('Dashboard content contains profileName:', dashboardContent.innerHTML.includes('profileName'));
            }
            
            // Check if profile form elements exist before setting values
            // Try to find elements within the stored content element first
            let profileNameEl = null;
            let profileEmailEl = null;
            
            if (dashboardContent) {
                console.log('Searching for elements within dashboardContent...');
                profileNameEl = dashboardContent.querySelector('#profileName');
                profileEmailEl = dashboardContent.querySelector('#profileEmail');
                console.log('Found profileName in content:', !!profileNameEl);
                console.log('Found profileEmail in content:', !!profileEmailEl);
            } else {
                console.log('No dashboardContent available for searching');
            }
            
            // Fallback to global search if not found in content element
            if (!profileNameEl) {
                profileNameEl = document.getElementById('profileName');
            }
            if (!profileEmailEl) {
                profileEmailEl = document.getElementById('profileEmail');
            }
            
            console.log('Profile name element found:', !!profileNameEl);
            console.log('Profile email element found:', !!profileEmailEl);
            
            if (!profileNameEl || !profileEmailEl) {
                if (retryCount < maxRetries) {
                    console.log(`Profile elements not ready, retrying in 200ms... (${retryCount + 1}/${maxRetries})`);
                    setTimeout(() => {
                        this.loadUserProfileWithRetry(retryCount + 1);
                    }, 200);
                    return;
                } else {
                    console.error('Profile elements not found after maximum retries');
                    return;
                }
            }
            
            // Populate the form fields
            profileNameEl.value = user.name || '';
            profileEmailEl.value = user.email || '';
            
            // Load additional profile fields from session
            const profileAgeEl = document.getElementById('profileAge');
            const profileLocationEl = document.getElementById('profileLocation');
            const profileBioEl = document.getElementById('profileBio');
            const profileConditionsEl = document.getElementById('profileConditions');
            const profileInterestsEl = document.getElementById('profileInterests');
            
            if (profileAgeEl) {
                profileAgeEl.value = user.age || '';
            }
            
            if (profileLocationEl) {
                profileLocationEl.value = user.location || '';
            }
            
            if (profileBioEl) {
                profileBioEl.value = user.bio || '';
            }
            
            if (profileConditionsEl) {
                profileConditionsEl.value = user.conditions || '';
            }
            
            if (profileInterestsEl) {
                profileInterestsEl.value = user.interests || '';
            }
            
            console.log('✅ Profile loaded successfully:', {
                name: user.name,
                email: user.email,
                age: user.age,
                location: user.location,
                bio: user.bio,
                conditions: user.conditions,
                interests: user.interests
            });
            
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }
    
    async loadUserProfile() {
        // This method is kept for backward compatibility
        await this.loadUserProfileWithRetry();
    }
    
    async loadProfilePageData(retryCount = 0) {
        const maxRetries = 3;
        
        try {
            const user = Auth.getCurrentUser();
            if (!user) {
                console.error('No authenticated user found');
                return;
            }
            
            console.log(`Loading profile page data for: ${user.name} (attempt ${retryCount + 1})`);
            
            // Debug: Check what's in the DOM
            const app = document.getElementById('app');
            console.log('App element exists:', !!app);
            if (app) {
                console.log('App innerHTML length:', app.innerHTML.length);
                console.log('App contains profilePageName:', app.innerHTML.includes('profilePageName'));
                console.log('App contains profilePageForm:', app.innerHTML.includes('profilePageForm'));
            }
            
            // Check if profile page form elements exist
            const profilePageNameEl = document.getElementById('profilePageName');
            const profilePageEmailEl = document.getElementById('profilePageEmail');
            
            console.log('Profile page name element found:', !!profilePageNameEl);
            console.log('Profile page email element found:', !!profilePageEmailEl);
            
            if (!profilePageNameEl || !profilePageEmailEl) {
                if (retryCount < maxRetries) {
                    console.log(`Profile page elements not ready, retrying in 200ms... (${retryCount + 1}/${maxRetries})`);
                    setTimeout(() => {
                        this.loadProfilePageData(retryCount + 1);
                    }, 200);
                    return;
                } else {
                    console.error('Profile page elements not found after maximum retries');
                    return;
                }
            }
            
            // Populate profile page form with current user data
            profilePageNameEl.value = user.name || '';
            profilePageEmailEl.value = user.email || '';
            
            console.log('Set profile page name:', user.name);
            console.log('Set profile page email:', user.email);
            
            // Load additional profile fields from session
            const profilePageAgeEl = document.getElementById('profilePageAge');
            const profilePageLocationEl = document.getElementById('profilePageLocation');
            const profilePageBioEl = document.getElementById('profilePageBio');
            const profilePageConditionsEl = document.getElementById('profilePageConditions');
            const profilePageInterestsEl = document.getElementById('profilePageInterests');
            
            // Set saved profile data or empty if not available
            if (profilePageAgeEl) {
                profilePageAgeEl.value = user.age || '';
            }
            if (profilePageLocationEl) {
                profilePageLocationEl.value = user.location || '';
            }
            if (profilePageBioEl) {
                profilePageBioEl.value = user.bio || '';
            }
            if (profilePageConditionsEl) {
                profilePageConditionsEl.value = user.conditions || '';
            }
            if (profilePageInterestsEl) {
                profilePageInterestsEl.value = user.interests || '';
            }
            
            console.log('Profile data loaded:', {
                name: user.name,
                email: user.email,
                age: user.age,
                location: user.location,
                bio: user.bio,
                conditions: user.conditions,
                interests: user.interests
            });
            
            console.log('✅ Profile page data loaded successfully');
            
        } catch (error) {
            console.error('Error loading profile page data:', error);
        }
    }
    
    setupProfilePageForm() {
        const form = document.getElementById('profilePageForm');
        if (form) {
            form.addEventListener('submit', (event) => {
                this.handleProfilePageUpdate(event);
            });
        }
    }
    
    async handleProfilePageUpdate(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('profilePageName').value.trim(),
            email: document.getElementById('profilePageEmail').value.trim(),
            age: parseInt(document.getElementById('profilePageAge').value) || null,
            location: document.getElementById('profilePageLocation').value.trim(),
            bio: document.getElementById('profilePageBio').value.trim(),
            conditions: document.getElementById('profilePageConditions').value.trim(),
            interests: document.getElementById('profilePageInterests').value.trim()
        };
        
        try {
            console.log('Saving profile data:', formData);
            
            // Validate required fields
            if (!formData.name) {
                this.showNotification('Name is required', 'error');
                return;
            }
            
            if (!formData.email) {
                this.showNotification('Email is required', 'error');
                return;
            }
            
            // Update the Auth session with new profile data
            const currentUser = Auth.getCurrentUser();
            if (currentUser) {
                // Update the session with new profile data
                Auth.updateSession({
                    name: formData.name,
                    email: formData.email,
                    age: formData.age,
                    location: formData.location,
                    bio: formData.bio,
                    conditions: formData.conditions,
                    interests: formData.interests
                });
                
                console.log('Profile data saved to session');
                
                // Show success message
                this.showNotification('Profile updated successfully!', 'success');
                
                // In a real app, you would also send this data to an API
                // await API.users.updateProfile(formData);
                
            } else {
                throw new Error('No authenticated user found');
            }
            
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showNotification('Failed to update profile. Please try again.', 'error');
        }
    }
    
    setupProfileForm() {
        const form = document.getElementById('profileForm');
        if (form) {
            form.addEventListener('submit', (event) => {
                this.handleProfileUpdate(event);
            });
        }
    }
    
    async handleProfileUpdate(event) {
        event.preventDefault();
        
        const formData = {
            name: document.getElementById('profileName').value.trim(),
            email: document.getElementById('profileEmail').value.trim(),
            age: parseInt(document.getElementById('profileAge').value) || null,
            location: document.getElementById('profileLocation').value.trim(),
            bio: document.getElementById('profileBio').value.trim(),
            conditions: document.getElementById('profileConditions').value.trim(),
            interests: document.getElementById('profileInterests').value.trim()
        };
        
        try {
            console.log('Saving profile data:', formData);
            
            // Validate required fields
            if (!formData.name) {
                this.showNotification('Name is required', 'error');
                return;
            }
            
            if (!formData.email) {
                this.showNotification('Email is required', 'error');
                return;
            }
            
            // Update the Auth session with new profile data
            const currentUser = Auth.getCurrentUser();
            if (currentUser) {
                // Update the session with new profile data
                Auth.updateSession({
                    name: formData.name,
                    email: formData.email,
                    age: formData.age,
                    location: formData.location,
                    bio: formData.bio,
                    conditions: formData.conditions,
                    interests: formData.interests
                });
                
                console.log('Profile data saved to session');
                
                // Show success message
                this.showNotification('Profile updated successfully!', 'success');
                
                // In a real app, you would also send this data to an API
                // await API.users.updateProfile(formData);
                
            } else {
                throw new Error('No authenticated user found');
            }
            
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showNotification('Failed to update profile. Please try again.', 'error');
        }
    }
    
    async loadPairingContent() {
        const content = document.getElementById('dashboardContent');
        content.innerHTML = `
            <div class="text-center py-5">
                <div class="display-4 mb-3">🤝</div>
                <h3>Peer Pairing</h3>
                <p class="text-muted">Pairing section coming soon!</p>
            </div>
        `;
    }
    
    // Utility Methods
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        const toastBody = toast.querySelector('.toast-body');
        if (toastBody) {
            toastBody.textContent = message;
        }
        
        // Remove existing type classes
        toast.classList.remove('bg-primary', 'bg-success', 'bg-danger', 'bg-warning');
        
        // Add new type class
        switch (type) {
            case 'success':
                toast.classList.add('bg-success');
                break;
            case 'error':
                toast.classList.add('bg-danger');
                break;
            case 'warning':
                toast.classList.add('bg-warning');
                break;
            default:
                toast.classList.add('bg-primary');
        }
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
    
    scrollToFeatures() {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.HavenWellnessApp = new HavenWellnessApp();
    console.log('HavenWellnessApp initialized:', window.HavenWellnessApp);
    console.log('showCreateGroup function exists:', typeof window.HavenWellnessApp.showCreateGroup);
    
    // Create global functions for easier access
    window.showCreateGroup = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.showCreateGroup) {
            window.HavenWellnessApp.showCreateGroup();
        } else {
            console.error('HavenWellnessApp or showCreateGroup not available');
        }
    };
    
    window.showGroups = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.showGroups) {
            window.HavenWellnessApp.showGroups();
        } else {
            console.error('HavenWellnessApp or showGroups not available');
        }
    };
    
    window.addTag = (tag) => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.addTag) {
            window.HavenWellnessApp.addTag(tag);
        } else {
            console.error('HavenWellnessApp or addTag not available');
        }
    };
    
    window.handleCreateGroup = (event) => {
        console.log('handleCreateGroup called', event);
        console.log('HavenWellnessApp exists:', !!window.HavenWellnessApp);
        console.log('handleCreateGroup method exists:', !!(window.HavenWellnessApp && window.HavenWellnessApp.handleCreateGroup));
        
        if (window.HavenWellnessApp && window.HavenWellnessApp.handleCreateGroup) {
            window.HavenWellnessApp.handleCreateGroup(event);
        } else {
            console.error('HavenWellnessApp or handleCreateGroup not available');
        }
    };
    
    window.updateAnalytics = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.updateAnalytics) {
            window.HavenWellnessApp.updateAnalytics();
        } else {
            console.error('HavenWellnessApp or updateAnalytics not available');
        }
    };
    
    window.refreshAnalytics = () => {
        if (window.Analytics && window.Analytics.refreshAnalytics) {
            window.Analytics.refreshAnalytics();
        } else {
            console.error('Analytics or refreshAnalytics not available');
        }
    };
    
    window.showSection = (section) => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.showSection) {
            window.HavenWellnessApp.showSection(section);
        } else {
            console.error('HavenWellnessApp or showSection not available');
        }
    };
    
    window.openGroupChat = (groupId) => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.openGroupChat) {
            window.HavenWellnessApp.openGroupChat(groupId);
        } else {
            console.error('HavenWellnessApp or openGroupChat not available');
        }
    };
    
    window.joinGroup = (groupId) => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.joinGroup) {
            window.HavenWellnessApp.joinGroup(groupId);
        } else {
            console.error('HavenWellnessApp or joinGroup not available');
        }
    };
    
    window.leaveGroup = (groupId) => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.leaveGroup) {
            window.HavenWellnessApp.leaveGroup(groupId);
        } else {
            console.error('HavenWellnessApp or leaveGroup not available');
        }
    };
    
    window.manageGroup = (groupId) => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.manageGroup) {
            window.HavenWellnessApp.manageGroup(groupId);
        } else {
            console.error('HavenWellnessApp or manageGroup not available');
        }
    };
    
    window.removeSymptomRow = (rowId) => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.removeSymptomRow) {
            window.HavenWellnessApp.removeSymptomRow(rowId);
        } else {
            console.error('HavenWellnessApp or removeSymptomRow not available');
        }
    };
    
    window.loadChatsContent = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.loadChatsContent) {
            window.HavenWellnessApp.loadChatsContent();
        } else {
            console.error('HavenWellnessApp or loadChatsContent not available');
        }
    };
    
    window.refreshChat = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.refreshChat) {
            window.HavenWellnessApp.refreshChat();
        } else {
            console.error('HavenWellnessApp or refreshChat not available');
        }
    };
    
    window.sendMessage = (event) => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.sendMessage) {
            window.HavenWellnessApp.sendMessage(event);
        } else {
            console.error('HavenWellnessApp or sendMessage not available');
        }
    };
    
    window.showProfile = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.showProfile) {
            window.HavenWellnessApp.showProfile();
        } else {
            console.error('HavenWellnessApp or showProfile not available');
        }
    };
    
    window.showProfilePage = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.showProfilePage) {
            window.HavenWellnessApp.showProfilePage();
        } else {
            console.error('HavenWellnessApp or showProfilePage not available');
        }
    };
    
    window.showDashboard = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.showDashboard) {
            window.HavenWellnessApp.showDashboard();
        } else {
            console.error('HavenWellnessApp or showDashboard not available');
        }
    };
    
    window.changeProfilePicture = () => {
        // Placeholder for profile picture change functionality
        console.log('Change profile picture clicked');
        // In a real app, this would open a file picker
    };
    
    window.cancelProfileEdit = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.showDashboard) {
            window.HavenWellnessApp.showDashboard();
        }
    };
    
    window.showChangePassword = () => {
        // Placeholder for change password functionality
        console.log('Change password clicked');
        // In a real app, this would show a password change modal
    };
    
    window.showPrivacySettings = () => {
        // Placeholder for privacy settings functionality
        console.log('Privacy settings clicked');
        // In a real app, this would show privacy settings modal
    };
    
    window.showSettings = () => {
        // Placeholder for settings functionality
        console.log('Settings clicked');
        // In a real app, this would show settings modal or page
    };
    
    window.showAuth = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.showAuth) {
            window.HavenWellnessApp.showAuth();
        } else {
            console.error('HavenWellnessApp or showAuth not available');
        }
    };
    
    window.showLanding = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.showLanding) {
            window.HavenWellnessApp.showLanding();
        } else {
            console.error('HavenWellnessApp or showLanding not available');
        }
    };
    
    window.scrollToFeatures = () => {
        if (window.HavenWellnessApp && window.HavenWellnessApp.scrollToFeatures) {
            window.HavenWellnessApp.scrollToFeatures();
        } else {
            console.error('HavenWellnessApp or scrollToFeatures not available');
        }
    };
    
    console.log('Global functions created:', {
        showCreateGroup: typeof window.showCreateGroup,
        showGroups: typeof window.showGroups,
        addTag: typeof window.addTag,
        handleCreateGroup: typeof window.handleCreateGroup,
        updateAnalytics: typeof window.updateAnalytics,
        refreshAnalytics: typeof window.refreshAnalytics,
        showSection: typeof window.showSection,
        openGroupChat: typeof window.openGroupChat,
        joinGroup: typeof window.joinGroup,
        leaveGroup: typeof window.leaveGroup,
        manageGroup: typeof window.manageGroup,
        removeSymptomRow: typeof window.removeSymptomRow,
        loadChatsContent: typeof window.loadChatsContent,
        refreshChat: typeof window.refreshChat,
        sendMessage: typeof window.sendMessage,
        showProfile: typeof window.showProfile,
        showProfilePage: typeof window.showProfilePage,
        showDashboard: typeof window.showDashboard,
        changeProfilePicture: typeof window.changeProfilePicture,
        cancelProfileEdit: typeof window.cancelProfileEdit,
        showChangePassword: typeof window.showChangePassword,
        showPrivacySettings: typeof window.showPrivacySettings,
        showSettings: typeof window.showSettings,
        showAuth: typeof window.showAuth,
        showLanding: typeof window.showLanding,
        scrollToFeatures: typeof window.scrollToFeatures
    });
    
    // Test the global function
    console.log('Testing handleCreateGroup function...');
    if (typeof window.handleCreateGroup === 'function') {
        console.log('✅ handleCreateGroup function is available');
    } else {
        console.error('❌ handleCreateGroup function is NOT available');
    }
});