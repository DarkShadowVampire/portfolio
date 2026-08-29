/**
 * Comprehensive Visitor Tracking Service
 * Collects comprehensive visitor data including device info, location, behavior, and more
 */

export interface VisitorData {
  // Session & Timing
  sessionId: string;
  timestamp: number;
  pageLoadTime: number;
  
  // Page Information
  pageUrl: string;
  pageTitle: string;
  referrer: string;
  
  // Browser & Device
  userAgent: string;
  browser: {
    name: string;
    version: string;
  };
  os: {
    name: string;
    version: string;
  };
  device: {
    type: "mobile" | "tablet" | "desktop";
    isTouchEnabled: boolean;
  };
  
  // Screen & Display
  screenResolution: {
    width: number;
    height: number;
  };
  screenColorDepth: number;
  pixelDepth: number;
  windowSize: {
    width: number;
    height: number;
  };
  
  // Network & Performance
  connectionType: string;
  language: string;
  timezone: string;
  timezoneOffset: number;
  
  // Geolocation (if available)
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  
  // Local Storage Capabilities
  localStorageEnabled: boolean;
  sessionStorageEnabled: boolean;
  cookiesEnabled: boolean;
  
  // Interaction Data
  interactionData?: {
    clicks: number;
    scrollDepth: number;
    timeOnPage: number;
    lastActiveTime: number;
  };
  
  // Custom Data
  customData?: Record<string, any>;
}

export interface PageViewEvent {
  type: "pageview";
  visitorId: string;
  sessionId: string;
  timestamp: number;
  pageUrl: string;
  pageTitle: string;
  referrer: string;
  timeOnPreviousPage: number;
}

export interface InteractionEvent {
  type: "click" | "scroll" | "form_interaction" | "custom";
  visitorId: string;
  sessionId: string;
  timestamp: number;
  target?: string;
  value?: any;
}

export interface AnalyticsEvent {
  type: "pageview" | "interaction" | "session_start" | "session_end";
  data: PageViewEvent | InteractionEvent | VisitorData;
}

class VisitorTrackingService {
  private visitorId: string;
  private sessionId: string;
  private sessionStartTime: number;
  private pageViewStartTime: number;
  private events: AnalyticsEvent[] = [];
  private clickCount: number = 0;
  private maxScrollDepth: number = 0;
  private isTracking: boolean = false;
  private analyticsEndpoint: string = "";
  private batchSize: number = 10;
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;
  private lastInteractionTime: number = Date.now();
  private inactivityTimeout: number = 900000; // 15 minutes

  constructor() {
    this.visitorId = this.getOrCreateVisitorId();
    this.sessionId = this.getOrCreateSessionId();
    this.sessionStartTime = Date.now();
    this.pageViewStartTime = Date.now();
  }

