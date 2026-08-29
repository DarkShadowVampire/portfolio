# Visitor Tracking System Documentation

## Overview

This portfolio now includes a comprehensive visitor tracking system that collects detailed analytics about your visitors. The system is designed to be privacy-friendly, efficient, and easy to use.

## Data Collected

### Session & Timing
- **Session ID**: Unique identifier for each visitor session
- **Visitor ID**: Persistent identifier across sessions (stored in localStorage)
- **Timestamp**: When the visit occurred
- **Page Load Time**: Performance metric for page load

### Page Information
- **Page URL**: Current page being visited
- **Page Title**: Title of the page
- **Referrer**: Where the visitor came from

### Browser & Device Information
- **User Agent**: Complete browser/device information
- **Browser Name & Version**: e.g., Chrome 120.0
- **Operating System & Version**: e.g., macOS 14.2
- **Device Type**: Mobile, Tablet, or Desktop
- **Touch Enabled**: Whether device supports touch

### Screen & Display
- **Screen Resolution**: Native screen dimensions (e.g., 1920x1080)
- **Color Depth**: Bits per pixel
- **Window Size**: Current browser window dimensions

### Network & Localization
- **Connection Type**: Network speed (4g, 3g, 2g, etc.)
- **Language**: Browser language setting
- **Timezone**: User's timezone
- **Timezone Offset**: Minutes offset from UTC
- **Geolocation**: Optional GPS coordinates (requires user permission)

### Storage Capabilities
- **LocalStorage Enabled**: Whether persistent storage works
- **SessionStorage Enabled**: Whether session storage works
- **Cookies Enabled**: Whether cookies are allowed

### User Interaction Data
- **Clicks**: Total number of clicks on the page
- **Scroll Depth**: How far down the page the user scrolled (percentage)
- **Time on Page**: How long the user spent on the current page
- **Last Active Time**: When the user last interacted with the page

## Usage

### Basic Setup

The tracking is already integrated into your portfolio. It automatically starts when the page loads in the Home component.

```typescript
import useVisitorTracking from "./hooks/useVisitorTracking";

const Home = () => {
  useVisitorTracking({
    trackPageView: true,
    batchSize: 10,
    flushInterval: 30000, // Flush every 30 seconds
    analyticsEndpoint: "https://your-api.com/track", // Optional
  });
  
  // Your component code...
};
```

### Configuration Options

```typescript
interface UseVisitorTrackingOptions {
  analyticsEndpoint?: string;      // URL to send analytics data
  trackPageView?: boolean;          // Auto-track page views (default: true)
  batchSize?: number;               // Events before auto-flush (default: 10)
  flushInterval?: number;           // Time between flushes in ms (default: 30000)
}
```

### Accessing Tracking Data

The hook returns utility functions:

```typescript
const {
  getVisitorId,           // Get unique visitor ID
  getSessionId,           // Get current session ID
  getVisitorData,         // Get all collected visitor data
  trackPageView,          // Manually track page views
  trackEvent,             // Track custom events
  setCustomData,          // Add custom data to tracking
  requestGeolocation,     // Request user's location (with permission)
  getEvents,              // Get all tracked events
  getStoredAnalytics,     // Get analytics from localStorage
} = useVisitorTracking();
```

### Manual Event Tracking

```typescript
import { visitorTracking } from "./services/visitorTracking";

// Track custom events
visitorTracking.trackEvent("click", "download-resume-button");
visitorTracking.trackEvent("form_interaction", "contact-form", { field: "email" });

// Add custom data
visitorTracking.setCustomData("user_preference", "dark_mode");

// Request geolocation
const geo = await visitorTracking.requestGeolocation();
if (geo) {
  console.log(`User at ${geo.latitude}, ${geo.longitude}`);
}
```

## Debug Panel

A debug panel is available in **development mode only** (when `NODE_ENV === 'development'`).

### Features
- View real-time visitor data
- Display device and browser information
- Show user interaction statistics
- Analytics summary (total events, unique visitors, etc.)
- Request geolocation
- Export data as JSON or CSV
- Clear analytics data

### Accessing the Debug Panel
1. Run your portfolio with `npm start` (development mode)
2. Look for the "Show Analytics" button in the bottom-right corner
3. Click to open the analytics debug panel

## Sending Data to Backend

To send analytics data to your backend:

1. Set the `analyticsEndpoint` in your tracking configuration:

```typescript
useVisitorTracking({
  analyticsEndpoint: "https://your-api.com/api/analytics",
});
```

2. Your backend should expect POST requests with the following format:

```json
{
  "visitorId": "unique-visitor-id",
  "sessionId": "unique-session-id",
  "events": [
    {
      "type": "pageview|interaction|session_start|session_end",
      "data": { /* event data */ }
    }
  ],
  "timestamp": 1234567890
}
```

## Storage & Privacy

### Local Storage
- Events are stored in localStorage by default (up to 1000 recent events)
- Each visitor has a unique ID stored in localStorage
- Data persists across browser sessions

