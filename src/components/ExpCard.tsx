import React from "react";

interface ExpCardProps {
  designation: string;
  company: string;
  duration: string;
  location: string;
  technologies?: string; 
}

const ExpCard: React.FC<ExpCardProps> = ({
  designation,
  company,
  duration,
  location,
  technologies,
}) => {
  return (
    <div className="exp__card">
      <img
        src="img/appldev.png"
        alt="experience img"
        className="exp__card--image"
      />
      <div className="exp__card--details">
        <p className="designation">{designation}</p>
        <p className="company">
          {company}, {location}
        </p>
        <p className="duration">{duration}</p>
      </div>
      <div className="exp__card--footer">
        <p>Technologies: {technologies}</p>
      </div>
    </div>
  );
};

export default ExpCard;
