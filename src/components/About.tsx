import React from "react";

const About: React.FC = () => {
  return (
    <section className="about">
      <h4>About me</h4>
      <p>
        I am a software developer based in Kolkata, India. I have a passion for
        building web applications and I primarily work on Guidewire Portal &
        MERN stack application development. I love to learn new technologies. I
        am currently working in a Big 4 MNC.
      </p>
      <address className="contact">
        <div className="location">
          <p className="contact__type">Location</p>
          <p className="contact__info">Kolkata, India</p>
        </div>
        <div className="website">
          <p className="contact__type">Website</p>
          <a
            href="https://sourav-swarnakar.netlify.app/"
            target="_blank"
            rel="noreferrer noopener"
            className="contact__info"
            aria-label="Personal website (opens in a new tab)"
          >
            sourav-swarnakar.netlify.app &#8599;
          </a>
        </div>
        <div className="email">
          <p className="contact__type">Email</p>
          <a
            href="mailto:srvswarnakar@gmail.com"
            target="_blank"
            rel="noreferrer noopener"
            className="contact__info"
            aria-label="Email (opens in a new tab)"
          >
            srvswarnakar@gmail.com &#8599;
          </a>
        </div>
        <div className="github">
          <p className="contact__type">GitHub</p>
          <a
            href="https://github.com/DarkShadowVampire"
            target="_blank"
            rel="noreferrer noopener"
            className="contact__info"
            aria-label="GitHub profile (opens in a new tab)"
          >
            @DarkShadowVampire &#8599;
          </a>
        </div>
      </address>
    </section>
  );
};

export default About;
