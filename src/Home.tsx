import Profile from "./components/Profile";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import Social from "./components/Social";
import "./Home.scss";
const Home = () => {
  return (
    <div className="container">
      <div className="wall"></div>
      <Profile />
      <About />
      <Experience />
      <Projects />
      <Social />
      <Footer />
    </div>
  );
};

export default Home;