  /**
   * Initialize the tracking service
   */
  public init(analyticsEndpoint?: string, options?: { batchSize?: number; flushInterval?: number }): void {
    if (this.isTracking) return;

    this.analyticsEndpoint = analyticsEndpoint || "";
    if (options?.batchSize) this.batchSize = options.batchSize;
    if (options?.flushInterval) this.flushInterval = options.flushInterval;

    this.isTracking = true;

    // Collect initial visitor data
    this.recordSessionStart();

    // Setup event listeners
    this.setupEventListeners();

    // Setup auto-flush
    this.startAutoFlush();

    // Handle page unload
    window.addEventListener("beforeunload", () => {
      this.recordSessionEnd();
      this.flush();
    });

    // Handle visibility change for session management
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.recordSessionEnd();
      } else {
        this.sessionId = this.getOrCreateSessionId();
        this.recordSessionStart();
      }
    });
  }

  /**
   * Set analytics endpoint for sending data
   */
  public setAnalyticsEndpoint(endpoint: string): void {
    this.analyticsEndpoint = endpoint;
  }

  /**
   * Track a page view
   */
  public trackPageView(pageTitle?: string): void {
    const timeOnPreviousPage = Date.now() - this.pageViewStartTime;
    this.pageViewStartTime = Date.now();

    const pageViewEvent: PageViewEvent = {
      type: "pageview",
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      pageUrl: window.location.href,
      pageTitle: pageTitle || document.title,
      referrer: document.referrer,
      timeOnPreviousPage,
    };

    this.events.push({
      type: "pageview",
      data: pageViewEvent,
    });

    this.checkFlush();
  }

  /**
   * Track a custom event
   */
  public trackEvent(
    eventType: "click" | "scroll" | "form_interaction" | "custom",
    target?: string,
    value?: any
  ): void {
    const event: InteractionEvent = {
      type: eventType,
      visitorId: this.visitorId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      target,
      value,
    };

    this.events.push({
      type: "interaction",
      data: event,
    });

    this.lastInteractionTime = Date.now();
    this.checkFlush();
  }

  /**
   * Add custom data to tracking
   */
  public setCustomData(key: string, value: any): void {
    this.trackEvent("custom", key, value);
  }

  /**
   * Get visitor data
   */
  public getVisitorData(): VisitorData {
    const now = Date.now();
    const interactionData = {
      clicks: this.clickCount,
      scrollDepth: this.maxScrollDepth,
      timeOnPage: now - this.pageViewStartTime,
      lastActiveTime: this.lastInteractionTime,
    };

    return {
      sessionId: this.sessionId,
      timestamp: now,
      pageLoadTime: performance.now(),
      pageUrl: window.location.href,
      pageTitle: document.title,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      browser: this.parseBrowser(),
      os: this.parseOS(),
      device: this.getDeviceInfo(),
      screenResolution: {
        width: window.screen.width,
        height: window.screen.height,
      },
      screenColorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connectionType: this.getConnectionType(),
      language: navigator.language || "unknown",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      localStorageEnabled: this.isLocalStorageEnabled(),
      sessionStorageEnabled: this.isSessionStorageEnabled(),
      cookiesEnabled: this.areCookiesEnabled(),
      interactionData,
    };
  }

  /**
   * Request geolocation (requires user permission)
   */
  public requestGeolocation(): Promise<GeolocationCoordinates | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        () => {
          resolve(null);
        },
        { timeout: 5000 }
      );
    });
  }

  /**
   * Flush all collected events
   */
  public async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    if (this.analyticsEndpoint) {
      try {
        await this.sendToAnalytics(eventsToSend);
      } catch (error) {
        console.error("Failed to send analytics:", error);
        // Re-add events if sending failed
        this.events = eventsToSend.concat(this.events);
      }
    } else {
      // Store locally if no endpoint is set
      this.storeLocally(eventsToSend);
    }
  }

  /**
   * Get all tracked events
   */
  public getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  /**
   * Clear all events
   */
  public clearEvents(): void {
    this.events = [];
  }

  /**
   * Get visitor ID
   */
  public getVisitorId(): string {
    return this.visitorId;
  }

  /**
   * Get session ID
   */
  public getSessionId(): string {
    return this.sessionId;
  }

  // Private methods

  private getOrCreateVisitorId(): string {
    const storageKey = "portfolio_visitor_id";
    let visitorId = localStorage.getItem(storageKey);

    if (!visitorId) {
      visitorId = this.generateUUID();
      try {
        localStorage.setItem(storageKey, visitorId);
      } catch {
        // localStorage might be disabled
      }
    }

    return visitorId;
  }

  private getOrCreateSessionId(): string {
    const storageKey = "portfolio_session_id";
    let sessionId = sessionStorage.getItem(storageKey);

    if (!sessionId) {
      sessionId = this.generateUUID();
      try {
        sessionStorage.setItem(storageKey, sessionId);
      } catch {
        // sessionStorage might be disabled
      }
    }

    return sessionId;
  }

  private recordSessionStart(): void {
    const visitorData = this.getVisitorData();
    this.events.push({
      type: "session_start",
      data: visitorData,
    });
  }

  private recordSessionEnd(): void {
    const visitorData = this.getVisitorData();
    this.events.push({
      type: "session_end",
      data: visitorData,
    });
  }

  private setupEventListeners(): void {
    // Track clicks
    document.addEventListener("click", (e) => {
      this.clickCount++;
      const target = (e.target as HTMLElement).tagName || "unknown";
      this.trackEvent("click", target);
    });

    // Track scroll depth
    window.addEventListener("scroll", () => {
      const scrollDepth =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollDepth);
      this.lastInteractionTime = Date.now();
    });

    // Track user activity
    window.addEventListener("keydown", () => {
      this.lastInteractionTime = Date.now();
    });

    window.addEventListener("mousemove", () => {
      this.lastInteractionTime = Date.now();
    });

    window.addEventListener("touchstart", () => {
      this.lastInteractionTime = Date.now();
    });

    // Check for inactivity
    setInterval(() => {
      const inactivityDuration = Date.now() - this.lastInteractionTime;
      if (inactivityDuration > this.inactivityTimeout) {
        this.sessionId = this.getOrCreateSessionId();
        this.recordSessionStart();
      }
    }, 60000); // Check every minute
  }

  private startAutoFlush(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private checkFlush(): void {
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  private parseBrowser(): { name: string; version: string } {
    const ua = navigator.userAgent;
    let browserName = "Unknown";
    let version = "Unknown";

    if (ua.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      version = ua.split("Firefox/")[1]?.split(" ")[0] || "Unknown";
    } else if (ua.indexOf("SamsungBrowser") > -1) {
      browserName = "Samsung Internet";
      version = ua.split("SamsungBrowser/")[1]?.split(" ")[0] || "Unknown";
    } else if (ua.indexOf("Chrome") > -1 && ua.indexOf("Chromium") === -1) {
      browserName = "Chrome";
      version = ua.split("Chrome/")[1]?.split(" ")[0] || "Unknown";
    } else if (ua.indexOf("Safari") > -1) {
      browserName = "Safari";
      version = ua.split("Version/")[1]?.split(" ")[0] || "Unknown";
    } else if (ua.indexOf("Edge") > -1) {
      browserName = "Edge";
      version = ua.split("Edge/")[1]?.split(" ")[0] || "Unknown";
    }

    return { name: browserName, version };
  }

  private parseOS(): { name: string; version: string } {
    const ua = navigator.userAgent;
    let osName = "Unknown";
    let version = "Unknown";

    if (ua.indexOf("Win") > -1) {
      osName = "Windows";
      version = ua.indexOf("Windows NT 10.0") > -1 ? "10/11" : "Unknown";
    } else if (ua.indexOf("Mac") > -1) {
      osName = "macOS";
      version = ua.split("Mac OS X ")[1]?.split(" ")[0]?.replace(/_/g, ".") || "Unknown";
    } else if (ua.indexOf("Android") > -1) {
      osName = "Android";
      version = ua.split("Android ")[1]?.split(";")[0] || "Unknown";
    } else if (ua.indexOf("like Mac") > -1) {
      osName = "iOS";
      version = ua.split("OS ")[1]?.split(" ")[0]?.replace(/_/g, ".") || "Unknown";
    } else if (ua.indexOf("Linux") > -1) {
      osName = "Linux";
      version = "Unknown";
    }

    return { name: osName, version };
  }

  private getDeviceInfo(): VisitorData["device"] {
    const ua = navigator.userAgent.toLowerCase();
    let type: "mobile" | "tablet" | "desktop" = "desktop";

    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      type = "tablet";
    } else if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
      type = "mobile";
    }

    return {
      type,
      isTouchEnabled: this.isTouchEnabled(),
    };
  }

  private isTouchEnabled(): boolean {
    return (
      () =>
        !!(
          typeof window !== "undefined" &&
          ("ontouchstart" in window ||
            (navigator.maxTouchPoints !== undefined && navigator.maxTouchPoints > 0) ||
            ((navigator as any).msMaxTouchPoints !== undefined && (navigator as any).msMaxTouchPoints > 0))
        )
    )();
  }

  private getConnectionType(): string {
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    if (!connection) {
      return "unknown";
    }

    return connection.effectiveType || connection.type || "unknown";
  }

  private isLocalStorageEnabled(): boolean {
    try {
      const test = "__test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private isSessionStorageEnabled(): boolean {
    try {
      const test = "__test__";
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private areCookiesEnabled(): boolean {
    try {
      document.cookie = "test=1; path=/";
      const enabled = document.cookie.indexOf("test=") !== -1;
      document.cookie = "test=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return enabled;
    } catch {
      return false;
    }
  }

  private async sendToAnalytics(events: AnalyticsEvent[]): Promise<void> {
    if (!this.analyticsEndpoint) return;

    const response = await fetch(this.analyticsEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        events,
        timestamp: Date.now(),
      }),
      keepalive: true,
    });

    if (!response.ok) {
      throw new Error(`Analytics request failed with status ${response.status}`);
    }
  }

  private storeLocally(events: AnalyticsEvent[]): void {
    try {
      const storageKey = "portfolio_analytics_events";
      const stored = localStorage.getItem(storageKey);
      const allEvents = stored ? JSON.parse(stored) : [];
      allEvents.push(...events);
      // Keep only last 1000 events
      if (allEvents.length > 1000) {
        allEvents.shift();
      }
      localStorage.setItem(storageKey, JSON.stringify(allEvents));
    } catch (error) {
      console.error("Failed to store events locally:", error);
    }
  }

  private generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

// Export singleton instance
export const visitorTracking = new VisitorTrackingService();

export default visitorTracking;
