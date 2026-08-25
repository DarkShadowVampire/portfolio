import React from "react";

interface SocialProps {
  onRateWork: () => void;
}

const Social: React.FC<SocialProps> = ({ onRateWork }) => {
  return (
    <div className="social__icons">
      <div className="social__group">
        <div className="email">
        <a
          href="mailto:happysouravswarnakar@gmail.com"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Send email to happysouravswarnakar@gmail.com"
        >
          <img src="/img/email-icon.svg" alt="Email icon" />
        </a>
        </div>
        <div className="github">
        <a
          href="https://github.com/DarkShadowVampire"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub profile"
        >
          <img src="/img/github-icon.svg" alt="GitHub icon" />
        </a>
        </div>
        <div className="twitter">
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Twitter profile"
        >
          <img src="/img/twitter-icon.svg" alt="Twitter icon" />
        </a>
        </div>
        <div className="hackerrank">
        <a
          href="https://www.hackerrank.com/happysouravswar1"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="HackerRank profile"
        >
          <img src="/img/hackerrank-icon.svg" alt="HackerRank icon" />
        </a>
        </div>
        <div className="instagram">
        <a
          href="https://instagram.com/sourav.swarnakar_"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Instagram profile"
        >
          <img src="/img/instagram-icon.svg" alt="Instagram icon" />
        </a>
        </div>
      </div>
      <button className="footer__rate-link" onClick={onRateWork} type="button">
        <span>Rate My Work!</span>
        <span className="footer__rate-arrow" aria-hidden="true">↗</span>
      </button>
    </div>
  );
};

export default Social;
