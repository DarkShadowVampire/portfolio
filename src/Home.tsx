import Profile from "./components/Profile";
import About from "./components/About";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import Social from "./components/Social";
import RateMyWork from "./components/RateMyWork";
import AnalyticsDebugPanel from "./components/AnalyticsDebugPanel";
import "./Home.scss";
import "./Redesign.scss";
import { useState } from "react";
import useVisitorTracking from "./hooks/useVisitorTracking";

const Home = () => {
  const [isDark, setIsDark] = useState(() => {
    return window.localStorage.getItem("portfolio-theme") === "dark";
  });
  const [showRatePage, setShowRatePage] = useState(false);

  // Initialize visitor tracking with all data collection
  useVisitorTracking({
    trackPageView: true,
    batchSize: 10,
    flushInterval: 30000, // Flush every 30 seconds
    // Optional: Set analytics endpoint if you have a backend
    // analyticsEndpoint: "https://your-analytics-endpoint.com/track",
  });

  const toggleTheme = () => {
    setIsDark((currentIsDark) => {
      const nextIsDark = !currentIsDark;
      window.localStorage.setItem(
        "portfolio-theme",
        nextIsDark ? "dark" : "light"
      );
      return nextIsDark;
    });
  };

  const openRatePage = () => {
    setShowRatePage(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const returnToPortfolio = () => {
    setShowRatePage(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`container${isDark ? " dark" : ""}`}>
      <button
        className={`theme__button${isDark ? " is-dark" : ""}`}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
        aria-pressed={isDark}
        title={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
        <span className="theme__icon theme__icon--light" aria-hidden="true">☀</span>
        <span className="theme__icon theme__icon--dark" aria-hidden="true">☾</span>
        <span className="theme__thumb" aria-hidden="true" />
      </button>
      <header className="site-nav">
        <a className="site-nav__brand" href="#top" aria-label="Back to top">
          SS
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#certifications">Certifications</a>
          <a href="#projects">Projects</a>
        </nav>
      </header>
      {showRatePage ? (
        <RateMyWork onBack={returnToPortfolio} />
      ) : (
        <>
          <main id="top" className="page-shell">
            <Profile />
            <About />
            <Experience />
            <Certifications />
            <Projects />
            <Social onRateWork={openRatePage} />
          </main>
          <Footer />
        </>
      )}
      <AnalyticsDebugPanel isDark={isDark} />
    </div>
  );
};

export default Home;
