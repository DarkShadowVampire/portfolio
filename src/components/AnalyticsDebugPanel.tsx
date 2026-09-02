import React, { useState, useEffect } from "react";
import { visitorTracking } from "../services/visitorTracking";
import { analyticsExporter } from "../utils/analyticsExporter";

/**
 * Debug panel for viewing and managing visitor analytics
 * Protected with password authentication
 */
const AnalyticsDebugPanel: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [visitorData, setVisitorData] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [authError, setAuthError] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<"summary" | "table">("summary");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "timestamp", direction: "desc" });

  // Replace this with your actual password
  const ANALYTICS_PASSWORD = process.env.REACT_APP_ANALYTICS_PASSWORD;

  // Hooks must be called before any early returns
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setVisitorData(visitorTracking.getVisitorData());
      setSummary(analyticsExporter.getAnalyticsSummary());
      // Get all events from localStorage
      const storedEvents = JSON.parse(localStorage.getItem("portfolio_analytics_events") || "[]");
      setEvents(storedEvents);
    }
  }, [isOpen, isAuthenticated]);

  // Check if user was already authenticated in this session
  useEffect(() => {
    const isSessionAuth = sessionStorage.getItem("analytics_authenticated") === "true";
    if (isSessionAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  // Keyboard shortcut to open analytics panel (private shortcut)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ANALYTICS_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError("");
      // Store auth in session storage (not persistent across browser close for security)
      sessionStorage.setItem("analytics_authenticated", "true");
    } else {
      setAuthError("Invalid password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    sessionStorage.removeItem("analytics_authenticated");
  };

  const handleRequestGeo = async () => {
    const geo = await visitorTracking.requestGeolocation();
    if (geo) {
      setVisitorData((prev: any) => ({
        ...prev,
        geolocation: {
          latitude: geo.latitude,
          longitude: geo.longitude,
          accuracy: geo.accuracy,
        },
      }));
    }
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortedEvents = () => {
    let sortedEvents = [...events];
    if (sortConfig.key) {
      sortedEvents.sort((a, b) => {
        let aValue = a;
        let bValue = b;

        // Navigate nested properties
        const keys = sortConfig.key.split(".");
        for (const k of keys) {
          aValue = aValue?.[k];
          bValue = bValue?.[k];
        }

        // Handle different types
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    return sortedEvents;
  };

  const SortHeader = ({ label, sortKey }: { label: string; sortKey: string }) => (
    <th
      style={{
        padding: "8px",
        textAlign: "left",
        backgroundColor: isDark ? "#333" : "#f0f0f0",
        border: `1px solid ${isDark ? "#555" : "#ddd"}`,
        cursor: "pointer",
        userSelect: "none",
        fontSize: "11px",
        fontWeight: "bold",
      }}
      onClick={() => handleSort(sortKey)}
      title="Click to sort"
    >
      {label} {sortConfig.key === sortKey ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
    </th>
  );

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 10000,
    fontFamily: "monospace",
    fontSize: "12px",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 20px",
    backgroundColor: isDark ? "#333" : "#f0f0f0",
    border: `2px solid ${isDark ? "#666" : "#ccc"}`,
    borderRadius: "4px",
    cursor: "pointer",
    color: isDark ? "#fff" : "#000",
    fontSize: "12px",
    fontWeight: "bold",
  };

  const panelContentStyle: React.CSSProperties = {
    backgroundColor: isDark ? "#1a1a1a" : "#f9f9f9",
    border: `2px solid ${isDark ? "#666" : "#ddd"}`,
    borderRadius: "4px",
    padding: "15px",
    maxWidth: viewMode === "table" ? "900px" : "500px",
    maxHeight: viewMode === "table" ? "700px" : "600px",
    overflowY: "auto",
    color: isDark ? "#e0e0e0" : "#333",
    marginBottom: "10px",
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: `1px solid ${isDark ? "#444" : "#ddd"}`,
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px",
    marginTop: "5px",
    marginBottom: "10px",
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: isDark ? "#333" : "#fff",
    color: isDark ? "#e0e0e0" : "#333",
    border: `1px solid ${isDark ? "#555" : "#ccc"}`,
    borderRadius: "4px",
    fontSize: "12px",
  };

  const errorStyle: React.CSSProperties = {
    color: "#ff6b6b",
    marginTop: "5px",
    fontSize: "12px",
  };

  // Only render the panel when opened via keyboard shortcut or button
  if (!isOpen) {
    return null;
  }

  return (
    <div style={panelStyle}>
      <div style={panelContentStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <h3 style={{ margin: 0 }}>📊 Analytics Dashboard</h3>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              ...buttonStyle,
              padding: "5px 10px",
              fontSize: "14px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              color: isDark ? "#e0e0e0" : "#333",
            }}
            title="Close analytics panel"
          >
            ✕
          </button>
        </div>

          {!isAuthenticated ? (
            <div>
              <p style={{ marginTop: 0, fontSize: "12px" }}>
                🔒 Authentication Required
              </p>
              <form onSubmit={handlePasswordSubmit}>
                <label style={{ display: "block", fontSize: "12px" }}>
                  Password:
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError("");
                    }}
                    placeholder="Enter password"
                    style={inputStyle}
                    autoFocus
                  />
                </label>
                <button
                  type="submit"
                  style={{
                    ...buttonStyle,
                    padding: "8px 15px",
                    width: "100%",
                    marginTop: "5px",
                  }}
                >
                  Unlock Analytics
                </button>
                {authError && <div style={errorStyle}>❌ {authError}</div>}
              </form>
            </div>
          ) : (
            <div>
              {/* View Mode Toggle */}
              <div style={{ display: "flex", gap: "5px", marginBottom: "15px" }}>
                <button
                  onClick={() => setViewMode("summary")}
                  style={{
                    ...buttonStyle,
                    fontSize: "11px",
                    padding: "5px 10px",
                    flex: 1,
                    backgroundColor: viewMode === "summary" ? (isDark ? "#444" : "#e0e0e0") : (isDark ? "#333" : "#f0f0f0"),
                    fontWeight: viewMode === "summary" ? "bold" : "normal",
                  }}
                >
                  📊 Summary
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  style={{
                    ...buttonStyle,
                    fontSize: "11px",
                    padding: "5px 10px",
                    flex: 1,
                    backgroundColor: viewMode === "table" ? (isDark ? "#444" : "#e0e0e0") : (isDark ? "#333" : "#f0f0f0"),
                    fontWeight: viewMode === "table" ? "bold" : "normal",
                  }}
                >
                  📋 Table View
                </button>
              </div>

              {/* Logout Button */}
              <div style={{ marginBottom: "15px" }}>
                <button
                  style={{
                    ...buttonStyle,
                    fontSize: "11px",
                    padding: "5px 10px",
                    width: "100%",
                    backgroundColor: isDark ? "#400" : "#fdd",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>

              {viewMode === "summary" ? (
                <>
                  {/* Visitor ID & Session */}
                  {visitorData && (
                    <div style={sectionStyle}>
                      <strong>Session Info:</strong>
                      <div>Visitor ID: {visitorData.sessionId?.substring(0, 12)}...</div>
                      <div>Session ID: {visitorData.sessionId?.substring(0, 12)}...</div>
                      <div>Page URL: {visitorData.pageUrl?.substring(0, 40)}...</div>
                    </div>
                  )}

                  {/* Device Info */}
                  {visitorData && (
                    <div style={sectionStyle}>
                      <strong>Device Info:</strong>
                      <div>Type: {visitorData.device?.type}</div>
                      <div>
                        {visitorData.browser?.name} {visitorData.browser?.version}
                      </div>
                      <div>
                        {visitorData.os?.name} {visitorData.os?.version}
                      </div>
                      <div>Screen: {visitorData.screenResolution?.width}x{visitorData.screenResolution?.height}</div>
                      <div>Touch: {visitorData.device?.isTouchEnabled ? "Yes" : "No"}</div>
                    </div>
                  )}

                  {/* Connection & Storage */}
                  {visitorData && (
                    <div style={sectionStyle}>
                      <strong>Technical Info:</strong>
                      <div>Connection: {visitorData.connectionType}</div>
                      <div>Language: {visitorData.language}</div>
                      <div>Timezone: {visitorData.timezone}</div>
                      <div>LocalStorage: {visitorData.localStorageEnabled ? "✓" : "✗"}</div>
                      <div>SessionStorage: {visitorData.sessionStorageEnabled ? "✓" : "✗"}</div>
                      <div>Cookies: {visitorData.cookiesEnabled ? "✓" : "✗"}</div>
                    </div>
                  )}

                  {/* Interaction Data */}
                  {visitorData?.interactionData && (
                    <div style={sectionStyle}>
                      <strong>User Interaction:</strong>
                      <div>Clicks: {visitorData.interactionData.clicks}</div>
                      <div>Scroll Depth: {visitorData.interactionData.scrollDepth?.toFixed(1)}%</div>
                      <div>Time on Page: {(visitorData.interactionData.timeOnPage / 1000).toFixed(1)}s</div>
                    </div>
                  )}

                  {/* Analytics Summary */}
                  {summary && (
                    <div style={sectionStyle}>
                      <strong>Analytics Summary:</strong>
                      <div>Total Events: {summary.totalEvents}</div>
                      <div>Page Views: {summary.pageViews}</div>
                      <div>Unique Visitors: {summary.uniqueVisitors}</div>
                      <div>Unique Sessions: {summary.uniqueSessions}</div>
                      <div>Avg Time on Page: {(summary.avgTimeOnPage / 1000).toFixed(1)}s</div>
                    </div>
                  )}

                  {/* Geolocation */}
                  {visitorData?.geolocation && (
                    <div style={sectionStyle}>
                      <strong>Geolocation:</strong>
                      <div>Lat: {visitorData.geolocation.latitude.toFixed(4)}</div>
                      <div>Long: {visitorData.geolocation.longitude.toFixed(4)}</div>
                      <div>Accuracy: ±{visitorData.geolocation.accuracy.toFixed(0)}m</div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Table View */}
                  <div style={{ overflowX: "auto", marginBottom: "15px" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "11px",
                      }}
                    >
                      <thead>
                        <tr>
                          <SortHeader label="Time" sortKey="timestamp" />
                          <SortHeader label="Type" sortKey="type" />
                          <SortHeader label="Visitor ID" sortKey="data.visitorId" />
                          <SortHeader label="Browser" sortKey="data.browser.name" />
                          <SortHeader label="Device" sortKey="data.device.type" />
                          <SortHeader label="OS" sortKey="data.os.name" />
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedEvents().map((event, idx) => (
                          <tr
                            key={idx}
                            style={{
                              backgroundColor: idx % 2 === 0 ? (isDark ? "#1a1a1a" : "#fff") : (isDark ? "#222" : "#f5f5f5"),
                              borderBottom: `1px solid ${isDark ? "#555" : "#ddd"}`,
                            }}
                          >
                            <td
                              style={{
                                padding: "8px",
                                border: `1px solid ${isDark ? "#555" : "#ddd"}`,
                                whiteSpace: "nowrap",
                                fontSize: "10px",
                              }}
                            >
                              {new Date(event.timestamp || event.data?.timestamp).toLocaleTimeString()}
                            </td>
                            <td style={{ padding: "8px", border: `1px solid ${isDark ? "#555" : "#ddd"}` }}>
                              {event.type}
                            </td>
                            <td
                              style={{
                                padding: "8px",
                                border: `1px solid ${isDark ? "#555" : "#ddd"}`,
                                fontSize: "10px",
                                maxWidth: "100px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              title={event.data?.visitorId}
                            >
                              {event.data?.visitorId?.substring(0, 8)}...
                            </td>
                            <td style={{ padding: "8px", border: `1px solid ${isDark ? "#555" : "#ddd"}` }}>
                              {event.data?.browser?.name || "N/A"}
                            </td>
                            <td style={{ padding: "8px", border: `1px solid ${isDark ? "#555" : "#ddd"}` }}>
                              {event.data?.device?.type || "N/A"}
                            </td>
                            <td style={{ padding: "8px", border: `1px solid ${isDark ? "#555" : "#ddd"}` }}>
                              {event.data?.os?.name || "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {events.length === 0 && (
                      <div style={{ textAlign: "center", padding: "20px", fontSize: "12px" }}>
                        No events to display
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: "11px", marginBottom: "10px" }}>
                    📊 Showing {events.length} events (Click column headers to sort)
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                <button
                  style={{ ...buttonStyle, fontSize: "11px", padding: "5px 10px" }}
                  onClick={handleRequestGeo}
                >
                  Get Geolocation
                </button>
                <button
                  style={{ ...buttonStyle, fontSize: "11px", padding: "5px 10px" }}
                  onClick={() => analyticsExporter.exportAsJSON()}
                >
                  Export JSON
                </button>
                <button
                  style={{ ...buttonStyle, fontSize: "11px", padding: "5px 10px" }}
                  onClick={() => analyticsExporter.exportAsCSV()}
                >
                  Export CSV
                </button>
                <button
                  style={{ ...buttonStyle, fontSize: "11px", padding: "5px 10px" }}
                  onClick={() => {
                    analyticsExporter.clearAnalytics();
                    setSummary(null);
                    setEvents([]);
                  }}
                >
                  Clear Data
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AnalyticsDebugPanel;
