// Haven Wellness Analytics Module
// Comprehensive symptom analytics with trend graphs

class Analytics {
    constructor() {
        this.charts = {};
        this.symptomData = [];
        this.dateRange = {
            from: null,
            to: null
        };
    }

    /**
     * Initialize analytics page
     */
    async init() {
        console.log('📊 Initializing analytics...');
        
        // Set default date range (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        const dateFromEl = document.getElementById('dateFrom');
        const dateToEl = document.getElementById('dateTo');
        
        if (dateFromEl && dateToEl) {
            dateFromEl.value = thirtyDaysAgo.toISOString().split('T')[0];
            dateToEl.value = today.toISOString().split('T')[0];
        } else {
            console.error('❌ Date input elements not found');
            return;
        }
        
        // Load initial data
        await this.loadSymptomData();
        this.populateSymptomFilter();
        await this.renderAnalytics();
    }

    /**
     * Load symptom data from API
     */
    async loadSymptomData() {
        try {
            console.log('📊 Loading symptom data...');
            
            const fromDateEl = document.getElementById('dateFrom');
            const toDateEl = document.getElementById('dateTo');
            
            if (!fromDateEl || !toDateEl) {
                console.error('❌ Date input elements not found');
                this.symptomData = [];
                return;
            }
            
            const fromDate = fromDateEl.value;
            const toDate = toDateEl.value;
            
            console.log('📊 Date range:', { fromDate, toDate });
            
            // Get current user ID from authentication
            const userId = window.Auth ? window.Auth.getCurrentUserId() : null;
            console.log('📊 User ID:', userId);
            
            if (!userId) {
                console.error('❌ No authenticated user found');
                this.symptomData = [];
                return;
            }
            
            // Use the symptoms API with proper user filtering
            const apiUrl = `http://localhost:5135/api/Symptoms?userId=${userId}&from=${fromDate}&to=${toDate}`;
            console.log('📊 Fetching from:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.symptomData = await response.json();
            console.log('📊 Loaded symptom data:', this.symptomData);
            
        } catch (error) {
            console.error('❌ Error loading symptom data:', error);
            this.symptomData = [];
        }
    }

    /**
     * Populate symptom filter dropdown
     */
    populateSymptomFilter() {
        const filter = document.getElementById('symptomFilter');
        if (!filter) return;
        
        // Get unique symptom names
        const symptomNames = new Set();
        this.symptomData.forEach(entry => {
            entry.symptomDetails.forEach(detail => {
                symptomNames.add(detail.name);
            });
        });
        
        // Clear existing options except "All Symptoms"
        filter.innerHTML = '<option value="all">All Symptoms</option>';
        
        // Add symptom options
        Array.from(symptomNames).sort().forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            filter.appendChild(option);
        });
    }

    /**
     * Render analytics content
     */
    async renderAnalytics() {
        const content = document.getElementById('analyticsContent');
        if (!content) return;
        
        if (this.symptomData.length === 0) {
            const userId = window.Auth ? window.Auth.getCurrentUserId() : null;
            
            if (!userId) {
                content.innerHTML = `
                    <div class="text-center py-5">
                        <div class="mb-3" style="font-size: 3rem; color: #f59e0b;">🔐</div>
                        <h4 style="color: #fef3c7;">Please Log In</h4>
                        <p style="color: #fbbf24;">You need to be logged in to view your symptom analytics.</p>
                        <button class="btn btn-primary" onclick="showAuth()" 
                                style="background: #d97706; border-color: #d97706;">
                            <i class="fas fa-sign-in-alt me-2"></i>Log In
                        </button>
                    </div>
                `;
            } else {
                content.innerHTML = `
                    <div class="text-center py-5">
                        <div class="mb-3" style="font-size: 3rem; color: #f59e0b;">📊</div>
                        <h4 style="color: #fef3c7;">No Symptom Data Found</h4>
                        <p style="color: #fbbf24;">Start tracking your symptoms to see analytics and trends!</p>
                        <button class="btn btn-primary" onclick="showSection('symptoms')" 
                                style="background: #d97706; border-color: #d97706;">
                            <i class="fas fa-plus me-2"></i>Add Symptoms
                        </button>
                    </div>
                `;
            }
            return;
        }
        
        content.innerHTML = `
            <div class="row g-4">
                <!-- Pain Level Trend Chart -->
                <div class="col-12">
                    <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px 15px 0 0;">
                            <h5 class="mb-0" style="color: #fef3c7;">Pain Level Trends</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="painTrendChart" height="100"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- Symptom Frequency Chart -->
                <div class="col-md-6">
                    <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px 15px 0 0;">
                            <h5 class="mb-0" style="color: #fef3c7;">Symptom Frequency</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="symptomFrequencyChart" height="200"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- Average Pain by Symptom -->
                <div class="col-md-6">
                    <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px 15px 0 0;">
                            <h5 class="mb-0" style="color: #fef3c7;">Average Pain by Symptom</h5>
                        </div>
                        <div class="card-body">
                            <canvas id="avgPainChart" height="200"></canvas>
                        </div>
                    </div>
                </div>
                
                <!-- Summary Stats -->
                <div class="col-12">
                    <div class="card" style="background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(20px); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <div class="card-header" style="background: rgba(69, 26, 3, 0.6); border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px 15px 0 0;">
                            <h5 class="mb-0" style="color: #fef3c7;">Summary Statistics</h5>
                        </div>
                        <div class="card-body">
                            <div class="row g-3" id="summaryStats">
                                <!-- Stats will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Render charts after DOM is updated
        setTimeout(() => {
            this.renderCharts();
            this.renderSummaryStats();
        }, 100);
    }

    /**
     * Render all charts
     */
    renderCharts() {
        this.renderPainTrendChart();
        this.renderSymptomFrequencyChart();
        this.renderAvgPainChart();
    }

    /**
     * Render pain level trend chart
     */
    renderPainTrendChart() {
        const ctx = document.getElementById('painTrendChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.charts.painTrend) {
            this.charts.painTrend.destroy();
        }
        
        const data = this.processPainTrendData();
        
        this.charts.painTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Average Pain Level',
                    data: data.values,
                    borderColor: '#d97706',
                    backgroundColor: 'rgba(217, 119, 6, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fef3c7'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#fbbf24'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: '#fbbf24'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Render symptom frequency chart
     */
    renderSymptomFrequencyChart() {
        const ctx = document.getElementById('symptomFrequencyChart');
        if (!ctx) return;
        
        if (this.charts.symptomFrequency) {
            this.charts.symptomFrequency.destroy();
        }
        
        const data = this.processSymptomFrequencyData();
        
        this.charts.symptomFrequency = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#d97706',
                        '#f59e0b',
                        '#fbbf24',
                        '#84cc16',
                        '#3b82f6',
                        '#8b5cf6',
                        '#ec4899',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fef3c7'
                        }
                    }
                }
            }
        });
    }

    /**
     * Render average pain by symptom chart
     */
    renderAvgPainChart() {
        const ctx = document.getElementById('avgPainChart');
        if (!ctx) return;
        
        if (this.charts.avgPain) {
            this.charts.avgPain.destroy();
        }
        
        const data = this.processAvgPainData();
        
        this.charts.avgPain = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Average Pain Level',
                    data: data.values,
                    backgroundColor: 'rgba(217, 119, 6, 0.8)',
                    borderColor: '#d97706',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fef3c7'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#fbbf24'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            color: '#fbbf24'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    /**
     * Process data for pain trend chart
     */
    processPainTrendData() {
        const dailyAverages = {};
        
        this.symptomData.forEach(entry => {
            const date = entry.date;
            const totalPain = entry.symptomDetails.reduce((sum, detail) => sum + detail.painLevel, 0);
            const avgPain = totalPain / entry.symptomDetails.length;
            
            if (!dailyAverages[date]) {
                dailyAverages[date] = [];
            }
            dailyAverages[date].push(avgPain);
        });
        
        const labels = Object.keys(dailyAverages).sort();
        const values = labels.map(date => {
            const pains = dailyAverages[date];
            return pains.reduce((sum, pain) => sum + pain, 0) / pains.length;
        });
        
        return { labels, values };
    }

    /**
     * Process data for symptom frequency chart
     */
    processSymptomFrequencyData() {
        const frequency = {};
        
        this.symptomData.forEach(entry => {
            entry.symptomDetails.forEach(detail => {
                frequency[detail.name] = (frequency[detail.name] || 0) + 1;
            });
        });
        
        const labels = Object.keys(frequency);
        const values = Object.values(frequency);
        
        return { labels, values };
    }

    /**
     * Process data for average pain chart
     */
    processAvgPainData() {
        const painBySymptom = {};
        
        this.symptomData.forEach(entry => {
            entry.symptomDetails.forEach(detail => {
                if (!painBySymptom[detail.name]) {
                    painBySymptom[detail.name] = [];
                }
                painBySymptom[detail.name].push(detail.painLevel);
            });
        });
        
        const labels = Object.keys(painBySymptom);
        const values = labels.map(symptom => {
            const pains = painBySymptom[symptom];
            return pains.reduce((sum, pain) => sum + pain, 0) / pains.length;
        });
        
        return { labels, values };
    }

    /**
     * Render summary statistics
     */
    renderSummaryStats() {
        const container = document.getElementById('summaryStats');
        if (!container) return;
        
        const stats = this.calculateSummaryStats();
        
        container.innerHTML = `
            <div class="col-md-3">
                <div class="text-center">
                    <div class="h4 mb-1" style="color: #f59e0b;">${stats.totalEntries}</div>
                    <div class="text-muted" style="color: #fbbf24;">Total Entries</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="text-center">
                    <div class="h4 mb-1" style="color: #84cc16;">${stats.uniqueSymptoms}</div>
                    <div class="text-muted" style="color: #fbbf24;">Unique Symptoms</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="text-center">
                    <div class="h4 mb-1" style="color: #fbbf24;">${stats.avgPainLevel}</div>
                    <div class="text-muted" style="color: #fbbf24;">Avg Pain Level</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="text-center">
                    <div class="h4 mb-1" style="color: #d97706;">${stats.daysTracked}</div>
                    <div class="text-muted" style="color: #fbbf24;">Days Tracked</div>
                </div>
            </div>
        `;
    }

    /**
     * Calculate summary statistics
     */
    calculateSummaryStats() {
        const totalEntries = this.symptomData.length;
        const uniqueSymptoms = new Set();
        let totalPain = 0;
        let painCount = 0;
        
        this.symptomData.forEach(entry => {
            entry.symptomDetails.forEach(detail => {
                uniqueSymptoms.add(detail.name);
                totalPain += detail.painLevel;
                painCount++;
            });
        });
        
        const avgPainLevel = painCount > 0 ? (totalPain / painCount).toFixed(1) : '0.0';
        const daysTracked = new Set(this.symptomData.map(entry => entry.date)).size;
        
        return {
            totalEntries,
            uniqueSymptoms: uniqueSymptoms.size,
            avgPainLevel,
            daysTracked
        };
    }

    /**
     * Update analytics (called when filters change)
     */
    async updateAnalytics() {
        console.log('📊 Updating analytics...');
        await this.loadSymptomData();
        this.populateSymptomFilter();
        await this.renderAnalytics();
    }

    /**
     * Refresh analytics (called when new symptoms are added)
     */
    async refreshAnalytics() {
        console.log('📊 Refreshing analytics...');
        await this.loadSymptomData();
        this.populateSymptomFilter();
        await this.renderAnalytics();
    }

    /**
     * Destroy all charts
     */
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

// Create global instance
window.Analytics = new Analytics();

console.log('✅ Analytics module loaded');
