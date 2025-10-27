// Haven Wellness Views
// Handles all view rendering for the SPA

const Views = {
    /**
     * Render landing page view
     */
    landing() {
        return `
            <!-- Hero Section -->
            <div class="hero-gradient text-white py-3">
                <div class="container">
                    <div class="row align-items-center" style="min-height: 40vh;">
                        <div class="col-lg-6">
                            <h1 class="display-4 fw-bold mb-4">Bridging Symptom Tracking & Community</h1>
                            <p class="lead mb-4">Connect with others who understand your journey. Track symptoms, find support, and build meaningful connections in a safe, supportive environment.</p>
                            <div class="d-flex gap-3">
                                <button class="btn btn-light btn-lg px-4" onclick="showAuth()">Get Started</button>
                                <button class="btn btn-outline-light btn-lg px-4" onclick="scrollToFeatures()">Learn More</button>
                            </div>
                        </div>
                        <div class="col-lg-6 text-center">
                            <div class="text-white mb-4">
                                <div class="d-flex align-items-center justify-content-center mb-3">
                        <div class="bg-white rounded-circle p-3 me-3 floating pulse" style="width: 80px; height: 80px; box-shadow: 0 0 30px rgba(217, 119, 6, 0.3);">
                            <div class="text-primary d-flex align-items-center justify-content-center h-100" style="font-size: 2.5rem;">🤝</div>
                        </div>
                                    <div class="text-start">
                                        <h2 class="mb-0 fw-bold gradient-text">Haven Wellness</h2>
                                        <p class="mb-0 opacity-75">Your Safe Space for Health & Community</p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-center gap-4 text-center">
                                    <div>
                                        <div class="h4 mb-1">10K+</div>
                                        <small class="opacity-75">Members</small>
                                    </div>
                                    <div>
                                        <div class="h4 mb-1">500+</div>
                                        <small class="opacity-75">Support Groups</small>
                                    </div>
                                    <div>
                                        <div class="h4 mb-1">95%</div>
                                        <small class="opacity-75">Satisfaction</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Features Section -->
            <div class="py-5" id="features">
                <div class="container">
                    <div class="text-center mb-5">
                        <h2 class="h2 fw-bold">Everything You Need for Your Wellness Journey</h2>
                        <p class="lead text-muted">Our comprehensive platform combines symptom tracking, community support, and data insights to help you take control of your health.</p>
                    </div>
                    
                    <div class="row g-4">
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-0 shadow-sm floating" style="animation-delay: 0.1s;">
                                <div class="card-body text-center p-4">
                                    <div class="text-primary mb-3 pulse" style="font-size: 2.5rem;">⚕</div>
                                    <h5 class="card-title gradient-text">Symptom Tracking</h5>
                                    <p class="card-text">Log your symptoms with pain levels, notes, and daily check-ins. Visualize your health patterns with interactive charts and trends.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-0 shadow-sm floating" style="animation-delay: 0.2s;">
                                <div class="card-body text-center p-4">
                                    <div class="text-success mb-3 pulse" style="font-size: 2.5rem;">👥</div>
                                    <h5 class="card-title gradient-text">Support Groups</h5>
                                    <p class="card-text">Join communities of people with similar experiences. Share stories, get advice, and find understanding in a safe space.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-0 shadow-sm floating" style="animation-delay: 0.3s;">
                                <div class="card-body text-center p-4">
                                    <div class="text-info mb-3 pulse" style="font-size: 2.5rem;">📊</div>
                                    <h5 class="card-title gradient-text">Health Analytics</h5>
                                    <p class="card-text">Gain insights into your health patterns with detailed analytics. Track improvements, identify triggers, and make informed decisions.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-0 shadow-sm floating" style="animation-delay: 0.4s;">
                                <div class="card-body text-center p-4">
                                    <div class="text-warning mb-3 pulse" style="font-size: 2.5rem;">💬</div>
                                    <h5 class="card-title gradient-text">Real-time Chat</h5>
                                    <p class="card-text">Connect instantly with your support network. Share updates, ask questions, and receive encouragement when you need it most.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-0 shadow-sm floating" style="animation-delay: 0.5s;">
                                <div class="card-body text-center p-4">
                                    <div class="text-secondary mb-3 pulse" style="font-size: 2.5rem;">🤝</div>
                                    <h5 class="card-title gradient-text">Peer Pairing</h5>
                                    <p class="card-text">Find one-on-one support with others who share similar symptoms. Build meaningful connections with people who truly understand.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 col-lg-4">
                            <div class="card h-100 border-0 shadow-sm floating" style="animation-delay: 0.6s;">
                                <div class="card-body text-center p-4">
                                    <div class="text-dark mb-3 pulse" style="font-size: 2.5rem;">🔒</div>
                                    <h5 class="card-title gradient-text">Privacy First</h5>
                                    <p class="card-text">Your health data is secure and private. Share only what you're comfortable with, and maintain full control over your information.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Section -->
            <div class="py-5" style="background: linear-gradient(135deg, #b45309 0%, #d97706 100%);">
                <div class="container">
                    <div class="row text-center text-white">
                        <div class="col-md-3">
                            <div class="h1 fw-bold">10K+</div>
                            <div class="h5">Active Users</div>
                        </div>
                        <div class="col-md-3">
                            <div class="h1 fw-bold">50K+</div>
                            <div class="h5">Symptoms Tracked</div>
                        </div>
                        <div class="col-md-3">
                            <div class="h1 fw-bold">500+</div>
                            <div class="h5">Support Groups</div>
                        </div>
                        <div class="col-md-3">
                            <div class="h1 fw-bold">95%</div>
                            <div class="h5">User Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <footer class="py-4" style="background: var(--text-dark);">
                <div class="container text-center text-white">
                    <h5>Haven Wellness</h5>
                    <p class="mb-0">Bridging the gap between symptom tracking and community support</p>
                    <small style="color: var(--text-light);">© 2024 Haven Wellness. All rights reserved.</small>
                </div>
            </footer>
        `;
    },

    /**
     * Render authentication view
     */
    auth() {
        return `
            <div class="min-vh-100 d-flex align-items-center justify-content-center" style="background: linear-gradient(135deg, #2C3E50 0%, #5D6D7E 50%, #8D8741 100%);">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-8 col-lg-6">
                            <div class="card shadow-lg border-0" style="border-radius: 15px; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1);">
                                <div class="card-body p-5">
                                    <div class="text-center mb-5">
                                        <div class="rounded-circle p-3 d-inline-block mb-3" style="background: linear-gradient(135deg, #b45309 0%, #d97706 100%);">
                                            <div class="text-white" style="font-size: 2rem;">🤝</div>
                                        </div>
                                        <h2 class="fw-bold mb-2" style="color: #fef3c7;">Welcome to Haven Wellness</h2>
                                        <p class="text-muted" style="color: #fbbf24;">Sign in to your account or create a new one</p>
                                    </div>
                                    
                                    <!-- Auth Tabs -->
                                    <ul class="nav nav-pills nav-fill mb-5" id="authTabs" role="tablist" style="background: rgba(69, 26, 3, 0.6); border-radius: 10px; padding: 4px;">
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link active" id="login-tab" data-bs-toggle="pill" data-bs-target="#login" type="button" role="tab" style="border-radius: 8px; background: #d97706; color: white;">Sign In</button>
                                        </li>
                                        <li class="nav-item" role="presentation">
                                            <button class="nav-link" id="register-tab" data-bs-toggle="pill" data-bs-target="#register" type="button" role="tab" style="border-radius: 8px; color: #fbbf24;">Sign Up</button>
                                        </li>
                                    </ul>
                                    
                                    <!-- Auth Forms -->
                                    <div class="tab-content" id="authTabContent">
                                        <!-- Login Form -->
                                        <div class="tab-pane fade show active" id="login" role="tabpanel">
                                            <form id="loginForm">
                                                <div class="mb-4">
                                                    <label for="loginEmail" class="form-label fw-semibold">Email Address</label>
                                                    <input type="email" class="form-control form-control-lg" id="loginEmail" required style="border-radius: 10px; border: 2px solid #e9ecef;">
                                                </div>
                                                <div class="mb-4">
                                                    <label for="loginPassword" class="form-label fw-semibold">Password</label>
                                                    <input type="password" class="form-control form-control-lg" id="loginPassword" required style="border-radius: 10px; border: 2px solid #e9ecef;">
                                                </div>
                                                <button type="submit" class="btn w-100 btn-lg" style="border-radius: 10px; padding: 12px; background: linear-gradient(135deg, #5d0a33 0%, #7a0e42 100%); border: none; color: white;">Sign In</button>
                                            </form>
                                        </div>
                                        
                                        <!-- Register Form -->
                                        <div class="tab-pane fade" id="register" role="tabpanel">
                                            <form id="registerForm">
                                                <div class="mb-4">
                                                    <label for="registerName" class="form-label fw-semibold">Full Name</label>
                                                    <input type="text" class="form-control form-control-lg" id="registerName" required style="border-radius: 10px; border: 2px solid #e9ecef;">
                                                </div>
                                                <div class="mb-4">
                                                    <label for="registerEmail" class="form-label fw-semibold">Email Address</label>
                                                    <input type="email" class="form-control form-control-lg" id="registerEmail" required style="border-radius: 10px; border: 2px solid #e9ecef;">
                                                </div>
                                                <div class="mb-4">
                                                    <label for="registerPassword" class="form-label fw-semibold">Password</label>
                                                    <input type="password" class="form-control form-control-lg" id="registerPassword" required minlength="6" style="border-radius: 10px; border: 2px solid #e9ecef;">
                                                </div>
                                                <div class="mb-4">
                                                    <label for="registerConfirmPassword" class="form-label fw-semibold">Confirm Password</label>
                                                    <input type="password" class="form-control form-control-lg" id="registerConfirmPassword" required style="border-radius: 10px; border: 2px solid #e9ecef;">
                                                </div>
                                                <button type="submit" class="btn w-100 btn-lg" style="border-radius: 10px; padding: 12px; background: linear-gradient(135deg, #5d0a33 0%, #7a0e42 100%); border: none; color: white;">Create Account</button>
                                            </form>
                                        </div>
                                    </div>
                                    
                                    <div class="text-center mt-5">
                                        <button class="btn btn-outline-secondary" onclick="showLanding()" style="border-radius: 8px; border-color: #5d0a33; color: #5d0a33;">← Back to Home</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render dashboard view
     */
    dashboard() {
        const userName = Auth.getCurrentUserName() || 'User';
        return `
            <div class="d-flex">
                <!-- Sidebar -->
                <div class="sidebar d-none d-lg-block" style="background: linear-gradient(180deg, #78350f 0%, #92400e 100%);">
                    <div class="p-4 border-bottom" style="border-color: #f59e0b !important;">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle p-2 me-3" style="width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2);">
                                <div class="text-white d-flex align-items-center justify-content-center h-100" style="font-size: 1.2rem;">🤝</div>
                            </div>
                            <div>
                                <h5 class="fw-bold text-white mb-0">Haven Wellness</h5>
                                <small class="text-white-50">Your Safe Space</small>
                            </div>
                        </div>
                    </div>
                    <nav class="nav flex-column p-3">
                        <button class="nav-link text-start border-0 bg-transparent active text-white" onclick="showSection('home')" style="color: white !important; background: rgba(255, 255, 255, 0.1) !important; border-radius: 8px; margin: 2px 0;">
                            Dashboard
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('symptoms')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Symptoms
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('groups')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Groups
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('analytics')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Analytics
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('chats')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Chats
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('pairing')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Pairing
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showProfilePage()" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Profile
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSettings()" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Settings
                        </button>
                    </nav>
                </div>
                
                <!-- Main Content -->
                <div class="main-content flex-grow-1" style="background: linear-gradient(135deg, #2C3E50 0%, #5D6D7E 50%, #8D8741 100%);">
                    <!-- Top Navigation -->
                    <nav class="navbar navbar-expand-lg navbar-light border-bottom" style="background: rgba(44, 62, 80, 0.8); backdrop-filter: blur(20px); border-color: #659DBD !important;">
                        <div class="container-fluid">
                            <button class="btn btn-outline-secondary d-lg-none me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarOffcanvas" style="border-color: #659DBD; color: #659DBD;">
                                Menu
                            </button>
                            <span class="navbar-brand mb-0 h1" id="pageTitle" style="color: #FBEEC1;">Dashboard</span>
                            
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" style="border-color: #659DBD; color: #FBEEC1; background: rgba(101, 157, 189, 0.2);">
                                    ${userName}
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item text-danger" href="#" onclick="Auth.logout()">Logout</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    
                    <!-- Content Area -->
                    <div class="p-4">
                        <div id="dashboardContent">
                            <!-- Dashboard content will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Mobile Sidebar Offcanvas -->
                <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebarOffcanvas" style="background: linear-gradient(180deg, #78350f 0%, #92400e 100%);">
                <div class="offcanvas-header" style="border-bottom: 1px solid #f59e0b;">
                    <h5 class="offcanvas-title text-white">Haven Wellness</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
                </div>
                <div class="offcanvas-body">
                    <nav class="nav flex-column">
                        <button class="nav-link text-start border-0 bg-transparent active text-white" onclick="showSection('home')" style="color: white !important; background: rgba(255, 255, 255, 0.1) !important; border-radius: 8px; margin: 2px 0;">
                            Dashboard
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('symptoms')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Symptoms
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('groups')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Groups
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('analytics')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Analytics
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('chats')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Chats
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSection('pairing')" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Pairing
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showProfilePage()" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Profile
                        </button>
                        <button class="nav-link text-start border-0 bg-transparent text-white-50" onclick="showSettings()" style="color: rgba(255, 255, 255, 0.7) !important; border-radius: 8px; margin: 2px 0;">
                            Settings
                        </button>
                    </nav>
                </div>
            </div>
        `;
    },

    /**
     * Render groups view
     */
    groups() {
        return `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2 class="h3 mb-0" style="color: #fef3c7;">Support Groups</h2>
                            <button class="btn btn-primary" onclick="showCreateGroup()" style="background: #d97706; border-color: #d97706;">
                                <i class="fas fa-plus me-2"></i>Create Group
                            </button>
                        </div>
                        
                        <!-- Search and Filter -->
                        <div class="card mb-4" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-8">
                                        <div class="input-group">
                                            <span class="input-group-text" style="background: rgba(69, 26, 3, 0.6); border-color: #d97706; color: #fef3c7;">
                                                <i class="fas fa-search"></i>
                                            </span>
                                            <input type="text" class="form-control" id="groupSearch" placeholder="Search groups by name or description..." 
                                                   style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                   onkeyup="HavenWellnessApp.filterGroups()">
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <select class="form-select" id="groupFilter" onchange="HavenWellnessApp.filterGroups()"
                                                style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;">
                                            <option value="all">All Groups</option>
                                            <option value="my-groups">My Groups</option>
                                            <option value="available">Available to Join</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Groups List -->
                        <div id="groupsList">
                            <div class="text-center py-5">
                                <div class="spinner-border" role="status" style="color: #f59e0b;">
                                    <span class="visually-hidden">Loading groups...</span>
                                </div>
                                <div class="mt-3" style="color: #fbbf24;">Loading groups...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render create group form
     */
    createGroup() {
        return `
            <div class="container-fluid">
                <div class="row justify-content-center">
                    <div class="col-md-8 col-lg-6">
                        <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px 15px 0 0;">
                                <div class="d-flex align-items-center">
                                    <button class="btn btn-link me-3" onclick="showGroups()" style="color: #fef3c7; text-decoration: none;">
                                        <i class="fas fa-arrow-left"></i>
                                    </button>
                                    <h5 class="mb-0" style="color: #fef3c7;">Create New Group</h5>
                                </div>
                            </div>
                            <div class="card-body p-4">
                                   <form id="createGroupForm">
                                    <div class="mb-4">
                                        <label for="groupName" class="form-label" style="color: #fef3c7;">Group Name</label>
                                        <input type="text" class="form-control" id="groupName" required
                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                               placeholder="Enter group name">
                                    </div>
                                    
                                    <div class="mb-4">
                                        <label for="groupDescription" class="form-label" style="color: #fef3c7;">Description</label>
                                        <textarea class="form-control" id="groupDescription" rows="4" required
                                                  style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                  placeholder="Describe what this group is about..."></textarea>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <label for="groupCategory" class="form-label" style="color: #fef3c7;">Category</label>
                                        <select class="form-select" id="groupCategory" required
                                                style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;">
                                            <option value="">Select a category</option>
                                            <option value="chronic-pain">Chronic Pain</option>
                                            <option value="mental-health">Mental Health</option>
                                            <option value="autoimmune">Autoimmune Conditions</option>
                                            <option value="fibromyalgia">Fibromyalgia</option>
                                            <option value="arthritis">Arthritis</option>
                                            <option value="migraine">Migraine</option>
                                            <option value="general-wellness">General Wellness</option>
                                            <option value="caregiver-support">Caregiver Support</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <label for="groupTags" class="form-label" style="color: #fef3c7;">Tags</label>
                                        <input type="text" class="form-control" id="groupTags" 
                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                               placeholder="Enter tags separated by commas (e.g., pain management, support, daily challenges)">
                                        <div class="form-text" style="color: #a16207;">
                                            Add relevant tags to help others find your group. Separate multiple tags with commas.
                                        </div>
                                        
                                        <!-- Suggested Tags -->
                                        <div class="mt-2">
                                            <small class="text-muted" style="color: #a16207;">Suggested tags:</small>
                                            <div class="d-flex flex-wrap gap-1 mt-1">
                                                <span class="badge" style="background: rgba(217, 119, 6, 0.2); color: #f59e0b; border: 1px solid #d97706; cursor: pointer;" 
                                                      onclick="addTag('pain management')">pain management</span>
                                                <span class="badge" style="background: rgba(217, 119, 6, 0.2); color: #f59e0b; border: 1px solid #d97706; cursor: pointer;" 
                                                      onclick="addTag('support')">support</span>
                                                <span class="badge" style="background: rgba(217, 119, 6, 0.2); color: #f59e0b; border: 1px solid #d97706; cursor: pointer;" 
                                                      onclick="addTag('daily challenges')">daily challenges</span>
                                                <span class="badge" style="background: rgba(217, 119, 6, 0.2); color: #f59e0b; border: 1px solid #d97706; cursor: pointer;" 
                                                      onclick="addTag('wellness')">wellness</span>
                                                <span class="badge" style="background: rgba(217, 119, 6, 0.2); color: #f59e0b; border: 1px solid #d97706; cursor: pointer;" 
                                                      onclick="addTag('community')">community</span>
                                                <span class="badge" style="background: rgba(217, 119, 6, 0.2); color: #f59e0b; border: 1px solid #d97706; cursor: pointer;" 
                                                      onclick="addTag('coping strategies')">coping strategies</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="isPrivate" style="accent-color: #d97706;">
                                            <label class="form-check-label" for="isPrivate" style="color: #fef3c7;">
                                                Private Group (invite only)
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button type="button" class="btn btn-outline-secondary me-md-2" onclick="showGroups()"
                                                style="border-color: #d97706; color: #fef3c7;">Cancel</button>
                                        <button type="submit" class="btn btn-primary" style="background: #d97706; border-color: #d97706;">
                                            <i class="fas fa-plus me-2"></i>Create Group
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render dashboard home content
     */
    dashboardHome() {
        const userName = Auth.getCurrentUserName() || 'User';
        return `
            <div class="mb-4">
                <h2 class="h3" style="color: #fef3c7;">Welcome back, ${userName}</h2>
                <p class="text-muted" style="color: #fbbf24;">Here's an overview of your wellness journey.</p>
            </div>
            
            <!-- Stats Cards -->
            <div class="row g-4 mb-5">
                <div class="col-md-6 col-lg-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body text-center floating pulse" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; animation-delay: 0.1s; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="mb-2 pulse" style="font-size: 2rem; color: #f59e0b;">⚕</div>
                            <div class="h3 mb-1 gradient-text" id="totalSymptoms" style="color: #fef3c7;">0</div>
                            <div class="text-muted" style="color: #fbbf24;">Symptoms Tracked</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body text-center floating pulse" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; animation-delay: 0.2s; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="mb-2 pulse" style="font-size: 2rem; color: #84cc16;">👥</div>
                            <div class="h3 mb-1 gradient-text" id="totalGroups" style="color: #fef3c7;">0</div>
                            <div class="text-muted" style="color: #fbbf24;">Groups Joined</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body text-center floating pulse" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; animation-delay: 0.3s; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="mb-2 pulse" style="font-size: 2rem; color: #fbbf24;">📊</div>
                            <div class="h3 mb-1 gradient-text" id="avgPainLevel" style="color: #fef3c7;">0</div>
                            <div class="text-muted" style="color: #fbbf24;">Avg Pain Level</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="card border-0 shadow-sm">
                        <div class="card-body text-center floating pulse" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; animation-delay: 0.4s; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="mb-2 pulse" style="font-size: 2rem; color: #d97706;">📅</div>
                            <div class="h3 mb-1 gradient-text" id="daysActive" style="color: #fef3c7;">0</div>
                            <div class="text-muted" style="color: #fbbf24;">Days Active</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="card border-0 shadow-sm" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px 15px 0 0;">
                    <h5 class="mb-0" style="color: #fef3c7;">Recent Activity</h5>
                </div>
                <div class="card-body">
                    <div id="recentActivity">
                        <div class="text-center py-4">
                            <div class="spinner-border" role="status" style="color: #f59e0b;">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            <div class="mt-2" style="color: #fbbf24;">Loading recent activity...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render analytics page with symptom trend graphs
     */
    analytics() {
        return `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h2 class="h3 mb-4" style="color: #fef3c7;">Symptom Analytics</h2>
                        
                        <!-- Date Range Filter -->
                        <div class="card mb-4" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="card-body">
                                <div class="row g-3 align-items-end">
                                    <div class="col-md-3">
                                        <label for="dateFrom" class="form-label" style="color: #fef3c7;">From Date</label>
                                        <input type="date" class="form-control" id="dateFrom" 
                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="dateTo" class="form-label" style="color: #fef3c7;">To Date</label>
                                        <input type="date" class="form-control" id="dateTo" 
                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;">
                                    </div>
                                    <div class="col-md-3">
                                        <label for="symptomFilter" class="form-label" style="color: #fef3c7;">Symptom Type</label>
                                        <select class="form-select" id="symptomFilter" 
                                                style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;">
                                            <option value="all">All Symptoms</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <button class="btn btn-primary w-100" onclick="updateAnalytics()" 
                                                style="background: #d97706; border-color: #d97706;">
                                            <i class="fas fa-chart-line me-2"></i>Update Charts
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Analytics Content -->
                        <div id="analyticsContent">
                            <div class="text-center py-5">
                                <div class="spinner-border" role="status" style="color: #f59e0b;">
                                    <span class="visually-hidden">Loading analytics...</span>
                                </div>
                                <div class="mt-3" style="color: #fbbf24;">Loading your symptom data...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render profile page with user information and editing capabilities
     */
    profile() {
        return `
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12">
                        <h2 class="h3 mb-4" style="color: #fef3c7;">My Profile</h2>
                        
                        <!-- Profile Information Card -->
                        <div class="card mb-4" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px 15px 0 0;">
                                <h5 class="mb-0" style="color: #fef3c7;">Profile Information</h5>
                            </div>
                            <div class="card-body">
                                <form id="profileForm">
                                    <div class="row g-4">
                                        <!-- Profile Picture -->
                                        <div class="col-md-3 text-center">
                                            <div class="mb-3">
                                                <div class="position-relative d-inline-block">
                                                    <div id="profilePicture" class="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                                                         style="width: 120px; height: 120px; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%) !important; color: white; font-size: 3rem;">
                                                        <i class="fas fa-user"></i>
                                                    </div>
                                                    <button type="button" class="btn btn-sm btn-outline-light position-absolute bottom-0 end-0 rounded-circle" 
                                                            style="width: 32px; height: 32px; padding: 0;" onclick="changeProfilePicture()">
                                                        <i class="fas fa-camera" style="font-size: 0.8rem;"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <small style="color: #a16207;">Click camera icon to change photo</small>
                                        </div>
                                        
                                        <!-- Profile Details -->
                                        <div class="col-md-9">
                                            <div class="row g-3">
                                                <div class="col-md-6">
                                                    <label for="profileName" class="form-label" style="color: #fef3c7;">Full Name</label>
                                                    <input type="text" class="form-control" id="profileName" 
                                                           style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                           placeholder="Enter your full name">
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="profileEmail" class="form-label" style="color: #fef3c7;">Email Address</label>
                                                    <input type="email" class="form-control" id="profileEmail" 
                                                           style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                           placeholder="Enter your email">
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="profileAge" class="form-label" style="color: #fef3c7;">Age</label>
                                                    <input type="number" class="form-control" id="profileAge" min="1" max="120"
                                                           style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                           placeholder="Enter your age">
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="profileLocation" class="form-label" style="color: #fef3c7;">Location</label>
                                                    <input type="text" class="form-control" id="profileLocation" 
                                                           style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                           placeholder="City, State/Country">
                                                </div>
                                                <div class="col-12">
                                                    <label for="profileBio" class="form-label" style="color: #fef3c7;">Bio</label>
                                                    <textarea class="form-control" id="profileBio" rows="4" 
                                                              style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                              placeholder="Tell us about yourself, your journey, and what you're looking for in this community..."></textarea>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="profileConditions" class="form-label" style="color: #fef3c7;">Health Conditions</label>
                                                    <input type="text" class="form-control" id="profileConditions" 
                                                           style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                           placeholder="e.g., Fibromyalgia, Chronic Pain, etc.">
                                                    <div class="form-text" style="color: #a16207;">Separate multiple conditions with commas</div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="profileInterests" class="form-label" style="color: #fef3c7;">Interests</label>
                                                    <input type="text" class="form-control" id="profileInterests" 
                                                           style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                           placeholder="e.g., Art, Music, Reading, Exercise">
                                                    <div class="form-text" style="color: #a16207;">What activities do you enjoy?</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Action Buttons -->
                                    <div class="row mt-4">
                                        <div class="col-12">
                                            <div class="d-flex gap-3 justify-content-end">
                                                <button type="button" class="btn btn-outline-secondary" onclick="cancelProfileEdit()"
                                                        style="border-color: #d97706; color: #fef3c7;">
                                                    <i class="fas fa-times me-2"></i>Cancel
                                                </button>
                                                <button type="submit" class="btn btn-primary" style="background: #d97706; border-color: #d97706;">
                                                    <i class="fas fa-save me-2"></i>Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        
                        <!-- Group Memberships Card -->
                        <div class="card mb-4" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px 20px 0 0;">
                                <h4 class="mb-0" style="color: #fef3c7;"><i class="fas fa-users me-2"></i>Group Memberships</h4>
                            </div>
                            <div class="card-body p-4">
                                <div id="userGroupsList">
                                    <div class="text-center py-3">
                                        <div class="spinner-border text-primary" role="status" style="color: #d97706 !important;">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                        <p class="mt-2 mb-0" style="color: #a16207;">Loading your groups...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Group Memberships Card -->
                        <div class="card mb-4" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px 15px 0 0;">
                                <h5 class="mb-0" style="color: #fef3c7;"><i class="fas fa-users me-2"></i>Group Memberships</h5>
                            </div>
                            <div class="card-body">
                                <div id="dashboardUserGroupsList">
                                    <div class="text-center py-3">
                                        <div class="spinner-border text-primary" role="status" style="color: #d97706 !important;">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                        <p class="mt-2 mb-0" style="color: #a16207;">Loading your groups...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Account Settings Card -->
                        <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                            <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px 15px 0 0;">
                                <h5 class="mb-0" style="color: #fef3c7;">Account Settings</h5>
                            </div>
                            <div class="card-body">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <div class="d-flex justify-content-between align-items-center p-3" style="background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                                            <div>
                                                <h6 class="mb-1" style="color: #fef3c7;">Change Password</h6>
                                                <small style="color: #a16207;">Update your account password</small>
                                            </div>
                                            <button class="btn btn-outline-primary btn-sm" onclick="showChangePassword()"
                                                    style="border-color: #d97706; color: #d97706;">
                                                <i class="fas fa-key me-1"></i>Change
                                            </button>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="d-flex justify-content-between align-items-center p-3" style="background: rgba(255, 255, 255, 0.05); border-radius: 10px;">
                                            <div>
                                                <h6 class="mb-1" style="color: #fef3c7;">Privacy Settings</h6>
                                                <small style="color: #a16207;">Control your data visibility</small>
                                            </div>
                                            <button class="btn btn-outline-primary btn-sm" onclick="showPrivacySettings()"
                                                    style="border-color: #d97706; color: #d97706;">
                                                <i class="fas fa-shield-alt me-1"></i>Settings
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render standalone profile page (not within dashboard)
     */
    profilePage() {
        return `
            <div class="min-vh-100" style="background: linear-gradient(135deg, #2C3E50 0%, #5D6D7E 50%, #8D8741 100%);">
                <!-- Navigation Bar -->
                <nav class="navbar navbar-expand-lg" style="background: rgba(69, 26, 3, 0.8); backdrop-filter: blur(20px); border-bottom: 1px solid #d97706;">
                    <div class="container-fluid">
                        <a class="navbar-brand d-flex align-items-center" href="#" onclick="showLanding()" style="color: #fef3c7; text-decoration: none;">
                            <div class="me-2" style="width: 32px; height: 32px; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-handshake" style="color: white; font-size: 1rem;"></i>
                            </div>
                            <span class="fw-bold">Haven Wellness</span>
                        </a>
                        
                        <div class="d-flex align-items-center">
                            <button class="btn btn-outline-light me-2" onclick="showLanding()" style="border-color: #d97706; color: #fef3c7;">
                                <i class="fas fa-home me-1"></i>Home
                            </button>
                            <button class="btn btn-outline-light me-2" onclick="showDashboard()" style="border-color: #d97706; color: #fef3c7;">
                                <i class="fas fa-tachometer-alt me-1"></i>Dashboard
                            </button>
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" style="border-color: #659DBD; color: #FBEEC1; background: rgba(101, 157, 189, 0.2);">
                                    <i class="fas fa-user me-1"></i>Account
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" onclick="showProfilePage()"><i class="fas fa-user me-2"></i>Profile</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="showSettings()"><i class="fas fa-cog me-2"></i>Settings</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item text-danger" href="#" onclick="Auth.logout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>

                <!-- Profile Content -->
                <div class="container-fluid py-5">
                    <div class="row justify-content-center">
                        <div class="col-12 col-lg-10 col-xl-8">
                            <div class="text-center mb-5">
                                <h1 class="display-5 fw-bold mb-3" style="color: #fef3c7;">My Profile</h1>
                                <p class="lead" style="color: #fbbf24;">Manage your personal information and account settings</p>
                            </div>
                            
                            <!-- Profile Information Card -->
                            <div class="card mb-4" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px 20px 0 0;">
                                    <h4 class="mb-0" style="color: #fef3c7;"><i class="fas fa-user me-2"></i>Personal Information</h4>
                                </div>
                                <div class="card-body p-4">
                                    <form id="profilePageForm">
                                        <div class="row g-4">
                                            <!-- Profile Picture -->
                                            <div class="col-md-3 text-center">
                                                <div class="mb-3">
                                                    <div class="position-relative d-inline-block">
                                                        <div id="profilePagePicture" class="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                                                             style="width: 150px; height: 150px; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%) !important; color: white; font-size: 4rem;">
                                                            <i class="fas fa-user"></i>
                                                        </div>
                                                        <button type="button" class="btn btn-sm btn-outline-light position-absolute bottom-0 end-0 rounded-circle" 
                                                                style="width: 40px; height: 40px; padding: 0;" onclick="changeProfilePicture()">
                                                            <i class="fas fa-camera" style="font-size: 1rem;"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <small style="color: #a16207;">Click camera icon to change photo</small>
                                            </div>
                                            
                                            <!-- Profile Details -->
                                            <div class="col-md-9">
                                                <div class="row g-3">
                                                    <div class="col-md-6">
                                                        <label for="profilePageName" class="form-label" style="color: #fef3c7;">Full Name</label>
                                                        <input type="text" class="form-control form-control-lg" id="profilePageName" 
                                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                               placeholder="Enter your full name">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="profilePageEmail" class="form-label" style="color: #fef3c7;">Email Address</label>
                                                        <input type="email" class="form-control form-control-lg" id="profilePageEmail" 
                                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                               placeholder="Enter your email">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="profilePageAge" class="form-label" style="color: #fef3c7;">Age</label>
                                                        <input type="number" class="form-control form-control-lg" id="profilePageAge" min="1" max="120"
                                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                               placeholder="Enter your age">
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="profilePageLocation" class="form-label" style="color: #fef3c7;">Location</label>
                                                        <input type="text" class="form-control form-control-lg" id="profilePageLocation" 
                                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                               placeholder="City, State/Country">
                                                    </div>
                                                    <div class="col-12">
                                                        <label for="profilePageBio" class="form-label" style="color: #fef3c7;">Bio</label>
                                                        <textarea class="form-control" id="profilePageBio" rows="4" 
                                                                  style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                                  placeholder="Tell us about yourself, your journey, and what you're looking for in this community..."></textarea>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="profilePageConditions" class="form-label" style="color: #fef3c7;">Health Conditions</label>
                                                        <input type="text" class="form-control form-control-lg" id="profilePageConditions" 
                                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                               placeholder="e.g., Fibromyalgia, Chronic Pain, etc.">
                                                        <div class="form-text" style="color: #a16207;">Separate multiple conditions with commas</div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <label for="profilePageInterests" class="form-label" style="color: #fef3c7;">Interests</label>
                                                        <input type="text" class="form-control form-control-lg" id="profilePageInterests" 
                                                               style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;"
                                                               placeholder="e.g., Art, Music, Reading, Exercise">
                                                        <div class="form-text" style="color: #a16207;">What activities do you enjoy?</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- Action Buttons -->
                                        <div class="row mt-5">
                                            <div class="col-12">
                                                <div class="d-flex gap-3 justify-content-center">
                                                    <button type="button" class="btn btn-outline-secondary btn-lg px-5" onclick="showDashboard()"
                                                            style="border-color: #d97706; color: #fef3c7;">
                                                        <i class="fas fa-arrow-left me-2"></i>Back to Dashboard
                                                    </button>
                                                    <button type="submit" class="btn btn-primary btn-lg px-5" style="background: #d97706; border-color: #d97706;">
                                                        <i class="fas fa-save me-2"></i>Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            
                            <!-- Account Settings Card -->
                            <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px 20px 0 0;">
                                    <h4 class="mb-0" style="color: #fef3c7;"><i class="fas fa-cog me-2"></i>Account Settings</h4>
                                </div>
                                <div class="card-body p-4">
                                    <div class="row g-4">
                                        <div class="col-md-6">
                                            <div class="d-flex justify-content-between align-items-center p-4" style="background: rgba(255, 255, 255, 0.05); border-radius: 15px;">
                                                <div>
                                                    <h5 class="mb-2" style="color: #fef3c7;"><i class="fas fa-key me-2"></i>Change Password</h5>
                                                    <p class="mb-0" style="color: #a16207;">Update your account password</p>
                                                </div>
                                                <button class="btn btn-outline-primary" onclick="showChangePassword()"
                                                        style="border-color: #d97706; color: #d97706;">
                                                    <i class="fas fa-edit me-1"></i>Change
                                                </button>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="d-flex justify-content-between align-items-center p-4" style="background: rgba(255, 255, 255, 0.05); border-radius: 15px;">
                                                <div>
                                                    <h5 class="mb-2" style="color: #fef3c7;"><i class="fas fa-shield-alt me-2"></i>Privacy Settings</h5>
                                                    <p class="mb-0" style="color: #a16207;">Control your data visibility</p>
                                                </div>
                                                <button class="btn btn-outline-primary" onclick="showPrivacySettings()"
                                                        style="border-color: #d97706; color: #d97706;">
                                                    <i class="fas fa-edit me-1"></i>Settings
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render chats view
     */
    chats() {
        return `
            <div class="container-fluid py-4">
                <div class="row">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2 class="mb-0" style="color: #fef3c7;">
                                <i class="fas fa-comments me-2"></i>Chats
                            </h2>
                            <button class="btn btn-primary" onclick="showCreateChatModal()" 
                                    style="background: #d97706; border-color: #d97706;">
                                <i class="fas fa-plus me-2"></i>Create Chat
                            </button>
                        </div>
                        
                        <div class="row">
                            <!-- Group Chats -->
                            <div class="col-md-6">
                                <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px 20px 0 0;">
                                        <h4 class="mb-0" style="color: #fef3c7;">
                                            <i class="fas fa-users me-2"></i>Group Chats
                                        </h4>
                                    </div>
                                    <div class="card-body p-0" style="max-height: 500px; overflow-y: auto;">
                                        <div id="chatsList">
                                            <div class="text-center py-5">
                                                <div class="spinner-border text-primary" role="status" style="color: #d97706 !important;">
                                                    <span class="visually-hidden">Loading...</span>
                                                </div>
                                                <p class="mt-3 mb-0" style="color: #a16207;">Loading group chats...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Private Chats -->
                            <div class="col-md-6">
                                <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px 20px 0 0;">
                                        <h4 class="mb-0" style="color: #fef3c7;">
                                            <i class="fas fa-lock me-2"></i>Private Chats
                                        </h4>
                                    </div>
                                    <div class="card-body p-0" style="max-height: 500px; overflow-y: auto;">
                                        <div id="privateChatsList">
                                            <div class="text-center py-5">
                                                <div class="spinner-border text-primary" role="status" style="color: #d97706 !important;">
                                                    <span class="visually-hidden">Loading...</span>
                                                </div>
                                                <p class="mt-3 mb-0" style="color: #a16207;">Loading private chats...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Create Chat Modal -->
            <div class="modal fade" id="createChatModal" tabindex="-1" aria-labelledby="createChatModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content" style="background: rgba(69, 26, 3, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div class="modal-header" style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                            <h5 class="modal-title" id="createChatModalLabel" style="color: #fef3c7;">
                                <i class="fas fa-plus me-2"></i>Create Private Chat
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="filter: invert(1);"></button>
                        </div>
                        <div class="modal-body">
                            <p style="color: #a16207;">Select a paired user to start a private conversation:</p>
                            <div id="pairedUsersList">
                                <div class="text-center py-3">
                                    <div class="spinner-border text-primary" role="status" style="color: #d97706 !important;">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    <p class="mt-2 mb-0" style="color: #a16207;">Loading paired users...</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer" style="border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" style="background: #6b7280; border-color: #6b7280;">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render pairing view
     */
    pairing() {
        return `
            <div class="container-fluid py-4">
                <div class="row">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h2 class="mb-0" style="color: #fef3c7;">
                                <i class="fas fa-users me-2"></i>Pairing
                            </h2>
                        </div>
                        
                        <!-- Pairing Tabs -->
                        <ul class="nav nav-tabs mb-4" style="border-color: #d97706;">
                            <li class="nav-item">
                                <button class="nav-link active" id="myPairingsTab" data-bs-toggle="tab" data-bs-target="#myPairings" 
                                        style="color: #fef3c7; border-color: #d97706; background: rgba(217, 119, 6, 0.2);">
                                    <i class="fas fa-heart me-2"></i>My Pairings
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="findPairingTab" data-bs-toggle="tab" data-bs-target="#findPairing" 
                                        style="color: #fef3c7; border-color: #d97706;">
                                    <i class="fas fa-search me-2"></i>Find Pairing
                                </button>
                            </li>
                        </ul>
                        
                        <!-- Tab Content -->
                        <div class="tab-content">
                            <!-- My Pairings Tab -->
                            <div class="tab-pane fade show active" id="myPairings">
                                <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                    <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px 20px 0 0;">
                                        <h4 class="mb-0" style="color: #fef3c7;">
                                            <i class="fas fa-heart me-2"></i>Current Pairings
                                        </h4>
                                    </div>
                                    <div class="card-body p-4">
                                        <div id="pairingsList">
                                            <div class="text-center py-5">
                                                <div class="spinner-border text-primary" role="status" style="color: #d97706 !important;">
                                                    <span class="visually-hidden">Loading...</span>
                                                </div>
                                                <p class="mt-3 mb-0" style="color: #a16207;">Loading your pairings...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Find Pairing Tab -->
                            <div class="tab-pane fade" id="findPairing">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="card mb-4" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                            <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px 20px 0 0;">
                                                <h5 class="mb-0" style="color: #fef3c7;">
                                                    <i class="fas fa-filter me-2"></i>Filter by Group
                                                </h5>
                                            </div>
                                            <div class="card-body p-3">
                                                <select class="form-select form-select-lg" id="pairingGroupFilter" 
                                                        style="background: rgba(255, 255, 255, 0.1); border-color: #d97706; color: #fef3c7;">
                                                    <option value="">Select a group...</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-8">
                                        <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                                            <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px 20px 0 0;">
                                                <h5 class="mb-0" style="color: #fef3c7;">
                                                    <i class="fas fa-users me-2"></i>Available Users
                                                </h5>
                                            </div>
                                            <div class="card-body p-4">
                                                <div id="availableUsersList">
                                                    <div class="text-center py-5">
                                                        <i class="fas fa-users text-muted mb-3" style="font-size: 3rem; color: #a16207 !important;"></i>
                                                        <p class="mb-0" style="color: #a16207;">Select a group to see available users for pairing</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

};

// Make Views globally available
window.Views = Views;
