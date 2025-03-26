// Global variables
let data = null;
let normalizedData = null;
let charts = {};

// Initialize the dashboard
async function initDashboard() {
    try {
        // Load the data
        const response = await fetch('./data/Student_Performance.csv');
        const csvText = await response.text();
        data = Papa.parse(csvText, { header: true, dynamicTyping: true }).data;
        
        // Remove any rows with missing values
        data = data.filter(row => Object.values(row).every(val => val !== null && !isNaN(val)));
        
        // Normalize the data
        normalizedData = normalizeData(data);
        
        // Update statistics
        updateStatistics();
        
        // Initialize charts
        initCharts();
        
        // Setup view controls
        setupViewControls();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please make sure the CSV file is present in the data directory.');
    }
}

// Normalize the data
function normalizeData(data) {
    const normalized = data.map(row => ({...row}));
    const numericColumns = Object.keys(data[0]).filter(key => typeof data[0][key] === 'number');
    
    numericColumns.forEach(column => {
        const values = data.map(row => row[column]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        normalized.forEach(row => {
            row[column] = (row[column] - min) / (max - min);
        });
    });
    
    return normalized;
}

// Update statistics
function updateStatistics() {
    document.getElementById('total-students').textContent = data.length;
    document.getElementById('total-features').textContent = Object.keys(data[0]).length;
    
    const avgPerformance = data.reduce((sum, row) => sum + row['Performance Index'], 0) / data.length;
    document.getElementById('avg-performance').textContent = avgPerformance.toFixed(2);
}

// Initialize charts
function initCharts() {
    // Performance Distribution Pie Chart
    const performancePieCtx = document.getElementById('performance-pie').getContext('2d');
    const performanceCategories = categorizePerformance();
    
    charts.performancePie = new Chart(performancePieCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(performanceCategories),
            datasets: [{
                data: Object.values(performanceCategories),
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',
                    'rgba(46, 204, 113, 0.8)',
                    'rgba(241, 196, 15, 0.8)',
                    'rgba(231, 76, 60, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Performance Distribution'
                }
            }
        }
    });

    // Top and Bottom Performing Features
    const featureTrendsCtx = document.getElementById('feature-trends').getContext('2d');
    const { topFeatures, bottomFeatures } = calculateFeatureTrends();
    
    charts.featureTrends = new Chart(featureTrendsCtx, {
        type: 'bar',
        data: {
            labels: [...topFeatures.map(f => f.name), ...bottomFeatures.map(f => f.name)],
            datasets: [
                {
                    label: 'Top Performing Features',
                    data: [...topFeatures.map(f => f.impact), ...new Array(bottomFeatures.length).fill(null)],
                    backgroundColor: 'rgba(46, 204, 113, 0.8)'
                },
                {
                    label: 'Bottom Performing Features',
                    data: [...new Array(topFeatures.length).fill(null), ...bottomFeatures.map(f => f.impact)],
                    backgroundColor: 'rgba(231, 76, 60, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Feature Impact on Performance'
                }
            }
        }
    });

    // Feature Distribution Box Plot
    const featureDistributionCtx = document.getElementById('feature-distribution').getContext('2d');
    const numericColumns = Object.keys(data[0]).filter(key => typeof data[0][key] === 'number');
    
    charts.featureDistribution = new Chart(featureDistributionCtx, {
        type: 'boxplot',
        data: {
            labels: numericColumns,
            datasets: [{
                label: 'Feature Distribution',
                data: numericColumns.map(column => {
                    const values = data.map(row => row[column]);
                    return calculateBoxPlotData(values);
                }),
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Feature Distribution (Box Plot)'
                }
            }
        }
    });

    // Correlation Heatmap
    const correlationHeatmapCtx = document.getElementById('correlation-heatmap').getContext('2d');
    const correlationMatrix = calculateCorrelationMatrix(numericColumns);
    
    charts.correlationHeatmap = new Chart(correlationHeatmapCtx, {
        type: 'heatmap',
        data: {
            labels: numericColumns,
            datasets: [{
                label: 'Correlation Matrix',
                data: correlationMatrix,
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Feature Correlation Heatmap'
                }
            }
        }
    });

    // Performance Distribution Histogram
    const performanceDistributionCtx = document.getElementById('performance-distribution').getContext('2d');
    const performanceValues = data.map(row => row['Performance Index']);
    
    charts.performanceDistribution = new Chart(performanceDistributionCtx, {
        type: 'histogram',
        data: {
            labels: Array.from({length: 10}, (_, i) => {
                const min = Math.min(...performanceValues);
                const max = Math.max(...performanceValues);
                const step = (max - min) / 10;
                return `${(min + i * step).toFixed(1)} - ${(min + (i + 1) * step).toFixed(1)}`;
            }),
            datasets: [{
                label: 'Performance Distribution',
                data: calculateHistogram(performanceValues, 10),
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Performance Distribution (Histogram)'
                }
            }
        }
    });

    // Update feature statistics table
    updateFeatureStats();
}

