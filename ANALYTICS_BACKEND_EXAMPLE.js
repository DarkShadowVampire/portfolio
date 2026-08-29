/**
 * Sample Analytics Backend Implementation
 * 
 * This is a reference implementation for handling visitor tracking data.
 * Adapt this to your specific backend stack and requirements.
 */

// ============================================
// NODE.JS / EXPRESS EXAMPLE
// ============================================

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (use database in production)
const analyticsData = [];
const visitorSessions = new Map();

/**
 * Analytics endpoint to receive visitor data
 */
app.post('/api/analytics', async (req, res) => {
  try {
    const { visitorId, sessionId, events, timestamp } = req.body;

    if (!visitorId || !sessionId || !events) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process each event
    const processedEvents = events.map(event => ({
      ...event,
      visitorId,
      sessionId,
      receivedAt: new Date().toISOString(),
    }));

    // Store events (in production, save to database)
    analyticsData.push(...processedEvents);

    // Track unique sessions
    if (!visitorSessions.has(visitorId)) {
      visitorSessions.set(visitorId, []);
    }
    const sessions = visitorSessions.get(visitorId);
    if (!sessions.includes(sessionId)) {
      sessions.push(sessionId);
    }

    // Log for monitoring
    console.log(`[ANALYTICS] Received ${events.length} events from visitor ${visitorId}`);

    res.status(200).json({
      success: true,
      message: 'Analytics recorded successfully',
      eventsProcessed: events.length,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to process analytics' });
  }
});

/**
 * Get analytics summary
 */
app.get('/api/analytics/summary', (req, res) => {
  try {
    const summary = {
      totalEvents: analyticsData.length,
      totalVisitors: visitorSessions.size,
      eventTypes: {},
      devices: {},
      browsers: {},
      operatingSystems: {},
      pageViews: 0,
      averageScrollDepth: 0,
      averageTimeOnPage: 0,
    };

    let totalScrollDepth = 0;
    let totalTimeOnPage = 0;
    let timeOnPageCount = 0;
    const sessionStartTimes = {};
    const sessionEndTimes = {};

    analyticsData.forEach(event => {
      // Count event types
      summary.eventTypes[event.type] = (summary.eventTypes[event.type] || 0) + 1;

      if (event.type === 'pageview') {
        summary.pageViews++;
      }

      const data = event.data || {};

      // Track device types
      if (data.device?.type) {
        summary.devices[data.device.type] = (summary.devices[data.device.type] || 0) + 1;
      }

      // Track browsers
      if (data.browser?.name) {
        summary.browsers[data.browser.name] = (summary.browsers[data.browser.name] || 0) + 1;
      }

      // Track operating systems
      if (data.os?.name) {
        summary.operatingSystems[data.os.name] = (summary.operatingSystems[data.os.name] || 0) + 1;
      }

      // Calculate scroll depth
      if (data.interactionData?.scrollDepth) {
        totalScrollDepth += data.interactionData.scrollDepth;
      }

      // Calculate time on page
      if (data.interactionData?.timeOnPage) {
        totalTimeOnPage += data.interactionData.timeOnPage;
        timeOnPageCount++;
      }

      // Track session start/end times
      if (event.type === 'session_start') {
        sessionStartTimes[event.sessionId] = data.timestamp;
      }
      if (event.type === 'session_end') {
        sessionEndTimes[event.sessionId] = data.timestamp;
      }
    });

    summary.averageScrollDepth = analyticsData.length > 0 ? totalScrollDepth / analyticsData.length : 0;
    summary.averageTimeOnPage = timeOnPageCount > 0 ? totalTimeOnPage / timeOnPageCount : 0;

    res.json(summary);
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

/**
 * Get visitor details
 */
app.get('/api/analytics/visitor/:visitorId', (req, res) => {
  try {
    const { visitorId } = req.params;
    
    const visitorEvents = analyticsData.filter(event => event.visitorId === visitorId);
    
    if (visitorEvents.length === 0) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    // Group by session
    const sessions = {};
    visitorEvents.forEach(event => {
      if (!sessions[event.sessionId]) {
        sessions[event.sessionId] = [];
      }
      sessions[event.sessionId].push(event);
    });

    res.json({
      visitorId,
      totalSessions: Object.keys(sessions).length,
      totalEvents: visitorEvents.length,
      sessions,
    });
  } catch (error) {
    console.error('Visitor details error:', error);
    res.status(500).json({ error: 'Failed to get visitor details' });
  }
});

/**
 * Export analytics as CSV
 */
app.get('/api/analytics/export/csv', (req, res) => {
  try {
    let csv = 'Timestamp,VisitorID,SessionID,EventType,PageURL,Value\n';

    analyticsData.forEach(event => {
      const data = event.data || {};
      const row = [
        new Date(data.timestamp || event.receivedAt).toISOString(),
        data.visitorId || '',
        data.sessionId || '',
        event.type,
        data.pageUrl || '',
        event.value ? JSON.stringify(event.value) : '',
      ];
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
    res.send(csv);
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

/**
 * Clear analytics (development only)
 */
app.delete('/api/analytics/clear', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not allowed in production' });
  }

  analyticsData.length = 0;
  visitorSessions.clear();
  res.json({ message: 'Analytics cleared' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Analytics server running on port ${PORT}`);
});

module.exports = app;


// ============================================
// DATABASE SCHEMA EXAMPLES
// ============================================

/**
 * MongoDB schema example
 */
const analyticsEventSchema = {
  _id: 'ObjectId',
  visitorId: 'String',
  sessionId: 'String',
  eventType: 'String', // 'pageview', 'interaction', 'session_start', 'session_end'
  timestamp: 'Date',
  pageUrl: 'String',
  pageTitle: 'String',
  referrer: 'String',
  device: {
    type: 'String', // 'mobile', 'tablet', 'desktop'
    isTouchEnabled: 'Boolean'
  },
  browser: {
    name: 'String',
    version: 'String'
  },
  os: {
    name: 'String',
    version: 'String'
  },
  interactionData: {
    clicks: 'Number',
    scrollDepth: 'Number',
    timeOnPage: 'Number'
  },
  customData: 'Object',
  createdAt: 'Date'
};

/**
 * PostgreSQL schema example
 */
/*
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  visitor_id UUID NOT NULL,
  session_id UUID NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  timestamp BIGINT NOT NULL,
  page_url TEXT,
  page_title TEXT,
  referrer TEXT,
  device_type VARCHAR(20),
  browser_name VARCHAR(50),
  browser_version VARCHAR(20),
  os_name VARCHAR(50),
  os_version VARCHAR(20),
  scroll_depth FLOAT,
  time_on_page BIGINT,
  clicks INT,
  custom_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visitor_id (visitor_id),
  INDEX idx_session_id (session_id),
  INDEX idx_timestamp (timestamp)
);
*/

/**
 * Google Sheets integration example
 */
const appendToSheet = async (event) => {
  const { google } = require('googleapis');
  
  const sheets = google.sheets('v4');
  
  // Your Google Sheets integration logic here
  // This requires setting up Google Cloud credentials
};


// ============================================
// FIREBASE EXAMPLE
// ============================================

const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const analyticsRef = db.collection('analytics');

const recordAnalytics = async (visitorId, sessionId, events) => {
  const batch = db.batch();
  
  events.forEach(event => {
    const docRef = analyticsRef.doc();
    batch.set(docRef, {
      visitorId,
      sessionId,
      ...event.data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  
  await batch.commit();
};


// ============================================
// DATA PRIVACY & COMPLIANCE TIPS
// ============================================

/**
 * 1. GDPR Compliance
 *    - Store user's consent for tracking
 *    - Implement data retention policies (e.g., delete after 90 days)
 *    - Allow users to request data deletion
 *    - Never collect unnecessary personal data
 */

/**
 * 2. Data Anonymization
 *    - Hash visitor IDs before storage
 *    - Remove/mask IP addresses if not needed
 *    - Don't log sensitive data
 */

/**
 * 3. Data Security
 *    - Use HTTPS/TLS for all data transmission
 *    - Encrypt data at rest
 *    - Implement proper authentication
 *    - Regular security audits
 */

/**
 * 4. Data Retention
 *    - Define retention periods for different data types
 *    - Implement automated cleanup jobs
 *    - Log data deletions for compliance
 */

/**
 * 5. Monitoring & Alerting
 *    - Alert on unusual traffic patterns
 *    - Monitor for data anomalies
 *    - Track analytics performance
 */
