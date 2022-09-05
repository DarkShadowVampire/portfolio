import React from "react";

const ProjectCard = (props) => {
    const { name, description, techStack, url } = props;
    return (
        <div className='project__card'>
            <div className='project__card--header'>
                <p className='project__title'>{name}</p>
            </div>
            <div className='project__card--body'>
                <p className='project__description'>{description}</p>
                <p className='tech__stack'>
                    <span className='tech__stack--title'>Tech stack:</span>{" "}
                    {techStack.join(", ")}
                </p>
            </div>
            <div className='project__card--footer'>
                <a href={url} target='_blank' rel='noreferrer'>
                    View Project{" "}
                    <img
                        src='img/github-icon.svg'
                        alt='github link'
                        className='github__icon'
                    />
                </a>
            </div>
        </div>
    );
};

export default ProjectCard;
