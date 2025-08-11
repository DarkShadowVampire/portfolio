import React from "react";

const Social: React.FC = () => {
  return (
    <div className="social__icons">
      <div className="email">
        <a
          href="mailto:srvswarnakar@gmail.com"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Send email to srvswarnakar@gmail.com"
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
          href="https://instagram.com/dark_shadow_vampire"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Instagram profile"
        >
          <img src="/img/instagram-icon.svg" alt="Instagram icon" />
        </a>
      </div>
    </div>
  );
};

export default Social;
