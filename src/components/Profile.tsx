import React from "react";

const Profile: React.FC = () => {
    const viewResume = () => {
        window.open('/res/Sourav_Swarnakar 4.pdf', '_blank', 'noopener,noreferrer');
    };
    const hireMe = () => {
        window.open('mailto:happysouravswarnakar@gmail.com', '_self');
    };
    return (
        <div className="profile">
            <img src="/profile.JPG" alt="Profile of Sourav Swarnakar" className="profile__image" />
            <div className="profile__details">
                <p className="profile__eyebrow">Guidewire Developer / Kolkata, IN</p>
                <h1>Sourav Swarnakar</h1>
                <p className="profile__role">Guidewire Portal Developer</p>
                <p className="profile__intro">I build clear, useful interfaces for complex products, with a soft spot for thoughtful details.</p>
            </div>
            <div className="action__buttons">
                <button className="resume__button" onClick={viewResume}>View Resume</button>
                <button className="hire__button" onClick={hireMe}>Hire Me!</button>
            </div>
        </div>
    );
};

export default Profile;
