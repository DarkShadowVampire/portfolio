import React from "react";

const Social = () => {
    return (
        <div className='social__icons'>
            <div className='email'>
                <a
                    href='mailto:srvswarnakar@gmail.com'
                    target='_blank'
                    rel='noreferrer noopener'
                >
                    <img src='/img/email-icon.svg' alt='' />{" "}
                </a>
            </div>
            <div className='github'>
                <a
                    href='https://github.com/DarkShadowVampire'
                    target='_blank'
                    rel='noreferrer noopener'
                >
                    <img src='/img/github-icon.svg' alt='' />{" "}
                </a>
            </div>
            <div className='twitter'>
                <a
                    href='#'
                    target='_blank'
                    rel='noreferrer noopener'
                >
                    <img src='/img/twitter-icon.svg' alt='' />{" "}
                </a>
            </div>
            <div className='hackerrank'>
                <a
                    href='#'
                    target='_blank'
                    rel='noreferrer noopener'
                >
                    <img src='/img/hackerrank-icon.svg' alt='' />{" "}
                </a>
            </div>
            <div className='instagram'>
                <a
                    href='https://instagram.com/dark_shadow_vampire'
                    target='_blank'
                    rel='noreferrer noopener'
                >
                    <img src='/img/instagram-icon.svg' alt='' />{" "}
                </a>
            </div>
        </div>
    );
};

export default Social;
