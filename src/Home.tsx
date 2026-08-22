import Profile from "./components/Profile";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import Social from "./components/Social";
import RateMyWork from "./components/RateMyWork";
import "./Home.scss";
import "./Redesign.scss";
import { useState } from "react";

const Home = () => {
  const [isDark, setIsDark] = useState(() => {
    return window.localStorage.getItem("portfolio-theme") === "dark";
  });
  const [showRatePage, setShowRatePage] = useState(false);

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
            <Projects />
            <Social onRateWork={openRatePage} />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Home;
