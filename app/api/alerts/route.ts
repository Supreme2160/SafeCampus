import { NextRequest, NextResponse } from 'next/server';

interface NDMAAlert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  timestamp: string;
  category: string;
  source: string;
}

// Mock data for demonstration - In production, this would fetch from NDMA API
// NDMA doesn't have a public REST API, so we'll create a fallback system
async function fetchAlertsFromAPI(): Promise<NDMAAlert[]> {
  try {
    // Attempt to fetch from a mock disaster API or RSS feed
    // For demonstration, we'll use sample data
    // In production, you could integrate with:
    // 1. NDMA RSS feeds
    // 2. Government disaster APIs
    // 3. Weather APIs like OpenWeatherMap for weather alerts
    
    const mockAlerts: NDMAAlert[] = [
      {
        id: '1',
        title: 'Heavy Rainfall Alert',
        description: 'Heavy rainfall expected in the region. Please stay indoors and avoid travel unless necessary.',
        severity: 'high',
        location: 'Delhi NCR',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        category: 'Weather',
        source: 'India Meteorological Department',
      },
      {
        id: '2',
        title: 'Earthquake Preparedness Drill',
        description: 'Scheduled earthquake preparedness drill in educational institutions. Please participate actively.',
        severity: 'low',
        location: 'All Campuses',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        category: 'Drill',
        source: 'NDMA',
      },
      {
        id: '3',
        title: 'Fire Safety Alert',
        description: 'Increased fire risk due to dry weather conditions. Ensure fire safety equipment is functional.',
        severity: 'medium',
        location: 'Northern India',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        category: 'Fire Safety',
        source: 'State Disaster Management Authority',
      },
    ];

    // TODO: Replace with actual API call
    // Example: const response = await fetch('https://api.ndma.gov.in/alerts');
    // const data = await response.json();
    
    return mockAlerts;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
}

// Alternative: Fetch from OpenWeatherMap API for weather-related alerts
async function fetchWeatherAlerts(apiKey?: string): Promise<NDMAAlert[]> {
  if (!apiKey) return [];
  
  try {
    // Example for Delhi coordinates
    const lat = 28.6139;
    const lon = 77.2090;
    
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=minutely,hourly,daily`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const alerts: NDMAAlert[] = [];
    
    if (data.alerts && data.alerts.length > 0) {
      data.alerts.forEach((alert: any, index: number) => {
        alerts.push({
          id: `weather-${index}`,
          title: alert.event,
          description: alert.description,
          severity: 'medium',
          location: 'Current Location',
          timestamp: new Date(alert.start * 1000).toISOString(),
          category: 'Weather',
          source: 'OpenWeatherMap',
        });
      });
    }
    
    return alerts;
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    // Fetch alerts from multiple sources
    const ndmaAlerts = await fetchAlertsFromAPI();
    
    // Optionally fetch weather alerts if API key is available
    const weatherApiKey = process.env.OPENWEATHER_API_KEY;
    const weatherAlerts = weatherApiKey ? await fetchWeatherAlerts(weatherApiKey) : [];
    
    // Combine all alerts
    const allAlerts = [...ndmaAlerts, ...weatherAlerts];
    
    // Sort by timestamp (newest first)
    allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return NextResponse.json({ 
      success: true,
      alerts: allAlerts,
      count: allAlerts.length 
    });
  } catch (error) {
    console.error('Error in alerts API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch alerts',
        alerts: [] 
      },
      { status: 500 }
    );
  }
}
