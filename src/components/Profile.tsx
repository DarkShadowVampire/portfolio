import React from "react";

const Profile: React.FC = () => {
    const viewResume = () => {
        window.open('/res/Sourav Swarnakar CV.pdf', '_blank', 'noopener,noreferrer');
    };
    const hireMe = () => {
        window.open('mailto:srvswarnakar@gmail.com', '_self');
    };
    return (
        <div className="profile">
            <img src="/profile.png" alt="Profile of Sourav Swarnakar" className="profile__image" />
            <div className="profile__details">
                <h1>Sourav Swarnakar</h1>
                <p>Front-End Developer</p>
            </div>
            <div className="action__buttons">
                <button className="resume__button" onClick={viewResume}>View Resume</button>
                <button className="hire__button" onClick={hireMe}>Hire Me!</button>
            </div>
        </div>
    );
};

export default Profile;
