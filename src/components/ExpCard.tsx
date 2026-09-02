import React from "react";

interface ExpCardProps {
  designation: string;
  company: string;
  duration: string;
  location: string;
  technologies?: string;
  logo?: string;
  brandColor?: string;
}

const ExpCard: React.FC<ExpCardProps> = ({
  designation,
  company,
  duration,
  location,
  technologies,
  logo,
  brandColor,
}) => {
  const cardStyle = brandColor
    ? {
        "--brand-color": brandColor,
      } as React.CSSProperties & { "--brand-color": string }
    : {};

  return (
    <div className="exp__card" style={cardStyle}>
      <img
        src={logo || "img/appldev.png"}
        alt={`${company} logo`}
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
