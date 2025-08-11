import React from "react";
import ProjectCard from "./ProjectCard";
import AllProjects from "../res/Projects";

interface Project {
    name: string;
    description: string;
    techStack: string[];
    url: string;
    // Add an id field if available for better keys
    id?: string | number;
}

const Projects: React.FC = () => {
    return (
        <div className='projects'>
            <h4>Projects</h4>
            <div className='projects__all'>
                {AllProjects.map((project: Project, index: number) => (
                    <ProjectCard
                        key={project.id ?? `${project.name}-${index}`}
                        name={project.name}
                        description={project.description}
                        techStack={project.techStack}
                        url={project.url}
                    />
                ))}
            </div>
        </div>
    );
};

export default Projects;
