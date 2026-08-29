import { useEffect } from "react";
import visitorTracking from "../services/visitorTracking";

interface UseVisitorTrackingOptions {
  analyticsEndpoint?: string;
  trackPageView?: boolean;
  batchSize?: number;
  flushInterval?: number;
}

/**
 * React hook for visitor tracking
 * Call this once in your main App component
 */
export const useVisitorTracking = (options?: UseVisitorTrackingOptions) => {
  useEffect(() => {
    // Initialize tracking
    visitorTracking.init(options?.analyticsEndpoint, {
      batchSize: options?.batchSize,
      flushInterval: options?.flushInterval,
    });

    // Track initial page view if enabled
    if (options?.trackPageView !== false) {
      visitorTracking.trackPageView();
    }

    // Cleanup on unmount
    return () => {
      visitorTracking.flush();
    };
  }, [options?.analyticsEndpoint, options?.batchSize, options?.flushInterval, options?.trackPageView]);

  return {
    getVisitorId: () => visitorTracking.getVisitorId(),
    getSessionId: () => visitorTracking.getSessionId(),
    getVisitorData: () => visitorTracking.getVisitorData(),
    trackPageView: (title?: string) => visitorTracking.trackPageView(title),
    trackEvent: (
      type: "click" | "scroll" | "form_interaction" | "custom",
      target?: string,
      value?: any
    ) => visitorTracking.trackEvent(type, target, value),
    setCustomData: (key: string, value: any) => visitorTracking.setCustomData(key, value),
    requestGeolocation: () => visitorTracking.requestGeolocation(),
    getEvents: () => visitorTracking.getEvents(),
    getStoredAnalytics: () => {
      try {
        return JSON.parse(localStorage.getItem("portfolio_analytics_events") || "[]");
      } catch {
        return [];
      }
    },
  };
};

export default useVisitorTracking;
