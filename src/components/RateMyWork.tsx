import React, { useState } from "react";

interface RateMyWorkProps {
  onBack: () => void;
}

const RateMyWork: React.FC<RateMyWorkProps> = ({ onBack }) => {
  const [liked, setLiked] = useState(false);
  const [noPosition, setNoPosition] = useState({ top: 50, left: 65 });

  const moveNoButton = () => {
    setNoPosition({
      top: Math.floor(Math.random() * 65) + 15,
      left: Math.floor(Math.random() * 70) + 15,
    });
  };

  return (
    <main className="rate-page" aria-labelledby="rate-work-title">
      <button className="rate-page__back" onClick={onBack} type="button">
        <span aria-hidden="true">←</span> Back to portfolio
      </button>
      {!liked ? (
        <div className="rate-page__question">
          <p className="rate-work__eyebrow">A quick question</p>
          <h1 id="rate-work-title">Do you like my work?</h1>
          <p>Be honest. Or at least choose the fun answer.</p>
          <div className="rate-page__actions">
            <button className="rate-page__yes" onClick={() => setLiked(true)} type="button">
              Yes, I do! <span aria-hidden="true">↗</span>
            </button>
            <button
              className="rate-page__no"
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onFocus={moveNoButton}
              style={{ top: `${noPosition.top}%`, left: `${noPosition.left}%` }}
              type="button"
            >
              No
            </button>
          </div>
        </div>
      ) : (
        <div className="rate-page__thanks">
          <p className="rate-work__eyebrow">That made my day</p>
          <h1>Thank you!</h1>
          <p>Let&apos;s build something useful, memorable, and a little bit unexpected together.</p>
          <a className="rate-page__hire" href="mailto:happysouravswarnakar@gmail.com">
            Hire me <span aria-hidden="true">↗</span>
          </a>
        </div>
      )}
    </main>
  );
};

export default RateMyWork;
