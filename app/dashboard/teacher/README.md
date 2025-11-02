# Teacher Dashboard

## Overview

The Teacher Dashboard provides comprehensive analytics and insights into student engagement, module completion, and game performance. It features interactive charts and real-time statistics similar to modern analytics dashboards.

## Features

### 📊 Key Metrics Cards
- **Total Students**: Shows total enrolled students with month-over-month growth percentage
- **Total Games Played**: Aggregate count of all games played across the platform
- **Active Engagement**: Total modules completed by all students

### 📈 Interactive Charts

#### 1. Student Engagement (Area Chart)
- Tracks monthly active users over the past 12 months
- Shows engagement trends with smooth gradient visualization
- Helps identify peak activity periods

#### 2. Module Performance (Bar Chart)
- Displays top 8 modules by completion rate
- Horizontal bar chart for easy comparison
- Shows which modules are most popular with students

#### 3. Game Distribution (Donut Chart)
- Visualizes game types played with percentage breakdown
- Color-coded segments for different game types
- Interactive tooltips for detailed information

### 📋 Data Tables

#### Top Performing Students
- Ranked by games played and performance
- Shows average scores with color-coded indicators:
  - 🟢 Green: 70%+ (Excellent)
  - 🟡 Yellow: 50-69% (Good)
  - 🔴 Red: <50% (Needs Improvement)
- Includes modules completed count

#### Recent Activity
- Latest 10 game sessions
- Student name, game type, score, and date
- Real-time updates of student activity

## Technical Implementation

### Components Used
- **Recharts**: Area, Bar, and Pie charts for data visualization
- **Shadcn UI**: Card, Table, Badge components
- **Custom Analytics API**: Server-side data aggregation

### Data Sources
- `Student` model: Enrollment and engagement data
- `GameScore` model: Game performance metrics
- `Modules` model: Module completion tracking

### API Endpoint
- **Route**: `/api/dashboard/teacher-analytics`
- **Method**: GET
- **Auth**: Requires teacher role

## Color Scheme

The dashboard uses a consistent color palette:
- Chart 1 (Blue): `hsl(221 83% 53%)`
- Chart 2 (Green): `hsl(142 71% 45%)`
- Chart 3 (Yellow): `hsl(45 93% 47%)`
- Chart 4 (Purple): `hsl(280 65% 60%)`
- Chart 5 (Orange): `hsl(16 85% 55%)`

## Responsive Design

The dashboard is fully responsive:
- **Mobile**: Single column layout
- **Tablet**: 2-column grid for charts
- **Desktop**: Optimized 2-column layout with full-width engagement chart

## Usage

Teachers can access the dashboard at:
```
/dashboard/teacher
```

The dashboard automatically:
1. Authenticates the user
2. Verifies teacher role
3. Fetches and aggregates data
4. Renders interactive visualizations

## Future Enhancements

Potential improvements:
- Export data to CSV/PDF
- Custom date range selection
- Student drill-down views
- Real-time notifications
- Comparison between time periods
- Class/cohort filtering
