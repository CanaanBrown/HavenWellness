# Haven Wellness Dashboard

A clean, responsive dashboard for viewing wellness data with Bootstrap styling and Chart.js visualizations.

## Features

- **Recent Symptoms**: Displays the last 5 symptom entries with pain levels and dates
- **Weekly Pain Chart**: Interactive Chart.js line graph showing average pain levels over the past 7 days
- **Support Groups**: Lists available support groups
- **Quick Stats**: Summary statistics including total symptoms, average pain level, available groups, and symptoms this week

## Usage

1. Start the Haven Wellness API server:
   ```bash
   cd HavenWellness
   dotnet run
   ```

2. Open `dashboard.html` in your web browser

3. The dashboard will automatically fetch data from:
   - `/api/Symptoms` - Symptom entries and details
   - `/api/Groups` - Support groups

## Styling

- **Bootstrap 5.3.2**: Responsive grid layout and components
- **Font Awesome 6.4.0**: Icons for visual enhancement
- **Chart.js**: Interactive charts for data visualization
- **Custom CSS**: Pain level color coding and hover effects

## Pain Level Color Coding

- **Green (1-3)**: Low pain level
- **Yellow (4-6)**: Moderate pain level  
- **Red (7-10)**: High pain level

## File Structure

- `dashboard.html` - Main dashboard page
- `js/dashboard.js` - JavaScript logic for data fetching and rendering
- `js/api.js` - API client utilities (shared with main app)
