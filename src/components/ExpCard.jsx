import React from "react";

const ExpCard = (props) => {
    const {designation, company, duration, location} = props;
    return (
        <div className='exp__card'>
            <img
                src='img/appldev.png'
                alt='experience img'
                className='exp__card--image'
            />
            <div className='exp__card--details'>
                <p className='designation'>{designation}</p>
                <p className='company'>{company}, {location}</p>
                <p className='duration'>{duration}</p>
            </div>
            <div className='exp__card--footer'>
                <p>Technologies: Angular, React, Flutter, SCSS, Node Js, Express, Jest, ES6, Git </p>
            </div>
        </div>
    );
};

export default ExpCard;