### Sensitive Data
- No passwords or sensitive personal data is collected
- Geolocation requires explicit user permission
- Referrer information may contain sensitive data - consider your privacy policy

### Privacy Recommendations
1. **Inform Users**: Add a privacy policy explaining tracking
2. **Geolocation**: Only request when necessary
3. **Data Retention**: Implement server-side data cleanup
4. **GDPR Compliance**: Implement consent mechanisms if needed

## Exporting Analytics

### In Development (using Debug Panel)
- Click "Export JSON" to download as JSON
- Click "Export CSV" to download as CSV
- Data includes all events from the session

### Programmatically
```typescript
import { analyticsExporter } from "./utils/analyticsExporter";

// Export as JSON
analyticsExporter.exportAsJSON("my-analytics.json");

// Export as CSV
analyticsExporter.exportAsCSV("my-analytics.csv");

// Get analytics summary
const summary = analyticsExporter.getAnalyticsSummary();
console.log(summary);

// Get raw analytics
const rawData = analyticsExporter.getRawAnalytics();

// Clear analytics
analyticsExporter.clearAnalytics();
```

## API Reference

### `visitorTracking` Service

```typescript
// Initialize tracking
visitorTracking.init(analyticsEndpoint?, { batchSize?, flushInterval? });

// Track page view
visitorTracking.trackPageView(pageTitle?: string);

// Track custom event
visitorTracking.trackEvent(
  type: "click" | "scroll" | "form_interaction" | "custom",
  target?: string,
  value?: any
);

// Add custom data
visitorTracking.setCustomData(key: string, value: any);

// Get all collected data
const data: VisitorData = visitorTracking.getVisitorData();

// Request geolocation
const coords = await visitorTracking.requestGeolocation();

// Get tracked events
const events = visitorTracking.getEvents();

// Flush events to endpoint/storage
await visitorTracking.flush();

// Set analytics endpoint
visitorTracking.setAnalyticsEndpoint("https://api.example.com");

// Get IDs
const visitorId = visitorTracking.getVisitorId();
const sessionId = visitorTracking.getSessionId();
```

## Performance Considerations

- Events are batched and flushed periodically to reduce network requests
- Default batch size is 10 events or flush interval of 30 seconds
- Scroll and interaction tracking is throttled for performance
- Data is stored locally first, sent asynchronously

## Browser Support

- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for browsers without certain APIs
- LocalStorage/SessionStorage are optional but recommended
- Geolocation requires HTTPS in most cases

## Troubleshooting

### Debug Panel Not Showing
- Ensure you're running in development mode (`npm start`)
- Check browser console for errors
- Panel appears only if `NODE_ENV === 'development'`

### Analytics Data Not Persisting
- Check if localStorage is enabled
- Check browser's privacy/security settings
- Open DevTools → Application → LocalStorage to verify

### Geolocation Not Working
- Ensure site is served over HTTPS
- Check browser permissions
- User must grant permission when prompted

### Events Not Sending to Backend
- Verify analytics endpoint URL is correct
- Check network tab in DevTools
- Ensure backend returns 200 OK response
- Check CORS headers if cross-origin

## Examples

### Track Button Clicks
```typescript
<button 
  onClick={() => {
    visitorTracking.trackEvent("click", "cta-button", { text: "Get Started" });
    // Handle click...
  }}
>
  Get Started
</button>
```

### Track Form Submissions
```typescript
const handleSubmit = (e) => {
  e.preventDefault();
  visitorTracking.trackEvent("form_interaction", "contact-form", { 
    fields: ["name", "email", "message"] 
  });
  // Submit form...
};
```

### Track Custom Milestones
```typescript
const handleArtistClick = (artistName) => {
  visitorTracking.setCustomData("viewed_artist", artistName);
  // Navigate to artist profile...
};
```

### Get Real-time Visitor Stats
```typescript
const { getVisitorData, getStoredAnalytics } = useVisitorTracking();

// Get current visitor data
const visitorData = getVisitorData();
console.log(`Visitor from ${visitorData.os.name} using ${visitorData.browser.name}`);

// Get analytics summary
const analytics = getStoredAnalytics();
console.log(`Total events tracked: ${analytics.length}`);
```

## File Structure

```
src/
├── services/
│   └── visitorTracking.ts          # Core tracking service
├── hooks/
│   └── useVisitorTracking.ts       # React hook for tracking
├── utils/
│   └── analyticsExporter.ts        # Export and analyze data
└── components/
    └── AnalyticsDebugPanel.tsx     # Debug panel component
```

## Next Steps

1. **Backend Integration**: Set up an analytics endpoint to persist data
2. **Privacy Policy**: Add tracking disclosure to privacy policy
3. **Data Visualization**: Create dashboard to visualize analytics
4. **Custom Events**: Add more specific event tracking for your portfolio
5. **Goals**: Set up conversion tracking for portfolio goals

## Support

For issues or questions about the tracking system:
1. Check this documentation
2. Review console errors in browser DevTools
3. Use the debug panel to inspect data
4. Check the code comments in the service files

---

**Last Updated**: 2024
**Version**: 1.0.0