// Categorize performance into levels
function categorizePerformance() {
    const performanceValues = data.map(row => row['Performance Index']);
    const min = Math.min(...performanceValues);
    const max = Math.max(...performanceValues);
    const range = max - min;
    const step = range / 4;

    const categories = {
        'Excellent': 0,
        'Good': 0,
        'Average': 0,
        'Poor': 0
    };

    performanceValues.forEach(value => {
        if (value >= min + 3 * step) categories['Excellent']++;
        else if (value >= min + 2 * step) categories['Good']++;
        else if (value >= min + step) categories['Average']++;
        else categories['Poor']++;
    });

    return categories;
}

// Calculate feature trends
function calculateFeatureTrends() {
    const impact = {};
    const performance = data.map(row => row['Performance Index']);
    
    Object.keys(data[0]).forEach(key => {
        if (key !== 'Performance Index' && typeof data[0][key] === 'number') {
            const values = data.map(row => row[key]);
            impact[key] = Math.abs(calculateCorrelation(values, performance));
        }
    });

    const sortedFeatures = Object.entries(impact)
        .map(([name, impact]) => ({ name, impact }))
        .sort((a, b) => b.impact - a.impact);

    return {
        topFeatures: sortedFeatures.slice(0, 5),
        bottomFeatures: sortedFeatures.slice(-5).reverse()
    };
}

// Calculate box plot data
function calculateBoxPlotData(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const min = Math.max(sorted[0], q1 - 1.5 * iqr);
    const max = Math.min(sorted[sorted.length - 1], q3 + 1.5 * iqr);
    const median = sorted[Math.floor(sorted.length * 0.5)];

    return {
        min,
        q1,
        median,
        q3,
        max
    };
}

// Calculate correlation matrix
function calculateCorrelationMatrix(columns) {
    const matrix = [];
    for (let i = 0; i < columns.length; i++) {
        matrix[i] = [];
        for (let j = 0; j < columns.length; j++) {
            matrix[i][j] = calculateCorrelation(
                data.map(row => row[columns[i]]),
                data.map(row => row[columns[j]])
            );
        }
    }
    return matrix;
}

// Calculate correlation between two arrays
function calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    const sumY2 = y.reduce((a, b) => a + b * b, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return numerator / denominator;
}

// Calculate histogram data
function calculateHistogram(values, bins) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const step = (max - min) / bins;
    const histogram = new Array(bins).fill(0);
    
    values.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / step), bins - 1);
        histogram[binIndex]++;
    });
    
    return histogram;
}

// Update feature statistics table
function updateFeatureStats() {
    const tbody = document.querySelector('#feature-stats tbody');
    tbody.innerHTML = '';
    
    Object.keys(data[0]).forEach(key => {
        if (typeof data[0][key] === 'number') {
            const values = data.map(row => row[key]);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
            const min = Math.min(...values);
            const max = Math.max(...values);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${key}</td>
                <td>${mean.toFixed(2)}</td>
                <td>${stdDev.toFixed(2)}</td>
                <td>${min.toFixed(2)}</td>
                <td>${max.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        }
    });
}

// Setup view controls
function setupViewControls() {
    const buttons = document.querySelectorAll('.view-btn');
    const views = document.querySelectorAll('.view');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const targetView = button.dataset.view;
            
            // Update active button
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show target view
            views.forEach(view => {
                view.classList.toggle('hidden', view.id !== targetView);
            });
        });
    });
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', initDashboard); 