/**
 * Utility functions for exporting and analyzing visitor data
 */

export const analyticsExporter = {
  /**
   * Export analytics data as CSV
   */
  exportAsCSV: (filename: string = "analytics.csv"): void => {
    try {
      const events = JSON.parse(localStorage.getItem("portfolio_analytics_events") || "[]");
      if (events.length === 0) {
        alert("No analytics data to export");
        return;
      }

      let csv = "Timestamp,Type,Visitor ID,Session ID,Page URL,Target,Value\n";

      events.forEach((event: any) => {
        const data = event.data;
        const row = [
          new Date(data.timestamp).toISOString(),
          event.type,
          data.visitorId || "",
          data.sessionId || "",
          data.pageUrl || "",
          data.target || "",
          data.value ? JSON.stringify(data.value) : "",
        ];
        csv += row.map((cell) => `"${cell}"`).join(",") + "\n";
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export analytics:", error);
    }
  },

  /**
   * Export analytics data as JSON
   */
  exportAsJSON: (filename: string = "analytics.json"): void => {
    try {
      const events = JSON.parse(localStorage.getItem("portfolio_analytics_events") || "[]");
      if (events.length === 0) {
        alert("No analytics data to export");
        return;
      }

      const blob = new Blob([JSON.stringify(events, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export analytics:", error);
    }
  },

  /**
   * Get analytics summary
   */
  getAnalyticsSummary: (): Record<string, any> => {
    try {
      const events = JSON.parse(localStorage.getItem("portfolio_analytics_events") || "[]");

      const summary = {
        totalEvents: events.length,
        eventTypes: {} as Record<string, number>,
        uniqueVisitors: new Set<string>(),
        uniqueSessions: new Set<string>(),
        pageViews: 0,
        avgTimeOnPage: 0,
        totalClicks: 0,
        deviceTypes: {} as Record<string, number>,
        browsers: {} as Record<string, number>,
        operatingSystems: {} as Record<string, number>,
      };

      let totalTimeOnPage = 0;
      let pageViewCount = 0;

      events.forEach((event: any) => {
        const data = event.data;

        // Count event types
        summary.eventTypes[event.type] = (summary.eventTypes[event.type] || 0) + 1;

        // Track unique visitors and sessions
        if (data.visitorId) summary.uniqueVisitors.add(data.visitorId);
        if (data.sessionId) summary.uniqueSessions.add(data.sessionId);

        // Count page views
        if (event.type === "pageview") {
          summary.pageViews++;
        }

        // Aggregate time on page
        if (data.interactionData?.timeOnPage) {
          totalTimeOnPage += data.interactionData.timeOnPage;
          pageViewCount++;
        }

        // Count clicks
        if (data.interactionData?.clicks) {
          summary.totalClicks += data.interactionData.clicks;
        }

        // Device types
        if (data.device?.type) {
          summary.deviceTypes[data.device.type] = (summary.deviceTypes[data.device.type] || 0) + 1;
        }

        // Browsers
        if (data.browser?.name) {
          summary.browsers[data.browser.name] = (summary.browsers[data.browser.name] || 0) + 1;
        }

        // Operating systems
        if (data.os?.name) {
          summary.operatingSystems[data.os.name] = (summary.operatingSystems[data.os.name] || 0) + 1;
        }
      });

      return {
        ...summary,
        uniqueVisitors: summary.uniqueVisitors.size,
        uniqueSessions: summary.uniqueSessions.size,
        avgTimeOnPage: pageViewCount > 0 ? totalTimeOnPage / pageViewCount : 0,
      };
    } catch (error) {
      console.error("Failed to get analytics summary:", error);
      return {};
    }
  },

  /**
   * Clear all analytics data
   */
  clearAnalytics: (): void => {
    try {
      localStorage.removeItem("portfolio_analytics_events");
      console.log("Analytics data cleared");
    } catch (error) {
      console.error("Failed to clear analytics:", error);
    }
  },

  /**
   * Get raw analytics data
   */
  getRawAnalytics: (): any[] => {
    try {
      return JSON.parse(localStorage.getItem("portfolio_analytics_events") || "[]");
    } catch (error) {
      console.error("Failed to get raw analytics:", error);
      return [];
    }
  },
};

export default analyticsExporter;
