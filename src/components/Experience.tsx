import React from "react";
import ExpCard from "./ExpCard";
import AllExperiences from "../res/Experiences";

interface ExperienceItem {
  designation: string;
  company: string;
  duration: string;
  location: string;
  technologies?: string;
}

const Experience: React.FC = () => {
  return (
    <div className="experience">
      <h4>Experience</h4>
      <div className="experience__all">
        {AllExperiences.map((experience: ExperienceItem, idx: number) => (
          <ExpCard
            key={`${experience.company}-${experience.designation}-${experience.duration}-${idx}`}
            designation={experience.designation}
            company={experience.company}
            duration={experience.duration}
            location={experience.location}
            technologies={experience.technologies}
          />
        ))}
      </div>
    </div>
  );
};

export default Experience;
